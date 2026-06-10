import axios from "axios";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

// Centralized base URL (imported from config for consistency)
import { API_BASE_URL } from "@/lib/config";

/** Axios instance with default config */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ─── Request Interceptor — Attach Supabase JWT ─────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  // If sending FormData, delete the default JSON Content-Type so the browser
  // can auto-set multipart/form-data with the correct boundary parameter.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  // Attach Supabase session JWT if available (using getSession)
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Helper to determine if error is retryable (network, timeout, 502/503)
function isRetryable(error: any) {
  if (!error) return false;
  const { code, response } = error;
  // Network errors (no response)
  if (!response) return true;
  // ECONNABORTED (timeout) or specific status codes
  const retryStatus = [502, 503];
  return retryStatus.includes(response?.status) || code === "ECONNABORTED";
}

// ─── Response Interceptor — Global error handling & retry ────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    // Attach a retry count flag
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // 401 – clear auth & redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Clear Supabase session
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // 500 – show toast
    if (error.response?.status >= 500) {
      toast.error("Server error, please try again later.");
    }

    // Retry logic for render cold‑start / network issues (once)
    if (isRetryable(error) && originalRequest._retryCount < 1) {
      originalRequest._retryCount += 1;
      // Small delay before retry
      await new Promise((res) => setTimeout(res, 1500));
      toast.loading("Waking up server…");
      return api(originalRequest);
    }

    // Offline detection
    if (!navigator.onLine) {
      toast.error("You appear to be offline. Check your internet connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
