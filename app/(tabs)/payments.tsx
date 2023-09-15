import { View, StyleSheet, Text, ScrollView } from "react-native";
import {Link} from 'expo-router';
import supabase from "../../lib/supabaseStore";
import tw from "twrnc";
import H1 from "../../components/H1";

import H4 from "../../components/H4";

import { Button } from "react-native-elements";
import { useState, useEffect } from "react";

export default function App() {


  
  // const [userId, setUserId] = useState("");

  // useEffect(() => {
  //   setUserId("df2c0f0b-8af1-4671-9c9f-0eee19ec0606");
  //   getDumle();
  // }, []);

  // const getDumle = async () => {
  //   const { data, error } = await supabase
  //     .from("test")
  //     .select("dumle")
  //     .eq("user_id", userId);
  //   if (data && data.length > 0) {
  //     setDumle(data[0]?.dumle);
  //     console.log(data);
  //     console.log(dumle);
  //   }
  // };

  return (
    <ScrollView style={tw`px-4 pt-8`}>
      <H4 content="< Tillbaka"></H4>
      <H1 content={"Kommande betalningar"}></H1>
      <Link href="/manageProductPage">Hantera</Link>
    </ScrollView>
  );
}
