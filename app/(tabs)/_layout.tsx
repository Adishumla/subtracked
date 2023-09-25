import FontAwesome from "@expo/vector-icons/FontAwesome";
import "../../assets/images/overview.png";
import { Link, Tabs } from "expo-router";
import tw from "twrnc";
import { Pressable, useColorScheme, Image } from "react-native";
import supabase from "../../lib/supabaseStore";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "../../constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        }}
      >
        <Tabs.Screen
          name="egg" // This has to be here otherwise overview breaks...
          options={{
            title: "ins",
            href: null,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Image
                  style={tw``}
                  source={require("../../assets/images/settings.svg")}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="overview"
          options={{
            title: "Översikt",
            headerTitle: "",
            headerStyle: {
              height: 50,
            },
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Image
                  style={tw``}
                  source={require("../../assets/images/overview.svg")}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Lägg till ny",
            headerTitle: "",
            headerStyle: {
              height: 50,
            },
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Image
                  style={tw``}
                  source={require("../../assets/images/add.svg")}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="payments"
          options={{
            headerTitle: "",
            headerStyle: {
              height: 50,
            },
            title: "Betalningar",
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Image
                  style={tw``}
                  source={require("../../assets/images/payments.svg")}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerTitle: "",
            headerStyle: {
              height: 50,
            },
            title: "Inställningar",
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Image
                  style={tw``}
                  source={require("../../assets/images/settings.svg")}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="manageSub/:subId"
          options={{
            headerTitle: "",
            headerStyle: {
              height: 50,
            },
            href: null,
          }}
        />
        <Tabs.Screen
          name="editSub/:subId"
          options={{
            headerTitle: "",
            headerStyle: {
              height: 50,
            },
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
