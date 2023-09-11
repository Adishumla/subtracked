import { createClient } from "@supabase/supabase-js";
import supabase from "./supabaseStore";
import "react-native-url-polyfill/auto";

// Authenticate using the Google provider with email scope
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Error signing in:", error.message);
  } else {
    console.log("User signed in:", supabase.auth.getUser());
    console.log("User session:", supabase.auth.getSession());
  }
}

async function signInWithSupabaseUsingApple(
  appleIdToken: any,
  appleUserId: any
) {
  try {
    // Sign in or link the user with Supabase using the Apple Sign-In data
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        token: appleIdToken, // Use the Apple ID Token obtained earlier
        appleUserId, // Use the Apple user ID obtained earlier
      } as any,
    });

    if (error instanceof Error) {
      console.error("Error signing in with Apple:", error.message);
    } else {
      console.log("User signed in with Apple:", supabase.auth.getUser());
    }
  } catch (error) {
    console.error("Error signing in with Apple:", (error as Error).message);
  }
}

async function signInWithDiscord() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
  });

  if (error) {
    console.error("Error signing in:", error.message);
  } else {
    console.log("User signed in:", supabase.auth.getUser());
  }
}

// Sign in with email
async function signInWithEmail(email: string, password: string) {
  //@ts-ignore
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
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

export {
  signInWithGoogle,
  signOut,
  signInWithDiscord,
  signInWithSupabaseUsingApple,
  signInWithEmail,
};
