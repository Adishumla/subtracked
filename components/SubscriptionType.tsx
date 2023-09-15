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

  if (name === "Eget") {
    icon = <MaterialCommunityIcons name="account" size={24} color="black" />;
  } else if (name === "Delat") {
    icon = (
      <MaterialCommunityIcons name="account-multiple" size={24} color="black" />
    );
  } else if (name === "Familj") {
    icon = (
      <MaterialCommunityIcons name="account-group" size={24} color="black" />
    );
  }

  return (
    <TouchableOpacity
      style={[
        tw`flex h-16 w-24 p-2 flex-col justify-center items-center flex-1 rounded-xl bg-white`,
        selected && tw`bg-gray-300`, // Apply the selected style based on the prop
      ]}
      onPress={onPress} // Call the onPress function from the parent component
      activeOpacity={0.6}
    >
      <View style={tw`flex items-center`}>
        {icon}
        <Text style={tw`text-lg`}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
