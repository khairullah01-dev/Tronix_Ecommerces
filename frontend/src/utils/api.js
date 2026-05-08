// Backend URL: reads from .env (VITE_BACKEND_URL) or falls back to localhost for dev
export const API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

/**
 * Central fetch wrapper that automatically:
 * - Prepends the API base URL
 * - Attaches the auth token from localStorage as a `token` header
 * - Parses JSON and throws on non-2xx or { success: false } responses
 */
export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem("tronix_token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { token } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

/**
 * Multipart fetch wrapper for file uploads (e.g. adding products with images).
 * Does NOT set Content-Type — the browser sets it with the correct boundary.
 */
export const apiUpload = async (path, formData, token) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { token } : {}),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
