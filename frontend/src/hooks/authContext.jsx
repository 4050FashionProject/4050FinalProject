import { createContext, useContext, useState } from "react";
import { BACKEND_URL } from "../config";

const AuthContext = createContext();

const login = async (username, password) => {
  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    setAccessToken(result.access_token);
    setIsLoggedIn(true);

    const TOKEN_EXPIRY_TIME = 60 * 60 * 1000;
    setTimeout(() => logout(), TOKEN_EXPIRY_TIME);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
  };
  const register = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, accessToken, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
