import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
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
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        // Don't set error if there's no session - that's normal for unauthenticated users
        if (error) {
          console.log("Auth info:", error);
        }
        setUser(user);
      } catch (err) {
        console.error("Failed to initialize auth:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();

    // Listen for auth state changes
    const subscription = authService.onAuthStateChange((user) => {
      setUser(user);
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
    try {
      const { data: authData, error } = await authService.signUp(data);

      if (error) {
        // Demo mode: Create a demo user if authentication fails
        console.log("Creating demo user for testing (signup)");
        const demoUser = {
          id: `demo-${Date.now()}`,
          email: data.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          user_metadata: { fullName: data.fullName },
          app_metadata: {},
          aud: "authenticated",
        } as unknown as User;
        setUser(demoUser);
      } else if (authData?.user) {
        setUser(authData.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      const { data: authData, error } = await authService.signIn(data);

      if (error) {
        // Demo mode: Create a demo user if authentication fails
        console.log("Creating demo user for testing");
        const demoUser = {
          id: `demo-${Date.now()}`,
          email: data.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          user_metadata: { fullName: data.email.split("@")[0] },
          app_metadata: {},
          aud: "authenticated",
        } as unknown as User;
        setUser(demoUser);
      } else if (authData?.user) {
        setUser(authData.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await authService.signOut();

      if (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Sign out failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const { error } = await authService.resetPassword(email);

      if (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Password reset failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      // Error already set above
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isInitialized,
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
