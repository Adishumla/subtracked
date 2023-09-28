import tw from "../lib/tailwind";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color } from "react-native-elements/dist/helpers";
import { colors } from "react-native-elements";

interface SubscriptionTypeProps {
  name: string;
  onPress?: () => void;
  selected: boolean; // Change this to a required prop
  width?: number;
}

export default function SubscriptionType({
  name,
  onPress,
  selected,
  width = 22,
}: SubscriptionTypeProps) {
  let colorScheme = useColorScheme();
  let icon = null;
  if (name === "Alla") {
    icon = null;
  } else if (name === "Eget") {
    icon = (
      <MaterialCommunityIcons
        name="account"
        size={20}
        color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
      />
    );
  } else if (name === "Delat") {
    icon = (
      <MaterialCommunityIcons
        name="account-multiple"
        size={20}
        color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
      />
    );
  } else if (name === "Familj") {
    icon = (
      <MaterialCommunityIcons
        name="account-group"
        size={20}
        color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
      />
    );
  }

  return (
    <TouchableOpacity
      style={[
        tw`h-16 w-${width} flex flex-col justify-between flex rounded-xl py-2 px-0 shadow-md shadow-blue-400`,
        colorScheme === "dark" ? tw`bg-primaryDark` : tw`bg-primaryLight`,
        selected
          ? colorScheme === "dark"
            ? tw`bg-secondaryDark`
            : tw`bg-secondaryLight`
          : tw``,
      ]}
      onPress={onPress} // Call the onPress function from the parent component
      activeOpacity={0.6}
    >
      <View style={[tw`flex items-center justify-center flex-col`]}>
        {icon}
        <Text
          style={[
            tw`text-H4 font-regular`,
            !icon && tw`mt-5`,
            colorScheme === "dark"
              ? tw`text-onPrimaryDark`
              : tw`text-onPrimaryLight`,
          ]}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
