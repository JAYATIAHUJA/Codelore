import { NextResponse } from "next/server";
import { getGitHubClientId, getBaseUrl } from "@/lib/auth";

/**
 * GET /api/auth/github
 * Initiates the GitHub OAuth flow by redirecting the user to GitHub's authorization page.
 */
export async function GET() {
  try {
    const clientId = getGitHubClientId();
    const baseUrl = getBaseUrl();
    const redirectUri = `${baseUrl}/api/auth/github/callback`;

    // Request 'repo' scope to access private repositories
    const scope = "repo,read:user,user:email";

    // Generate a random state for CSRF protection
    const state = crypto.randomUUID();

    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.set("client_id", clientId);
    githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
    githubAuthUrl.searchParams.set("scope", scope);
    githubAuthUrl.searchParams.set("state", state);

    // Store state in a short-lived cookie for verification
    const response = NextResponse.redirect(githubAuthUrl.toString());
    response.cookies.set("gh_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("GitHub OAuth init error:", error);
    return NextResponse.redirect(
      `${getBaseUrl()}/interface?auth_error=config`
    );
  }
}
