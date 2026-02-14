import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store";
import { apiClient } from "./api";

/**
 * Custom hook for managing user session
 * - Validates token expiry
 * - Handles session timeout
 * - Auto-logout on inactivity
 * - Updates last activity timestamp
 */
export function useSession() {
  const router = useRouter();
  const { isAuthenticated, token, isTokenExpired, logout, updateActivity } =
    useAuthStore();

  // Check session validity
  const checkSession = useCallback(() => {
    if (isAuthenticated && isTokenExpired()) {
      console.log("Session expired, logging out...");
      logout();
      router.push("/login?expired=true");
    }
  }, [isAuthenticated, isTokenExpired, logout, router]);

  // Update activity on user interaction
  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      updateActivity();
    }
  }, [isAuthenticated, updateActivity]);

  // Set up API callbacks for token expiry and unauthorized
  useEffect(() => {
    apiClient.setTokenExpiredCallback(() => {
      console.log("Token expired (from API), logging out...");
      logout();
      router.push("/login?expired=true");
    });

    apiClient.setUnauthorizedCallback(() => {
      console.log("Unauthorized (from API), logging out...");
      logout();
      router.push("/login?unauthorized=true");
    });
  }, [logout, router]);

  // Check session on mount and periodically
  useEffect(() => {
    checkSession();

    // Check session every minute
    const interval = setInterval(checkSession, 60 * 1000);

    return () => clearInterval(interval);
  }, [checkSession]);

  // Track user activity
  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, handleActivity]);

  // Set token in API client
  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
    } else {
      apiClient.setToken(null);
    }
  }, [token]);

  return {
    isAuthenticated,
    checkSession,
  };
}
