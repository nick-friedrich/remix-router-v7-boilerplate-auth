import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@prisma/client";
import { Navigate, redirect } from "react-router";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: User | null;
}) {
  const contextValue = {
    user: value,
    isAuthenticated: !!value,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
