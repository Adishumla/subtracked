import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useColorScheme,
  Appearance,
} from "react-native";
import { Link } from "expo-router";
import supabase from "../../lib/supabaseStore";
import { Session } from "@supabase/supabase-js";
import tw from "twrnc";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H4 from "../../components/H4";
import { Button, Input, Switch } from "react-native-elements";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

 // Tror att funktionen här under kan tas bort?

  // Handle login+session states to fetch user id.
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState<String | undefined>("");
  const [id, setId] = useState<String | undefined >("");



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
  
  type UserSettings = {
    name : string,
    dark_mode: boolean,
    push_notifications : boolean
  }
  let [userSettings, setUserSettings] = useState<UserSettings>({name:'', dark_mode:false, push_notifications:false});
  //Fetch user data from login table where user id is the same as the logged in id. 
  // name, dark_mode & push_notifications are saved to an array called userSettings.
  useEffect(() => {
    AsyncStorage.getItem('id').then((id) => {
      if (!id) {
        console.error('User not found.');
        return;
      }
      const fetchData = async () => {
        try {
          const { data: fetchedSettings, error } = await supabase
          .from('login')
          .select('name, dark_mode, push_notifications, email')
          .eq('id', id);
          if (error) {
            console.error('Error fetching data:', error.message);
          } else {
            setUserSettings({name:fetchedSettings[0].name, dark_mode:fetchedSettings[0].dark_mode, push_notifications:fetchedSettings[0].push_notifications})
            setEmail(fetchedSettings[0].email);
            setId(id);
          }
        } catch (error) {
          console.error('An error occurred:', (error as Error).message);
        }
      };
      fetchData();
    });
  }, []);

  // Add handlers to change rendered username 
  // and switches that save push notifications & darkmode respectively
  const [username, setUsername] = useState<string>(userSettings.name);
  const [push_notifications, setNotifications] = useState<boolean>(userSettings.dark_mode);
  const [darkMode, setDarkMode] = useState<boolean>(userSettings.push_notifications);

  let colorScheme = useColorScheme();
  useEffect(() => {
    if (darkMode === true){
      AsyncStorage.setItem("darkMode","true")
    }
    else {
      AsyncStorage.setItem("darkMode","false")
    }
  }, [colorScheme]);

  return (
    <ScrollView style={[tw`px-4 pt-8`, darkMode ? tw`bg-black` : tw`bg-white`]}>
      <Link href="/(tabs)/overview">
        <H4 content="< Tillbaka"></H4>
      </Link>
      <H1 content={"Inställningar"}></H1>

      <View style={tw`mt-16`}>
        <H2 content="Användarnamn"></H2>
        <Input
          style={tw`rounded-xl`}
          placeholder={userSettings.name}
          onChangeText={(value) => setUsername(value)}
        ></Input>
      <Button style={tw`my-6`} title="Spara" onPress={async () => {
          const { data, error } = await supabase
          .from('login')
          .update({name: username})
          .eq('id', id)
          .select();
          if (error) {
            console.error("Error inserting data:", error);
          }
        } }
          />
      </View>

      <View>
        <H2 content="Lösenord"/>
        <Text style={tw`text-white`} >
          Klicka här så skickas en återställningslänk till din registrerade mejladress.
        </Text>
        <H4 content="" />
        <Button style={tw`my-6`} title="Byt lösenord" />
      </View>


      <View style={tw`mt-16 gap-8`}>
        <View style={tw`flex-row justify-between`}>
          <H2 content="Dark mode"></H2>

          <Switch
            //color="#00FF00"
            value={darkMode}
            onValueChange={(dark_value) => setDarkMode(dark_value)}
          />
        </View>

        <View style={tw`flex-row justify-between`}>
          <H2 content="Pushnotiser"></H2>

          <Switch
            //color="#00FF00"
            value={push_notifications}
            onValueChange={(value) => setNotifications(value)}
          />
        </View>
      </View>

      <Button style={tw`my-6`} title="Logga ut           //men den här knappen gör ingenting just nu" />

      <View style={tw`bg-[#DAD8D8] flex mt-16 p-4`}>
        <Text style={tw``}>
          För mer information gällande GDPR och hur vi använder dina uppgifter.{" "}
        </Text>
        <Link style={tw`self-end underline`} href="http://www.google.se">
          Läs mer här
        </Link>
      </View>

    </ScrollView>
  );
  }