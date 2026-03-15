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
          emailRedirectTo: undefined, // Disable email verification
        },
      });

      if (error) throw error;

      // Auto-signin after signup (no email verification needed)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      return { data: signInData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign in with email and password
  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  // Get current session
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      return { session, error: null };
    } catch (error) {
      return { session: null, error };
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

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
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
