"use server";

import { clearSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

/**
 * Server action to clear invalid session and redirect to home
 * Use this when you need to clear an invalid token
 */
export async function clearInvalidSessionAction() {
  await clearSession();
  redirect("/");
}

/**
 * Server action to sign out
 */
export async function signOutAction() {
  console.log("[SignOut] Starting sign out process...");
  
  try {
    console.log("[SignOut] Clearing session...");
    await clearSession();
    console.log("[SignOut] Session cleared successfully");
    
    console.log("[SignOut] Redirecting to signin page...");
    redirect("/auth/signin");
  } catch (error) {
    console.error("[SignOut] Error during sign out:", error);
    throw error;
  }
}
