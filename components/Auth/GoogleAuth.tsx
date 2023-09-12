import * as React from "react";
import supabase from "../../lib/supabaseStore";
import { Button, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_AUTH_CONFIG = {
  clientId: "",
  scopes: ["profile", "email"],
  redirectUrl: encodeURIComponent(
    "https://eyzowvekoomzjzjxkyhn.supabase.co/auth/v1/callback"
  ),
  authUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${""}&redirect_uri=${encodeURIComponent(
    "https://eyzowvekoomzjzjxkyhn.supabase.co/auth/v1/callback"
  )}&response_type=token&scope=${["profile", "email"].join(" ")}`,
};

export default function TabOneScreen() {
  const [loginInProgress, setLoginInProgress] = React.useState(false);

  const handleLogin = async () => {
    setLoginInProgress(true);

    try {
      /* const redirectUrl = await WebBrowser.openAuthSessionAsync(
        `https://accounts.google.com/o/oauth2/auth?client_id=${
          GOOGLE_AUTH_CONFIG.clientId
        }&redirect_uri=${encodeURIComponent(
          // @ts-ignore
          WebBrowser.maybeCompleteAuthSession
        )}&response_type=token&scope=${GOOGLE_AUTH_CONFIG.scopes.join(" ")}`
      ); */
      const redirectUrl = await WebBrowser.openAuthSessionAsync(
        GOOGLE_AUTH_CONFIG.authUrl
      );

      // Handle the redirection URL and authentication response here
      console.log("Redirect URL:", redirectUrl);

      if (redirectUrl) {
        // Parse the URL and extract necessary information
        // Handle the authentication response
      } else {
        // Handle the case where the user canceled the authentication
        console.log("Authentication canceled");
      }
    } catch (error) {
      // Handle other errors if necessary
      console.error("Authentication error", error);
    } finally {
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
