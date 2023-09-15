import tw from "tailwind-react-native-classnames";
import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SubscriptionTypeProps {
  name: string;
  onPress: () => void;
  active: boolean;
}

export default function SubscriptionType({
  name,
  onPress,
  active,
}: SubscriptionTypeProps) {
  let icon = null;

  if (name === "own") {
    icon = <MaterialCommunityIcons name="account" size={24} color="black" />;
  } else if (name === "duo") {
    icon = (
      <MaterialCommunityIcons name="account-multiple" size={24} color="black" />
    );
  } else if (name === "family") {
    icon = (
      <MaterialCommunityIcons name="account-group" size={24} color="black" />
    );
  }

  return (
    <TouchableOpacity
      style={[
        tw`flex h-16 w-24 p-2 flex-col justify-center items-center gap-1 flex-1 rounded-md bg-white`,
        active && tw`bg-gray-900`,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={tw`flex items-center`}>
        {icon}
        <Text style={tw`text-lg`}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
