import tw from "../lib/tailwind";
import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";

interface CategoryProps {
  name: string;
  onPress?: () => void; // Add the onPress prop
  selected?: boolean; // Add the selected prop
}

export default function Category({ name, onPress, selected }: CategoryProps) {
  let colorScheme = useColorScheme();
  // Use the 'selected' prop to determine if the category is selected
  const isSelected = selected || false;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tw`rounded-xl  m-1 h-10 justify-center items-center shadow-md shadow-blue-600 text-white
          `,
          colorScheme === "dark"
            ? tw`bg-primaryDark text-onPrimaryDark`
            : tw`bg-primaryLight text-onPrimaryLight`,
          isSelected
            ? colorScheme === "dark"
              ? tw`bg-secondaryDark`
              : tw`bg-secondaryLight`
            : tw``,
        ]}
      >
        <Text
          style={[
            tw`py-3 px-4 
          
         `,
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
