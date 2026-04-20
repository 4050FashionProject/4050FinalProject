import { createContext, useContext, useState } from "react";
import { BACKEND_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    setUser(null);
  };

  const register = async (display_name, email, username, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ display_name, email, username, password }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      alert(result);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setAccessToken(result.access_token);
      await getUser(username, result.access_token);
      setIsLoggedIn(true);

      const TOKEN_EXPIRY_TIME = 60 * 60 * 1000;
      setTimeout(() => logout(), TOKEN_EXPIRY_TIME);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getUser = async (username, token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const user = await response.json();
      setUser(user);
      console.log(user);
    } catch (error) {
      console.error(error.message);
    }
  };

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
