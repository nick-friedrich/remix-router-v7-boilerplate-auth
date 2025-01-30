import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@prisma/client";
import { useNavigate } from "react-router";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: User | null;
}) {
  const navigate = useNavigate();

  const contextValue = {
    user: value,
    isAuthenticated: !!value,
    logout: async () => {
      await fetch("/auth/logout", {
        method: "POST",
      });

      navigate("/auth/login");
    },
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
