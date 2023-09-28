import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useColorScheme,
  Appearance,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import supabase from "../../lib/supabaseStore";
import { Session } from "@supabase/supabase-js";
import tw from "../../lib/tailwind";
import { Button, Input, Switch } from "react-native-elements";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "zod";

export default function App() {
  let colorScheme = useColorScheme();

  // Handle login+session states to fetch user id.
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState<String | undefined>("");
  const [id, setId] = useState<String | undefined>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setEmail(session?.user.email);

      supabase
        .from("login")
        .insert([{ email: email, Users: session?.user.id }])
        .select();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  //Fetch user data from login table where user id is the same as the logged in id.
  // name, dark_mode & push_notifications are saved to an object called userSettings.
  type UserSettings = {
    name: string;
    /*     push_notifications: boolean;
     */
  };
  let [userSettings, setUserSettings] = useState<UserSettings>({
    name: "",
    /*     push_notifications: false,
     */
  });
  useEffect(() => {
    AsyncStorage.getItem("id").then((id) => {
      if (!id) {
        console.error("User not found.");
        return;
      }
      const fetchData = async () => {
        try {
          const { data: fetchedSettings, error } = await supabase
            .from("login")
            .select("name, dark_mode, push_notifications, email")
            .eq("id", id);
          if (error) {
            console.error("Error fetching data:", error.message);
          } else {
            setUserSettings({ ...userSettings, name: fetchedSettings[0].name });
            setEmail(fetchedSettings[0].email);
            setId(id);
            console.log(fetchedSettings);
          }
        } catch (error) {
          console.error("An error occurred:", (error as Error).message);
        }
      };
      fetchData();
    });
  }, []);

  return (
    <ScrollView
      style={tw`px-4 pt-8 ${
        colorScheme === "dark"
          ? "bg-backgroundPrimaryDark"
          : "bg-backgroundPrimaryLight"
      }`}
    >
      <View style={tw`mb-5`}>
        <Link 
          href="/(tabs)/overview" style={tw`flex`}>
                  <MaterialCommunityIcons
                    style={tw``}
                    name="chevron-left"
                    size={28}
                    color={`${colorScheme === "dark" ?  "#FDFDFF" : "#202020" }`}
                  />
        <Text style={tw`font-Inter text-H4 self-center font-regular ${colorScheme === "dark" ? "text-onBackgroundDark" : "text-onBackgroundLight"}`}>Tillbaka</Text>
       </Link>
      </View>

      <Text
        style={tw`mb-16 font-Inter text-H1 font-medium ${
          colorScheme === "dark" ? "text-H1Dark" : "text-onBackgroundLight"
        }`}
      >
        Inställningar
      </Text>

      <View>
        <Text
          style={tw`font-Inter mb-[20px] text-H2 font-medium ${
            colorScheme === "dark"
              ? "text-onBackgroundDark"
              : "text-onBackgroundLight"
          }`}
        >
          Namn på konto
        </Text>
        <Input
          style={tw`rounded-xl border-2 border-solid mx-[-10px] ${
            colorScheme === "dark"
              ? "bg-inputSectionDark border-backgroundSecondaryDark"
              : "bg-inputSectionLight border-backgroundSecondaryLight"
          }`}
          inputStyle={tw`px-4 font-Inter`}
          containerStyle={tw`border-t-0`}
          inputContainerStyle={tw`border-b-0`}
          placeholder={userSettings.name}
          placeholderTextColor={"#202020"}
          onChangeText={(value) =>
            setUserSettings({ ...userSettings, name: value })
          }
        />
        <Button
          buttonStyle={tw`p-4 rounded-xl ${
            colorScheme === "dark"
              ? "bg-primaryDark shadow-md"
              : "bg-primaryLight shadow-md"
          }`}
          titleStyle={tw`${
            colorScheme === "dark"
              ? "text-onPrimaryDark"
              : "text-onPrimaryLight"
          }`}
          style={tw`mt-8 mb-16`}
          title="Spara"
          onPress={async () => {
            const { data, error } = await supabase
              .from("login")
              .update({ name: userSettings.name })
              .eq("id", id)
              .select();
            if (error) {
              console.error("Error inserting data:", error);
            }
          }}
        />
      </View>

      <View>
        <Text
          style={tw`font-Inter text-H2 mb-8 font-medium ${
            colorScheme === "dark"
              ? "text-onBackgroundDark"
              : "text-onBackgroundLight"
          }`}
        >
          Lösenord
        </Text>

        <Text
          style={tw`font-Inter text-H4 font-normal ${
            colorScheme === "dark"
              ? "text-onPrimaryDark"
              : "text-onPrimaryLight"
          }`}
        >
          Klicka här så skickas en återställningslänk till din registrerade
          mejladress.
        </Text>

        <Button
          buttonStyle={tw`p-4 rounded-xl ${
            colorScheme === "dark"
              ? "bg-primaryDark shadow-md"
              : "bg-primaryLight shadow-md"
          }`}
          titleStyle={tw`${
            colorScheme === "dark"
              ? "text-onPrimaryDark"
              : "text-onPrimaryLight"
          }`}
          style={tw`my-6`}
          title="Byt lösenord"
        />
      </View>

      <View style={tw`mt-16 gap-5`}>
        <View style={tw`flex-row justify-between`}>
          <Text
            style={[
              tw`font-Inter text-H2 font-medium ${
                colorScheme === "dark"
                  ? "text-onBackgroundDark"
                  : "text-onBackgroundLight"
              }`,
            ]}
          >
            Darkmode
          </Text>
          <Switch
            value={colorScheme === "dark"}
            trackColor={{ false: "#A5A5A5", true: "#26AC23" }}
            thumbColor={colorScheme === "dark" ? "#3C415E" : "#FDFDFF"}
            onValueChange={(value) => {
              const newColorScheme = value ? "dark" : "light";
              Appearance.setColorScheme(newColorScheme);
            }}
          />
        </View>

        <View style={tw`flex-row justify-between`}>
          <Text
            style={[
              tw`font-Inter text-H2 font-medium ${
                colorScheme === "dark"
                  ? "text-onBackgroundDark"
                  : "text-onBackgroundLight"
              }`,
            ]}
          >
            Pushnotiser
          </Text>
          <Switch
            //@ts-ignore
            value={userSettings.push_notifications}
            trackColor={{ false: `#A5A5A5`, true: "#26AC23" }}
            //@ts-ignore
            color={`${colorScheme === "dark" ? "#3C415E" : "#FDFDFF"}`}
            thumbColor={`${colorScheme === "dark" ? "#3C415E" : "#FDFDFF"}`}
            onValueChange={(value) => {
              console.log(value);
            }}
          />
        </View>
      </View>

      <Button
        buttonStyle={tw`p-4 rounded-xl ${
          colorScheme === "dark"
            ? "bg-primaryDark shadow-md"
            : "bg-primaryLight shadow-md"
        }`}
        titleStyle={tw`${
          colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"
        }`}
        style={tw`my-6`}
        title="Logga ut"
        onPress={() => {
          supabase.auth.signOut();
          AsyncStorage.removeItem("id");
          AsyncStorage.removeItem("name");
          setTimeout(() => {
            router.push("/");
          }, 500);
        }}
      />

      <View
        style={tw`flex my-12 p-4 gap-4 ${
          colorScheme === "dark" ? "bg-primaryDark" : "bg-primaryLight"
        }`}
      >
        <Text
          style={tw`text-H4 font-normal ${
            colorScheme === "dark"
              ? "text-onPrimaryDark"
              : "text-onPrimaryLight"
          }`}
        >
          För mer information gällande GDPR och hur vi använder dina uppgifter.
        </Text>
        <Link
          style={tw`self-end underline ${
            colorScheme === "dark"
              ? "text-onPrimaryDark"
              : "text-onPrimaryLight"
          }`}
          href="http://www.google.se"
        >
          Läs mer här
        </Link>
      </View>
    </ScrollView>
  );
}
