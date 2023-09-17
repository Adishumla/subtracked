// TO DO : Line 24 && 31 - check line comment.

import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import supabase from "../../lib/supabaseStore";
import tw from "twrnc";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H4 from "../../components/H4";
import { Button, Input, Switch } from "react-native-elements";
import { useState, useEffect } from "react";

export default function App() {
  const [notifications, setNotifications] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  return (
    <ScrollView style={[tw`px-4 pt-8`, darkMode ? tw`bg-black` : tw`bg-white`]}>
      <Link href="/(tabs)/overview">
        <H4 content="< Tillbaka"></H4>
      </Link>
      <H1 content={"Inställningar"}></H1>

      <View style={tw`mt-16 gap-8`}>
        <View style={tw`flex-row justify-between`}>
          <H2 content="Dark mode"></H2>

          {/* Handle framemotion toggle switch, save to database as bool */}
          <Switch
            //color="#00FF00"
            value={darkMode}
            onValueChange={(value) => setDarkMode(value)}
          />
        </View>

        <View style={tw`flex-row justify-between`}>
          <H2 content="Pushnotiser"></H2>

          {/* Handle framemotion toggle switch, save to database as bool */}
          <Switch
            //color="#00FF00"
            value={notifications}
            onValueChange={(value) => setNotifications(value)}
          />
        </View>
      </View>

      <View style={tw`mt-16`}>
        <H2 content="Mejladress"></H2>
        <Input
          style={tw`rounded-xl`}
          placeholder="Ex: throwawayjens@kekleo.tv"
        ></Input>
      </View>

      <View>
        <H2 content="Telefon"></H2>
        <Input style={tw`rounded-xl`} placeholder="Ex: +467 0290 90 90"></Input>
      </View>

      <View style={tw`bg-[#DAD8D8] flex mt-16 p-4`}>
        <Text style={tw``}>
          För mer information gällande GDPR och hur vi använder dina uppgifter.{" "}
        </Text>
        <Link style={tw`self-end underline`} href="http://www.google.se">
          Läs mer här
        </Link>
      </View>

      <Button style={tw`my-12`} title="Spara" />
    </ScrollView>
  );
}
