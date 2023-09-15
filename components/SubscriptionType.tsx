import tw from "tailwind-react-native-classnames";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SubscriptionTypeProps {
  name: string;
}

export default function SubscriptionType({ name }: SubscriptionTypeProps) {
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

  const [active, setActive] = useState(false);

  return (
    <TouchableOpacity
      style={[
        tw`flex h-16 w-24 p-2 flex-col justify-center items-center flex-1 rounded-md bg-white`,
        active && tw`bg-gray-300`,
      ]}
      onPress={() => setActive(!active)}
      activeOpacity={0.6}
    >
      <View style={tw`flex items-center`}>
        {icon}
        <Text style={tw`text-lg`}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
