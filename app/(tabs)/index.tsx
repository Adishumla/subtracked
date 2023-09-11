import React, { useEffect, useState } from "react";
import { Text, View, Button, Image } from "react-native";
import supabase from "../../lib/supabaseStore";
import * as Crypto from "expo-crypto";

import {
  signInWithGoogle,
  signOut,
  signInWithDiscord,
} from "../../lib/authentication";
import tw from "tailwind-react-native-classnames";
import "react-native-url-polyfill/auto";
import * as AppleAuthentication from "expo-apple-authentication";
import { signInWithSupabaseUsingApple } from "../../lib/authentication";
import EmailAuth from "../../components/Auth/EmailAuth";
import { randomUUID } from "crypto";

export default function TabOneScreen() {
  const [user, setUser] = useState({ data: null, error: null });
  const [name, setName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loginInProgress, setLoginInProgress] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      console.log("user", data);
      console.log("email", data?.user?.user_metadata?.full_name);
      setName(data?.user?.user_metadata?.full_name);
      setProfilePic(data?.user?.user_metadata?.avatar_url);
      setUser({ data, error } as any);
      console.log(supabase);
    }

    fetchUser();
  }, []);

  const handleLogin = async () => {
    setLoginInProgress(true);
    try {
      const { user, error } = (await signInWithGoogle()) as any;
      if (user) {
        const userMetadata = user.user_metadata;
        setName(userMetadata.full_name);
        setProfilePic(userMetadata.avatar_url);
        setUser({ data: user, error: null });
      } else {
        setUser({ data: null, error });
      }
    } catch (error) {
    } finally {
      setLoginInProgress(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      setUser({ data: null, error: null });
      setName(null);
      setProfilePic(null);
    }
  };

  return (
    <View style={[tw`flex-1 items-center justify-center`]}>
      {profilePic && (
        <Image
          source={{ uri: profilePic }}
          style={[tw`w-24 h-24 rounded-full`]}
        />
      )}
      {name && <Text style={[tw`text-2xl text-white`]}>{name}</Text>}
      {user.data ? (
        <Button title="Logout" onPress={handleLogout} />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={loginInProgress} // Disable the button during login
        />
      )}

      <Button
        title="Sign in with Apple"
        onPress={async () => {
          // @ts-ignore
          try {
            console.log("DID IT WORK?");
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            // @ts-ignore
            const { data: existingUser, error: existingUserError } =
              await supabase
                .from("login")
                .select("*")
                .eq("token", credential.identityToken);
            if (existingUserError) {
              console.log("ERRORRR", existingUserError);
              //insert new user
              // @ts-ignore
              const { data, error } = await supabase.from("login").insert([
                {
                  //id: credential.identityToken,
                  token: credential.identityToken,
                  name: credential.fullName?.givenName,
                  //provider: "apple",
                },
              ]);
              console.log("data", data);
              console.log("error", error);
            } else {
              console.log("existingUser", existingUser);
              /* const { data, error } = await supabase.from("login").insert([
                {
                  //@ts-ignore
                  //id: credential.identityToken,
                  token: credential.identityToken,
                  name: credential.fullName?.givenName,
                  //provider: "apple",
                },
              ]);
              console.log("data", data);
              console.log("error", error); */
            }

            console.log("User signed in with Apple:", credential);

            // Extract necessary data from the credential
            const appleIdToken = credential.identityToken;
            console.log("appleIdToken", appleIdToken);
            const appleUserId = credential.user;
            // @ts-ignore
            // Sign in or link the user with Supabase using the Apple Sign-In data
            const { user, session, error } =
              await supabase.auth.signInWithOAuth({
                provider: "apple",
                options: {
                  token: appleIdToken,
                  appleUserId,
                } as any,
              });

            if (error) {
              console.error("Supabase Apple login error:", error);
              // Handle login error here
            } else {
              console.log("Supabase Apple login success:", user, session);
            }
          } catch (error) {
            console.error("Apple login error:", error);
            // Handle login error here
          }
        }}
      />

      {/* get name from user */}
      <Text style={[tw`text-2xl text-white`]}>{name}</Text>

      {/* emailAuth */}
      <EmailAuth />

      <View />
    </View>
  );
}
