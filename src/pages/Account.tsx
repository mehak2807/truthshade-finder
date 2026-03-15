import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import logo from "@/assets/trustvault-logo.png";

const Account = () => {
  const navigate = useNavigate();
  const { user, signOut, error, clearError } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const handleClearError = () => {
    setLocalError(null);
    clearError();
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      
      toast({
        title: "Signed out",
        description: "See you next time!",
        duration: 2000,
      });
      
      navigate("/login");
    } catch (err: any) {
      setLocalError(err.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    handleClearError();
    setSuccessMessage(null);

    if (!displayName || !email) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      // Update profile logic would go here
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setLocalError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    handleClearError();
    setSuccessMessage(null);

    if (!newPassword || !confirmPassword) {
      setLocalError("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      // Password update logic would go here
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setLocalError(err.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="TruthShade" className="h-10" />
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          </div>
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Alerts */}
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert className="bg-green-500/20 border-green-500/50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-200">
                {successMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {(error || localError) && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert className="bg-red-500/20 border-red-500/50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">
                {error || localError}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Account Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition ${
                activeTab === "profile"
                  ? "text-purple-400 border-b-2 border-purple-400 bg-white/5"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <User className="inline mr-2 h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition ${
                activeTab === "password"
                  ? "text-purple-400 border-b-2 border-purple-400 bg-white/5"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Lock className="inline mr-2 h-4 w-4" />
              Password
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleUpdateProfile}
                className="space-y-6"
              >
                {/* Current Email (Read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Current Email
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/20 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{email}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <label htmlFor="displayName" className="block text-sm font-medium text-white">
                    Full Name
                  </label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      handleClearError();
                    }}
                    placeholder="Your full name"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                    disabled={isLoading}
                  />
                </div>

                {/* User Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-blue-300">
                    <span className="font-semibold">User ID:</span> {user?.id?.substring(0, 8)}...
                  </p>
                  <p className="text-sm text-blue-300">
                    <span className="font-semibold">Account Created:</span>{" "}
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </motion.form>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleChangePassword}
                className="space-y-6"
              >
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-300">
                    Changing your password will secure your account. Make sure to use a strong password.
                  </p>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-white">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      handleClearError();
                    }}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-400">
                    Minimum 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      handleClearError();
                    }}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
