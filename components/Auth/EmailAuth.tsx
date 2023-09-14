import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import supabase from "../../lib/supabaseStore";
import { Button, Input } from "react-native-elements";
import { Session } from "@supabase/supabase-js";
import tw from "tailwind-react-native-classnames";
import { Link } from "@react-navigation/native";
import AppleAuth from "./AppleAuth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }
  async function getInfo() {
    const { data, error } = await supabase
      .from("login")
      .select("id, name")
      .eq("email", email)
      .limit(1);
    console.log(data);
    if (data && data.length > 0) {
      // Set the item in AsyncStorage
      await AsyncStorage.setItem("id", data[0]?.id.toString());
      await AsyncStorage.setItem("name", data[0]?.name);
      // Retrieve the item from AsyncStorage and log it
      const storedId = await AsyncStorage.getItem("id");
      const storedName = await AsyncStorage.getItem("name");
      console.log("ID", storedId);
      console.log("NAME", storedName);
      setId(data[0]?.id.toString());
      setName(data[0]?.name);
      router.push("/add");
    } else {
      console.log(error);
    }
  }
  useEffect(() => {
    const getId = async () => {
      const storedId = await AsyncStorage.getItem("id");
      const storedName = await AsyncStorage.getItem("name");
      setId(storedId || "");
      setName(storedName || "");
    };
    getId();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={tw`text-4xl text-white`}>{id}</Text>
      <Text style={tw`text-4xl text-white`}>{name}</Text>
      <View style={tw`flex-1 items-center justify-center`}>
        <Input
          style={tw`text-2xl text-white`}
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          style={tw`text-2xl text-white`}
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Logga in"
          disabled={loading}
          onPress={async () => {
            await signInWithEmail();

            getInfo();
            //reload the page
          }}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Registrera"
          disabled={loading}
          onPress={async () => {
            signUpWithEmail();
            const { data, error } = await supabase
              .from("login")
              .insert([{ email: email, users: "1" }])
              .select();
            if (error) {
              console.error(error);
            } else {
              console.log(data);
            }
          }}
        />
      </View>
      <View style={tw`flex-1 items-center justify-center mt-8`}>
        <Button
          title="Sign Out"
          onPress={() => {
            supabase.auth.signOut();
            AsyncStorage.removeItem("id");
            AsyncStorage.removeItem("name");
          }}
        />
      </View>
      <View style={tw`flex-1 items-center justify-center mt-8`}>
        <Button
          title="Reload"
          onPress={() => {
            window.location.reload();
          }}
        />
      </View>
      {/* <AppleAuth /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
