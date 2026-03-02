import { cookies } from "next/headers";

export const GITHUB_TOKEN_COOKIE = "gh_access_token";
export const GITHUB_USER_COOKIE = "gh_user";

export function getGitHubClientId(): string {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) throw new Error("GITHUB_CLIENT_ID is not set");
  return clientId;
}

export function getGitHubClientSecret(): string {
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientSecret) throw new Error("GITHUB_CLIENT_SECRET is not set");
  return clientSecret;
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

/**
 * Read the GitHub access token from the request cookies.
 * Falls back to the server-level GITHUB_TOKEN env var if no user token.
 */
export async function getGitHubToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(GITHUB_TOKEN_COOKIE);
    if (tokenCookie?.value) return tokenCookie.value;
  } catch {
    // cookies() may throw outside of request context
  }
  return process.env.GITHUB_TOKEN || null;
}

/**
 * Build GitHub API headers with authentication if available.
 */
export function buildGitHubHeaders(token: string | null): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "CodeLore-App",
  };
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }
  return headers;
}
