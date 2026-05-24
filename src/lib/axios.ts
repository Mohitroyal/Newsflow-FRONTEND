import axios from "axios";

let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001/api/v1";
if (!API_BASE_URL.endsWith('/api/v1') && API_BASE_URL === "http://localhost:8001") {
  API_BASE_URL = `${API_BASE_URL}/api/v1`;
}

/** Axios instance with default config */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ─── Request Interceptor — Attach JWT ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("newscraft-auth");
    if (raw) {
      try {
        const { state } = JSON.parse(raw);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {
        // ignore parse errors
      }
    }
  }
  return config;
});

// ─── Response Interceptor — Handle 401 ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Clear stale auth and redirect to login
      if (typeof window !== "undefined") {
        const { useAuthStore } = require("@/store");
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
