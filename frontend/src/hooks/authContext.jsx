import { createContext, useContext, useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const storedLoginStatus = localStorage.getItem("isLoggedIn");

    if (storedToken && storedLoginStatus === "true") {
      // Validate token by making a test request
      fetch(`${BACKEND_URL}/users/${JSON.parse(storedUser).username}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setAccessToken(storedToken);
            setIsLoggedIn(true);
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
          }
        })
        .catch(() => {
          // Network error or other issue, clear localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
        });
    }
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
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
      const params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("username", username);
      params.append("password", password);
      params.append("scope", "read write");

      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setAccessToken(result.access_token);
      await getUser(username, result.access_token);
      setIsLoggedIn(true);

      localStorage.setItem("accessToken", result.access_token);
      localStorage.setItem("isLoggedIn", "true");

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
      localStorage.setItem("user", JSON.stringify(user));
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
