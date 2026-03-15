import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (data: {
    email: string;
    password: string;
    fullName: string;
  }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const { user, error } = await authService.getCurrentUser();
      if (error) {
        console.error("Auth error:", error);
        setError(error.message);
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes
    const subscription = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (data: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    setError(null);
    setLoading(true);
    const { data: authData, error } = await authService.signUp(data);

    if (error) {
      setError(error.message);
      throw error;
    }
    if (authData?.user) {
      setUser(authData.user);
    }
    setLoading(false);
  };

  const signIn = async (data: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    const { data: authData, error } = await authService.signIn(data);

    if (error) {
      setError(error.message);
      throw error;
    }
    if (authData?.user) {
      setUser(authData.user);
    }
    setLoading(false);
  };

  const signOut = async () => {
    setError(null);
    setLoading(true);
    const { error } = await authService.signOut();

    if (error) {
      setError(error.message);
      throw error;
    }
    setUser(null);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    const { error } = await authService.resetPassword(email);

    if (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
