"use client";

import { signOutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import { useEffect } from "react";

export function SignOutButton() {
  useEffect(() => {
    console.log("[SignOutButton] Component mounted");
  }, []);
  const handleSignOut = async () => {
    console.log("[SignOutButton] Sign out button clicked");
    
    try {
      console.log("[SignOutButton] Calling signOutAction...");
      await signOutAction();
    } catch (error) {
      console.error("[SignOutButton] Error calling signOutAction:", error);
    }
  };

  return (
    <button 
      onClick={handleSignOut}
      className="flex w-full items-center text-left hover:bg-gray-100 px-2 py-1.5 rounded text-sm cursor-pointer"
      type="button"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </button>
  );
}
