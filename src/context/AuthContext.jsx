import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_BASE = "https://lms-login.onrender.com/api/auth";
const STORAGE_USER_KEY = "lms_user";
const STORAGE_TOKEN_KEY = "lms_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = (userObj, token) => {
    setUser(userObj);
    if (userObj) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
    if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token);
  };

  const fetchUserByToken = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return null;
      const data = await res.json();

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        enrolledCourses: data.enrolledCourses || [],
        avatar:
          data.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`
      };
    } catch {
      return null;
    }
  };

  // Auto-login on refresh
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(STORAGE_TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));

      const freshUser = await fetchUserByToken(token);

      if (!freshUser) {
        localStorage.removeItem(STORAGE_USER_KEY);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        setUser(null);
      } else {
        persistAuth(freshUser, token);
      }

      setLoading(false);
    };

    init();
  }, []);

  // ✅ LOGIN (NO REDIRECT)
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Invalid email or password" }));
      throw new Error(err.message || "Invalid email or password");
    }

    const data = await res.json();
    const token = data.token;

    if (!token) throw new Error("Token missing in login response");

    const freshUser = await fetchUserByToken(token);
    if (!freshUser) throw new Error("Could not load user profile");

    persistAuth(freshUser, token);

    // 🔥 No redirect → user stays on current page
    return true;
  };

  // ✅ SIGNUP (NO LOGIN, NO TOKEN NEEDED)
  const signup = async (name, email, password, role) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Registration failed" }));
      throw new Error(err.message || "Registration failed");
    }

    return { message: "User created successfully" };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
