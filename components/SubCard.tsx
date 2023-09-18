import React, { useState, useEffect } from "react";
import { Text, View, useColorScheme } from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import H2 from "./H2";
import tw from "twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SubCardProps {
  productName: string;
  price: string;
  subType: string;
  subId: string;
  subStatus: string;
  icon?: string;
}

export default function SubCard({
  productName,
  price,
  subType,
  subId,
  subStatus,
  icon,
}: SubCardProps) {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme === "dark") {
      setDarkMode(true);
      AsyncStorage.setItem("darkMode", "true");
    } else {
      setDarkMode(false);
      AsyncStorage.setItem("darkMode", "false");
    }
  }, [colorScheme]);

  // Function to render the subType icon based on its value
  const renderSubTypeIcon = () => {
    let icon = null;

    if (subType === "eget") {
      icon = <MaterialCommunityIcons name="account" size={20} color="black" />;
    } else if (subType === "delat") {
      icon = (
        <MaterialCommunityIcons
          name="account-multiple"
          size={20}
          color="black"
        />
      );
    } else if (subType === "familj") {
      icon = (
        <MaterialCommunityIcons name="account-group" size={20} color="black" />
      );
    }

    return icon || subType; // Return subType itself if no matching icon is found
  };

  return (
    <View
      style={[
        tw`flex-row justify-between items-center px-4 py-4 rounded-full mt-4 bg-slate-500`,
        darkMode ? tw`bg-black` : tw`bg-white`,
      ]}
    >
      <View
        style={tw`flex-row items-center bg-slate-500 rounded-lg w-full h-20 overflow-hidden`}
      >
        <View style={tw`mr-4`}>
          <Text style={tw`font-medium text-2xl p-4`}>{icon}</Text>
        </View>
        <View style={tw`flex-1`}>
          <View style={tw`flex flex-row justify-between items-start w-full`}>
            <H2 content={productName} />
            <View style={tw`flex flex-row justify-between items-center`}>
              <Button
                title="Hantera"
                buttonStyle={tw`p-0 m-0 bg-transparent`}
                titleStyle={tw`text-black font-medium text-lg`}
                onPress={() => console.log("hej")}
              />
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="black"
              />
            </View>
          </View>
          <View>
            <Text style={tw`font-light text-lg font-light`}>
              {price} / mån {renderSubTypeIcon()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
