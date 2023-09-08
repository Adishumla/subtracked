import { StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Text, View } from "../../components/Themed";
import { Button } from "react-native";

/* show if database is connected */
import supabase from "../../lib/supabaseStore";
import { useEffect } from "react";

console.log(supabase);

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={[tw`text-2xl italic`]} lightColor="#000">
        Welcome to Subtracked
      </Text>
      <Button title="Login" />

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
