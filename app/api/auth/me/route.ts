import { NextResponse } from "next/server";
import { getGitHubToken, GITHUB_TOKEN_COOKIE, GITHUB_USER_COOKIE } from "@/lib/auth";

/**
 * GET /api/auth/me
 * Returns the current authenticated user info.
 * Reads gh_access_token cookie and verifies it with GitHub.
 */
export async function GET() {
  try {
    const token = await getGitHubToken();

    // If using a server-level token (not user token), return unauthenticated
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Verify the token is still valid by hitting the GitHub API
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "CodeLore-App",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const userData = await response.json();

    return NextResponse.json({
      authenticated: true,
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

/**
 * DELETE /api/auth/me
 * Logs the user out by clearing auth cookies.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(GITHUB_TOKEN_COOKIE);
  response.cookies.delete(GITHUB_USER_COOKIE);
  return response;
}
