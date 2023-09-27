import tw from "../lib/tailwind";
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
        style={[
          tw`rounded-xl bg-primaryLight m-1 h-10 justify-center items-center shadow-md shadow-blue-600 text-onPrimaryLight
        `,
          isSelected && tw`bg-secondaryLight`,
        ]}
      >
        <Text
          style={tw`py-3 px-4 
         `}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
