"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface User {
  userId: string;
  email: string;
  username: string;
  points: number;
  gamesWon: number;
  gamesLost: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useQuery(api.auth.getCurrentUser, token ? { token } : "skip");

  const loginMutation = useMutation(api.auth.login);
  const registerMutation = useMutation(api.auth.register);
  const logoutMutation = useMutation(api.auth.logout);

  useEffect(() => {
    // Load token from localStorage on mount
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginMutation({ email, password });
    setToken(result.token);
    localStorage.setItem("authToken", result.token);
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    const result = await registerMutation({ email, password, username });
    setToken(result.token);
    localStorage.setItem("authToken", result.token);
  };

  const logout = async () => {
    if (token) {
      await logoutMutation({ token });
    }
    setToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        login,
        register,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
