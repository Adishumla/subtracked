import * as React from "react";
import { Button, View, Linking } from "react-native";
import tw from "tailwind-react-native-classnames";
import crypto from "expo-crypto";

const GOOGLE_AUTH_CONFIG = {
  clientId: "",
  scopes: ["profile", "email"],
};

export default function GoogleAuth2() {
  const [loginInProgress, setLoginInProgress] = React.useState(false);

  const handleLogin = () => {
    setLoginInProgress(true);

    try {
      // Construct the authentication URL
      const state = 123;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
        GOOGLE_AUTH_CONFIG.clientId
      }&redirect_uri=${encodeURIComponent(
        "https://eyzowvekoomzjzjxkyhn.supabase.co/auth/v1/callback"
      )}&response_type=token&scope=${GOOGLE_AUTH_CONFIG.scopes.join(
        " "
      )}&state=${state}`;

      // Open the authentication URL in the default web browser
      Linking.openURL(authUrl).catch((error) => {
        console.error("Error opening URL:", error);
        setLoginInProgress(false);
      });
    } catch (error) {
      console.error("Authentication error", error);
      setLoginInProgress(false);
    }
  };

  return (
    <View style={[tw`flex-1 items-center justify-center`]}>
      {/* Other UI components */}
      <Button
        title="Login with Google"
        onPress={handleLogin}
        disabled={loginInProgress}
      />
    </View>
  );
}
