import { createClient } from "@supabase/supabase-js";
import supabase from "./supabaseStore";

// Authenticate using the Google provider with email scope
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Error signing in:", error.message);
  } else {
    console.log("User signed in:", supabase.auth.getUser());
  }
}

//logout
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  }
}

export { signInWithGoogle, signOut };
