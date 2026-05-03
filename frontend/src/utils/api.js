

// This is the backend URL used by the frontend.
// If you create frontend/.env with VITE_BACKEND_URL, that value will be used.
// Otherwise it falls back to localhost:3000 because your backend .env has PORT=3000.
export const API_URL = import.meta.env.VITE_BACKEND_URL || "https://tronix-ecommerces-3v8q.vercel.app";


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
console.log("API_URL:", API_URL);
