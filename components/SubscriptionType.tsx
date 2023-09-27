import tw from "twrnc";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SubscriptionTypeProps {
  name: string;
  onPress?: () => void;
  selected: boolean; // Change this to a required prop
}

export default function SubscriptionType({
  name,
  onPress,
  selected,
}: SubscriptionTypeProps) {
  let icon = null;
  if (name === "Alla") {
    icon = null;
  } else if (name === "Eget") {
    icon = <MaterialCommunityIcons name="account" size={20} color="black" />;
  } else if (name === "Delat") {
    icon = (
      <MaterialCommunityIcons name="account-multiple" size={20} color="black" />
    );
  } else if (name === "Familj") {
    icon = (
      <MaterialCommunityIcons name="account-group" size={20} color="black" />
    );
  }

  return (
    <TouchableOpacity
      style={[
        tw`h-16 w-26 flex flex-col justify-between flex rounded-xl bg-white py-2 px-0 shadow-md shadow-blue-400`,
        selected && tw`bg-gray-300`, // Apply the selected style based on the prop
      ]}
      onPress={onPress} // Call the onPress function from the parent component
      activeOpacity={0.6}
    >
      <View
        style={tw`flex items-center justify-center flex-col
      `}
      >
        {icon}
        <Text style={[tw`text-lg`, !icon && tw`mt-5`]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
