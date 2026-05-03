// This is the backend URL used by the frontend.
// If you create frontend/.env with VITE_BACKEND_URL, that value will be used.
// Otherwise it falls back to localhost:3000 because your backend .env has PORT=3000.
export const API_URL = import.meta.env.VITE_BACKEND_URL ;

// apiRequest is a helper function so we do not repeat fetch code in every page.
// It automatically:
// 1. Adds JSON headers
// 2. Adds the login token if the user is logged in
// 3. Converts the response to JSON
// 4. Throws an error if backend returns success:false
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
