import FontAwesome from "@expo/vector-icons/FontAwesome";
import '../../assets/images/overview.png';
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
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [id, setId] = useState("");

  async function checkSessionStorage() {
    if (typeof window !== "undefined") {
      const { data, error } = await supabase
        .from("login")
        .select("id")
        //.eq("id", sessionStorage.getItem("id") || "");
        .eq("id", (await AsyncStorage.getItem("id")) || "");
      if (data && data.length > 0) {
        console.log(data);
        console.log(AsyncStorage.getItem("id"));
        setUserLoggedIn(true);
        console.log("User is logged in");
      }
    }
  }

  useEffect(() => {
    async function setIdFromStorage() {
      console.log("ID", await AsyncStorage.getItem("id"));
      const storedId = await AsyncStorage.getItem("id");
      setId(storedId || "");
    }

    setIdFromStorage();
    checkSessionStorage(); // Check the user's login status whenever the component mounts
  }, []);

  useEffect(() => {
    checkSessionStorage(); // Check the user's login status whenever the component updates
  }, []); // Empty dependency array to run the check once when the component mounts

  return (
    <>
        <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint, headerShown: false
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          href: userLoggedIn ? "/overview" : null,
          title: 'Översikt',
          tabBarIcon: ({size,focused,color}) => {
            return (
              <Image
                style={tw``}
                source={require('../../assets/images/overview.svg')}
              />
            );
          },
        }}
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={Colors[colorScheme ?? "light"].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        // }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Lägg till ny",
          tabBarIcon: ({size,focused,color}) => {
            return (
              <Image
                style={tw``}
                source={require('../../assets/images/overview.svg')}
              />
            );
          },          
          href: userLoggedIn ? "/add" : null,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Betalningar",
          tabBarIcon: ({size,focused,color}) => {
            return (
              <Image
                style={tw``}
                source={require('../../assets/images/overview.svg')}
              />
            );
          },          
          href: userLoggedIn ? "/payments" : null,
        }}
      />
            <Tabs.Screen
        name="settings"
        options={{
          title: "Inställningar",
          tabBarIcon: ({size,focused,color}) => {
            return (
              <Image
                style={tw``}
                source={require('../../assets/images/overview.svg')}
              />
            );
          },          
          href: userLoggedIn ? "/settings" : null,
        }}
      />
    </Tabs>
    </>
  );
}
