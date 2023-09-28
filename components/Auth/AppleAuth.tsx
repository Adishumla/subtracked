import * as AppleAuthentication from "expo-apple-authentication";
import { View, StyleSheet, Text } from "react-native";
import { signInWithSupabaseUsingApple } from "../../lib/authentication";
import supabase from "../../lib/supabaseStore";
import { useState } from "react";
import tw from "../../lib/tailwind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function App() {
  const [name, setName] = useState(""); // State variable to store the user's name

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Extract necessary data from the credential
      const appleIdToken = credential.user;
      const appleUserName = credential.fullName?.givenName;
      const appleUserEmail = credential.email;

      // Send the Apple Sign-In data to your Supabase authentication function
      // This is where you link or sign in the user with Supabase using the obtained Apple Sign-In data.
      await signInWithSupabaseUsingApple(appleIdToken, appleUserName);

      // Get the user's name and update the state
      const userName = await getName(
        appleIdToken as string,
        appleUserName as string,
        appleUserEmail as string
      );
      setName(userName || ""); // Use an empty string if userName is falsy

      // Set the user's data in AsyncStorage
      /* await AsyncStorage.setItem("id", appleIdToken as string);
      await AsyncStorage.setItem("name", userName || ""); */

      console.log("userName", userName);
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
  };

  // Function to get the name from Supabase with a token and user name
  async function getName(
    token: string,
    userName: string,
    email: string | undefined
  ) {
    // Use the userName parameter when inserting the new record into the database
    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("token", token as string);
    if (error) {
      console.error("Error getting name", error);
      return ""; // Handle the error case appropriately
    } else if (data.length > 0) {
      console.log("User name found:", data[0].name);
      await AsyncStorage.setItem("id", data[0].id.toString());
      await AsyncStorage.setItem("name", data[0].name);
      router.push("/overview");
      return data[0].name; // Return the user's name
    } else {
      console.log("User not found in the database.");

      // If the user is logging in for the first time, insert a new record with the provided token, userName, and email
      const { error: insertError } = await supabase.from("login").upsert([
        {
          token: token as string,
          name: userName || "Alfons", // Use the provided userName or a default name
          email: email || "", // Use the extracted email or an empty string
        },
      ]);

      if (insertError) {
        console.error("Error inserting user data", insertError);
        return ""; // Handle the error case appropriately
      }
      console.log("User data inserted successfully.");
      return userName || "Alfons"; // Use the provided userName or a default name
    }
  }

  return (
    <View
      style={tw`mt-4
    `}
    >
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={10}
        style={tw`w-full h-14 
        `}
        onPress={handleAppleSignIn}
      />
    </View>
  );
}
