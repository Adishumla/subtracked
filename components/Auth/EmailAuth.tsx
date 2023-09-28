import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text, useColorScheme } from "react-native";
import supabase from "../../lib/supabaseStore";
import { Button, Input, CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import tw from "../../lib/tailwind";
import Link from "expo-router";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      console.log("User logged in successfully");
      await getInfo();
      setSignInSuccess(true); // Set sign-in success to true
    }
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
      .select("id, name, dark_mode")
      .eq("email", email)
      .limit(1);

    if (data && data.length > 0) {
      await AsyncStorage.setItem("id", data[0]?.id.toString());
      await AsyncStorage.setItem("name", data[0]?.name);
      await AsyncStorage.setItem("darkMode", data[0]?.dark_mode.toString());
      const storedId = await AsyncStorage.getItem("id");
      const storedName = await AsyncStorage.getItem("name");
      const storedDarkMode = await AsyncStorage.getItem("darkMode");
      setId(data[0]?.id.toString());
      setName(data[0]?.name);
      router.push("/overview");
      if (error) {
        console.error(error);
      }
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    const getId = async () => {
      const storedId = await AsyncStorage.getItem("id");
      const storedName = await AsyncStorage.getItem("name");
      const storedDarkMode = await AsyncStorage.getItem("darkMode");
      setId(storedId || "");
      setName(storedName || "");
      if (storedDarkMode === "true") {
        await AsyncStorage.setItem("darkMode", true.toString());
      } else if (storedDarkMode === "false") {
        await AsyncStorage.setItem("darkMode", false.toString());
      }
      console.log(storedDarkMode);
    };
    getId();
  }, []);
  let colorScheme = useColorScheme();

  return (
    <View style={tw`bg-backgroundPrimaryLight opacity-50`}>
      <View style={tw`items-center justify-center`}>
        {showRegistration && (
          <Input
            style={tw`rounded-xl border-2 border-solid mx-[-10px] ${
              colorScheme === "dark"
                ? "bg-inputSectionDark border-backgroundSecondaryDark"
                : "bg-inputSectionLight border-backgroundSecondaryLight"
            }`}
            inputStyle={tw`px-4 font-Inter`}
            containerStyle={tw`border-t-0`}
            inputContainerStyle={tw`border-b-0`}
            placeholderTextColor={"#202020"}
            label="Name"
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Your Name"
            autoCapitalize={"none"}
          />
        )}
      </View>

      <View
        style={tw`w-72
      `}
      >
        <Input
          style={tw`rounded-xl border-2 border-solid mx-[-10px] ${
            colorScheme === "dark"
              ? "bg-inputSectionDark border-backgroundSecondaryDark"
              : "bg-inputSectionLight border-backgroundSecondaryLight"
          }`}
          inputStyle={tw`px-4 font-Inter`}
          containerStyle={tw`border-t-0`}
          inputContainerStyle={tw`border-b-0`}
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholderTextColor={"#202020"}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>

      <View style={tw``}>
        <Input
          style={tw`rounded-xl border-2 border-solid mx-[-10px] ${
            colorScheme === "dark"
              ? "bg-inputSectionDark border-backgroundSecondaryDark"
              : "bg-inputSectionLight border-backgroundSecondaryLight"
          }`}
          inputStyle={tw`px-4 font-Inter`}
          containerStyle={tw`border-t-0`}
          inputContainerStyle={tw`border-b-0`}
          placeholderTextColor={"#202020"}
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>

      {showRegistration ? (
        <>
          <CheckBox
            style={tw`mt-0`} //link to terms and conditions
            title="Jag godkänner"
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
            containerStyle={tw`bg-transparent border-0 px-0 mt-[-20px]`}
            textStyle={tw`text-onBackgroundLight`}
          />
          <View style={tw``}>
            <Button
              buttonStyle={tw`p-4 rounded-xl ${
                colorScheme === "dark"
                  ? "bg-primaryDark shadow-darkMode shadow-md"
                  : "bg-primaryLight shadow-md"
              }`}
              titleStyle={tw`${
                colorScheme === "dark"
                  ? "text-onPrimaryDark"
                  : "text-onPrimaryLight"
              }`}
              style={tw`mb-0`}
              title="Registrera"
              disabled={loading || !isChecked}
              onPress={async () => {
                await signUpWithEmail();
              }}
            />
          </View>
          <View style={tw`mt-4`}>
            <Button
              buttonStyle={tw`p-4 rounded-xl ${
                colorScheme === "dark"
                  ? "bg-primaryDark shadow-darkMode shadow-md"
                  : "bg-primaryLight shadow-md"
              }`}
              titleStyle={tw`${
                colorScheme === "dark"
                  ? "text-onPrimaryDark"
                  : "text-onPrimaryLight"
              }`}
              style={tw`mb-0`}
              title="Have an account? Login"
              onPress={() => setShowRegistration(false)}
            />
          </View>
        </>
      ) : (
        <View style={tw``}>
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
            style={tw`mb-4`}
            title="Logga in"
            disabled={loading}
            onPress={async () => {
              await signInWithEmail();
            }}
          />
        </View>
      )}
      {!showRegistration && (
        <View style={tw`mt-0`}>
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
            style={tw``}
            title="Don't have an account? Register"
            onPress={() => setShowRegistration(true)}
          />
        </View>
      )}
    </View>
  );
}
