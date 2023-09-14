import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import supabase from "../../lib/supabaseStore";
import { Button, Input } from "react-native-elements";
import { Link } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import tw from "tailwind-react-native-classnames";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);

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

    const { data: existingUser, error: existingUserError } = await supabase
      .from("login")
      .select()
      .eq("email", email);

    if (existingUserError) {
      console.error(existingUserError);
      Alert.alert("An error occurred while checking the email.");
      setLoading(false);
      return;
    }

    if (existingUser && existingUser.length > 0) {
      Alert.alert("Email already exists.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    const { data, error } = await supabase
      .from("login")
      .insert([{ email: email, name: name }]);

    if (signUpError) {
      console.error(signUpError);
      Alert.alert(signUpError.message);
    } else {
      getInfo();
    }

    setLoading(false);
  }

  async function getInfo() {
    const { data, error } = await supabase
      .from("login")
      .select("id, name")
      .eq("email", email)
      .limit(1);

    if (data && data.length > 0) {
      await AsyncStorage.setItem("id", data[0]?.id.toString());
      await AsyncStorage.setItem("name", data[0]?.name);
      const storedId = await AsyncStorage.getItem("id");
      const storedName = await AsyncStorage.getItem("name");
      setId(data[0]?.id.toString());
      setName(data[0]?.name);
      router.push("/overview");
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
        {showRegistration && (
          <Input
            style={tw`text-2xl text-white`}
            label="Name"
            leftIcon={{ type: "font-awesome", name: "user" }}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Your Name"
            autoCapitalize={"none"}
          />
        )}
      </View>
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
      {showRegistration ? (
        <View>
          <View style={styles.verticallySpaced}>
            <Button
              title="Registrera"
              disabled={loading}
              onPress={async () => {
                await signUpWithEmail();
              }}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Button
              title="Have an account? Login"
              onPress={() => setShowRegistration(false)}
            />
          </View>
        </View>
      ) : (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            title="Logga in"
            disabled={loading}
            onPress={async () => {
              await signInWithEmail();
              getInfo();
            }}
          />
        </View>
      )}
      {!showRegistration && (
        <View style={styles.verticallySpaced}>
          <Button
            title="Don't have an account? Register"
            onPress={() => setShowRegistration(true)}
          />
        </View>
      )}
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
            router.push("/");
          }}
        />
      </View>
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
