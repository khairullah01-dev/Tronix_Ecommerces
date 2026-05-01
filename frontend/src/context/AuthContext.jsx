import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";

// AuthContext lets any page/component access login, signup, logout, and token state.
// Without context, we would need to pass these functions through many props.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Store token in state so the UI updates immediately after login/signup/logout.
  // Also read from localStorage so user stays logged in after page refresh.
  const [token, setToken] = useState(localStorage.getItem("tronix_token") || "");
  // Store user name/email separately from token.
  // Token proves the user is logged in, but user data lets us show "Hi, Name" in the header.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tronix_user")) || null;
    } catch {
      return null;
    }
  });

  // saveToken keeps React state and browser localStorage in sync.
  // userData is optional because older backend responses may only return token.
  const saveToken = (newToken, userData) => {
    localStorage.setItem("tronix_token", newToken);
    setToken(newToken);

    if (userData) {
      localStorage.setItem("tronix_user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  // login sends email/password to backend /api/user/login.
  // If backend returns a token, we save it and user becomes logged in.
  const login = async ({ email, password }) => {
    const data = await apiRequest("/api/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // Backend now returns both token and user.
    // We save both so the header can show the signed-in user's name.
    saveToken(data.token, data.user);
    return data;
  };

  // signup sends name/email/password to backend /api/user/register.
  // Backend creates a user and returns token, then we save it like login.
  const signup = async ({ name, email, password }) => {
    const data = await apiRequest("/api/user/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    // Signup also returns token and user so the new account is logged in immediately.
    saveToken(data.token, data.user);
    return data;
  };

  // logout removes token from both localStorage and React state.
  const logout = () => {
    localStorage.removeItem("tronix_token");
    localStorage.removeItem("tronix_user");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    // fetchProfile is used after page refresh.
    // Example: token exists in localStorage, but user name may be missing.
    // It asks backend /api/user/profile for the current user's name/email.
    const fetchProfile = async () => {
      if (!token || user) return;

      try {
        const data = await apiRequest("/api/user/profile");
        localStorage.setItem("tronix_user", JSON.stringify(data.user));
        setUser(data.user);
      } catch {
        // If token is expired or invalid, logout clears broken saved data.
        logout();
      }
    };

    fetchProfile();
  }, [token, user]);

  // useMemo prevents recreating this object on every render unless token changes.
  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(token),
      token,
      user,
      login,
      logout,
      signup,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth is a custom hook.
// Instead of writing useContext(AuthContext) everywhere, components can call useAuth().
export const useAuth = () => useContext(AuthContext);
