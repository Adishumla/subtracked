import * as AppleAuthentication from "expo-apple-authentication";
import { View, StyleSheet, Text } from "react-native";
import { signInWithSupabaseUsingApple } from "../../lib/authentication";
import supabase from "../../lib/supabaseStore";
import { useState } from "react";
import tw from "tailwind-react-native-classnames";
import Category from "../../components/Category";
import SubscriptionType from "../../components/SubscriptionType";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import { Button } from "react-native-elements";

export default function App() {
  const [name, setName] = useState(""); // State variable to store the user's name
  const categories = ["Marabout", "Voyant", "Cartomancien", "Astrologue"];
  const subscriptionTypes = ["own", "duo", "family"];

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

      // Send the Apple Sign-In data to your Supabase authentication function
      // This is where you link or sign in the user with Supabase using the obtained Apple Sign-In data.
      await signInWithSupabaseUsingApple(appleIdToken, appleUserName);

      // Get the user's name and update the state
      const userName = await getName(
        appleIdToken as string,
        appleUserName as string
      );
      setName(userName || ""); // Use an empty string if userName is falsy
      console.log("userName", credential);
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
  async function getName(token: string, userName: string | undefined) {
    // Use the userName parameter when inserting the new record into the database
    const { data, error } = await supabase
      .from("login")
      .select("name")
      .eq("token", token as string);
    if (error) {
      console.error("Error getting name", error);
      return ""; // Handle the error case appropriately
    } else if (data.length > 0) {
      console.log("User name found:", data[0].name);
      return data[0].name; // Return the user's name
    } else {
      console.log("User not found in the database.");

      // If the user is logging in for the first time, insert a new record with the provided token and userName
      const { error: insertError } = await supabase.from("login").upsert([
        {
          token: token as string,
          name: userName || "Alfons", // Use the provided userName or a default name
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
    <View>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={handleAppleSignIn}
      />
      <View style={tw`px-4 pt-8`}>
        <H2 content="<-- Tillbaka ska den här ens vara här?"></H2>
        <H1 content={"Lägg till abonnemang"}></H1>
        
        <View>
          <H2 content="Kategori"></H2>
          <View style={tw`flex-1 gap-2`}>
            {categories.map((category) => (
              <Category key={category} name={category} />
              ))}
          </View>
        </View>
        <View style={tw`flex-1 items-center justify-center flex-row`}>
          {subscriptionTypes.map((subscriptionType, index) => (
            <View
              key={subscriptionType}
              style={[
                tw`flex-1`,
                index !== subscriptionTypes.length - 1 && tw`mr-4`,
              ]}
            >
              <SubscriptionType name={subscriptionType} />
            </View>
          ))}
        </View>

        <View>
          <H2 content={"Leverantör"}></H2>
          {/* inputbox */}
          {/* Exempeltext */}
        </View>

        <View style={tw`flex flex-row`}>
          <View style={tw``}>
            <H2 content={"Pris/mån"}></H2>
            {/* inputbox */}
          </View>

          <View style={tw``}>
            <H2 content={"Betaldatum"}></H2>
            {/* inputbox */}
          </View>
        </View>

        <View>
          <H2 content={"Abonnemangstyp"}></H2>
          {/* inputbox */}
          {/* Exempeltext */}
        </View>

        <View>
          <H2 content={"Notering"}></H2>
          {/* inputbox */}
          {/* Exempeltext */}
        </View>

        <Button disabled></Button>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 44,
  },
});
