import "react-native-url-polyfill/auto";
import tw from "tailwind-react-native-classnames";
import { useState, useEffect } from "react";
import supabase from "../../lib/supabaseStore";
import Auth from "../../components/Auth/EmailAuth";
import { View, Text, Button } from "react-native";
import { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState<String | undefined>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setEmail(session?.user.email);
      console.log(session);
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
    <View>
      <Auth />
      <Button
        title="Sign Out"
        onPress={() => {
          supabase.auth.signOut();
          console.log(session);
        }}
      />
    </View>
  );
}
