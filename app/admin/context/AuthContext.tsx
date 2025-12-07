"use client";
import { set } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface AdminUser {
  id: number;
  email: string;
}

export interface AdminAuthContextProps {
  adminUser: AdminUser | null;
  authTokens: AuthTokens | null;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => void;
  error: string | null;
  loading: boolean;
}

interface DecodedToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}

const TOKEN_AGE = 7 * 24 * 60 * 60;
const ADMIN_ROUTES = ["/admin"]; // Add all your admin routes here

// Utility to check if a token has expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Utility to get stored tokens
const getStoredTokens = () => {
  if (typeof window === "undefined") return null;

  try {
    const storedTokens = localStorage.getItem("adminAuthTokens");
    if (!storedTokens) return null;

    const tokens = JSON.parse(storedTokens) as AuthTokens;
    if (!tokens.access_token || isTokenExpired(tokens.access_token)) {
      return null;
    }

    return tokens;
  } catch {
    return null;
  }
};

const AdminAuthContext = createContext<AdminAuthContextProps | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() =>
    getStoredTokens()
  );
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const tokens = getStoredTokens();
    if (tokens?.access_token) {
      try {
        return jwtDecode(tokens.access_token) as AdminUser;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [accessTokenExpired, setAccessTokenExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to store authentication data
  const storeAuthData = useCallback((tokens: AuthTokens) => {
    localStorage.setItem("adminAuthTokens", JSON.stringify(tokens));
    //document.cookie = `admin_refresh_token=${tokens.refresh_token}; path=/; max-age=${TOKEN_AGE}; secure; samesite=strict`;
    setAuthTokens(tokens);
    setAdminUser(jwtDecode(tokens.access_token) as AdminUser);
  }, []);

  // Admin login function
  const loginAdmin = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/admin/login/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Important for handling cookies
          }
        );

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          storeAuthData(data);
          toast.success("Login successful!");
          router.push("/admin");
          setError(null);
        } else {
          toast.error(data.message || "Invalid credentials, please try again.");
          router.push("/admin/auth/sign-in");
        }
      } catch (err) {
        console.error("Login error", err);
        toast.error("An error occurred, please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [router, storeAuthData]
  );

  // Admin logout function
  const logoutAdmin = useCallback(() => {
    localStorage.removeItem("adminAuthTokens");
    document.cookie = `admin_refresh_token=; path=/; max-age=0`;
    setAuthTokens(null);
    setAdminUser(null);
    router.push("/admin/auth/sign-in");
  }, [router]);

  // Token refresh function
  const updateToken = useCallback(async () => {
    try {
      const cookies = document.cookie.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );

      const refreshToken = cookies.admin_refresh_token;

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/login/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data + "hello world");
      if (response.ok) {
        storeAuthData(data);
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (err) {
      console.error("Token refresh error:", err);
      if (
        ADMIN_ROUTES.some((route) => window.location.pathname.startsWith(route))
      ) {
        logoutAdmin();
      }
    } finally {
      setLoading(false);
    }
  }, [logoutAdmin, storeAuthData]);

  // Check authentication status on mount and route changes
  useEffect(() => {
    const checkAuth = async () => {
      if (!authTokens) {
        if (
          ADMIN_ROUTES.some((route) =>
            window.location.pathname.startsWith(route)
          )
        ) {
          router.push("/admin/auth/sign-in");
        }
        setLoading(false);
        return;
      }

      if (isTokenExpired(authTokens.access_token)) {
        await updateToken();
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [authTokens, updateToken, router]);

  // Refresh token periodically
  useEffect(() => {
    if (!authTokens) return;

    const interval = setInterval(
      () => {
        if (isTokenExpired(authTokens.access_token)) {
          updateToken();
        }
      },
      1000 * 60 * 4
    ); // Check every 4 minutes

    return () => clearInterval(interval);
  }, [authTokens, updateToken]);

  const contextData = {
    adminUser,
    authTokens,
    loginAdmin,
    logoutAdmin,
    error,
    loading,
  };

  return (
    <AdminAuthContext.Provider value={contextData}>
      {loading ? (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
          <div className="size-16 animate-spin rounded-full border-t-4 border-gray-300"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading, please wait...
          </p>
        </div>
      ) : (
        children
      )}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
