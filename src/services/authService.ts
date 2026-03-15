import { supabase } from "@/integrations/supabase/client";

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  createdAt: string;
}

class AuthService {
  // Sign up with email and password (no email verification required)
  async signUp({ email, password, fullName }: SignUpData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Don't redirect for email verification
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        throw new Error(error.message || "Sign up failed");
      }

      // Check if user was created but needs email verification
      if (data?.user && !data.user.email_confirmed_at) {
        // Try to auto-signin anyway - Supabase might allow this depending on auth settings
        try {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email,
              password,
            });

          if (signInError) {
            // Return the session from signup if auto-signin fails
            return { data: data, error: null };
          }

          return { data: signInData, error: null };
        } catch (signInErr) {
          // Return signup data even if auto-signin fails
          return { data: data, error: null };
        }
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign up failed";
      return { data: null, error: new Error(errorMessage) };
    }
  }

  // Sign in with email and password
  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Sign in failed");
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign in failed";
      return { data: null, error: new Error(errorMessage) };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message || "Sign out failed");
      }
      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign out failed";
      return { error: new Error(errorMessage) };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // Don't throw - just return the user (null if not authenticated)
      return { user, error: null };
    } catch (error) {
      // Return null user without error - unauthenticated is a valid state
      return { user: null, error: null };
    }
  }

  // Get current session
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      // Don't throw - just return the session (null if not authenticated)
      return { session, error: null };
    } catch (error) {
      // Return null session without error - unauthenticated is a valid state
      return { session: null, error: null };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: any) => void) {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      callback(session?.user || null);
    });

    return data.subscription;
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message || "Password reset failed");
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed";
      return { data: null, error: new Error(errorMessage) };
    }
  }

  // Update password
  async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update user profile
  async updateProfile(updates: { full_name?: string; email?: string }) {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const authService = new AuthService();
