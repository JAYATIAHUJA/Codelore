"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

interface AuthContextType {
  user: GitHubUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Tries to read the gh_user cookie (non-httpOnly) for fast initial render.
 */
function readUserCookie(): GitHubUser | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("gh_user="));
    if (!match) return null;
    const value = decodeURIComponent(match.split("=").slice(1).join("="));
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      // Fast path: read from cookie first
      const cookieUser = readUserCookie();
      if (cookieUser) {
        setUser(cookieUser);
      }

      // Verify with server
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = useCallback(() => {
    // Redirect to GitHub OAuth flow
    window.location.href = "/api/auth/github";
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/me", { method: "DELETE" });
      // Clear the client-readable cookie
      document.cookie =
        "gh_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
