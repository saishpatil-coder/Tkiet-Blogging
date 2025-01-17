import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null, // Stores user information (e.g., username)
  });

  const checkLoggedIn = async () => {
    try {
      const response = await fetch(
        "http://localhost:3003/api/auth/isloggedin",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check login status");
      }

      const data = await response.json();
      setAuthState({
        isLoggedIn: data.isLoggedIn,
        user: data.isLoggedIn ? data.user : null,
      });
    } catch (error) {
      setAuthState({ isLoggedIn: false, user: null });
      console.error("Error checking login status:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, checkLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
