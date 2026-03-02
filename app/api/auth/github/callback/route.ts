import { NextRequest, NextResponse } from "next/server";
import {
  getGitHubClientId,
  getGitHubClientSecret,
  getBaseUrl,
  GITHUB_TOKEN_COOKIE,
  GITHUB_USER_COOKIE,
} from "@/lib/auth";

/**
 * GET /api/auth/github/callback
 * Handles the OAuth callback from GitHub.
 * Exchanges the authorization code for an access token, fetches user info,
 * stores both in httpOnly cookies, and redirects to the workspace.
 */
export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl();

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // GitHub may redirect with an error
    if (error) {
      console.error("GitHub OAuth error:", error);
      return NextResponse.redirect(`${baseUrl}/interface?auth_error=${error}`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/interface?auth_error=no_code`);
    }

    // Verify state matches the one we stored
    const storedState = req.cookies.get("gh_oauth_state")?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        `${baseUrl}/interface?auth_error=state_mismatch`
      );
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: getGitHubClientId(),
          client_secret: getGitHubClientSecret(),
          code,
          redirect_uri: `${baseUrl}/api/auth/github/callback`,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error("Token exchange error:", tokenData);
      return NextResponse.redirect(
        `${baseUrl}/interface?auth_error=token_exchange`
      );
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "CodeLore-App",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(
        `${baseUrl}/interface?auth_error=user_fetch`
      );
    }

    const userData = await userResponse.json();
    const userInfo = JSON.stringify({
      login: userData.login,
      name: userData.name,
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
    });

    // Set cookies and redirect to workspace
    const response = NextResponse.redirect(`${baseUrl}/interface`);

    // Access token — httpOnly for security
    response.cookies.set(GITHUB_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // User info — readable by client JS for display
    response.cookies.set(GITHUB_USER_COOKIE, userInfo, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Clean up the state cookie
    response.cookies.delete("gh_oauth_state");

    return response;
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/interface?auth_error=unknown`);
  }
}
