import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserProfileIcon: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  // Get user's name from email or metadata
  const userName =
    (user.user_metadata?.fullName as string) ||
    user.email?.split("@")[0] ||
    "User";

  // Get initials for avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white font-semibold hover:from-purple-600 hover:to-purple-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg">
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-white">{userName}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
        <div className="my-1" />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoading}
          className="text-red-400 hover:text-red-300 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
