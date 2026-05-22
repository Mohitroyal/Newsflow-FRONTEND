"use client";

import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Guards a page behind authentication.
 * Redirects to /login if user is not authenticated.
 */
export function useRequireAuth() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated, user };
}
