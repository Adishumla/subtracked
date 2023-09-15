import tw from "twrnc";
import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";

interface CategoryProps {
  name: string;
  onPress?: () => void; // Add the onPress prop
  selected?: boolean; // Add the selected prop
}

export default function Category({ name, onPress, selected }: CategoryProps) {
  // Use the 'selected' prop to determine if the category is selected
  const isSelected = selected || false;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[tw`rounded-xl bg-white m-1`, isSelected && tw`bg-blue-500`]}
      >
        <Text style={tw`p-2 `}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
