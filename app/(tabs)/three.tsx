import { View, StyleSheet, Text } from "react-native";
import supabase from "../../lib/supabaseStore";
import tw from "tailwind-react-native-classnames";
import { Button } from "react-native-elements";
import { useState, useEffect } from "react";

export default function App() {
  const [dumle, setDumle] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId("df2c0f0b-8af1-4671-9c9f-0eee19ec0606");
    getDumle();
  }, []);

  const getDumle = async () => {
    const { data, error } = await supabase
      .from("test")
      .select("dumle")
      .eq("user_id", userId);
    if (data && data.length > 0) {
      setDumle(data[0]?.dumle);
      console.log(data);
      console.log(dumle);
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text style={tw`text-2xl font-bold text-white`}>Dumle: {dumle}</Text>
      <Button title="Get Dumle" onPress={getDumle} />
    </View>
  );
}
