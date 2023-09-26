import "react-native-url-polyfill/auto";
import tw from "../lib/tailwind";
import { useState, useEffect } from "react";
import supabase from "../lib/supabaseStore";
import Auth from "../components/Auth/EmailAuth";
import { View, Text, Button, ScrollView } from "react-native";
import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppleAuth from "../components/Auth/AppleAuth";
import { router } from "expo-router";
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "../lib/notificationService";

export default function App() {

  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState<String | undefined>("");
  const [id, setId] = useState<String | undefined>("");
  const [name, setName] = useState<String | undefined>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setEmail(session?.user.email);
      console.log(session);

      // Register for push notifications
      registerForPushNotificationsAsync()
        .then((token) => {
          // You can store the token if needed for future notifications
        })
        .catch((error) => {
          console.error("Error registering for push notifications:", error);
        });

      // @ts-ignore
      const { data, error } = supabase
        .from("login")
        .insert([{ email: email, Users: session?.user.id }])
        .select();
      console.log(error);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={tw`flex-1 font-Inter items-center justify-center mt-8`}>
      <ScrollView>
        <Auth />
        <AppleAuth />
      </ScrollView>
    </View>
  );
}
