import * as AppleAuthentication from "expo-apple-authentication";
import { View, StyleSheet } from "react-native";
import { signInWithSupabaseUsingApple } from "../../lib/authentication";

export default function App() {
  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            // Extract necessary data from the credential
            const appleIdToken = credential.identityToken;

            const appleUserId = credential.user;

            // Send the Apple Sign-In data to your Supabase authentication function
            // This is where you link or sign in the user with Supabase using the obtained Apple Sign-In data.
            await signInWithSupabaseUsingApple(appleIdToken, appleUserId);
          } catch (e) {
            if (
              e instanceof Error &&
              "code" in e &&
              e.code === "ERR_REQUEST_CANCELED"
            ) {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    height: 44,
  },
});
