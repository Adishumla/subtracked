import React, { useState } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

export default function App() {
  return (
    <View style={tw`flex-1 items-center justify-center mt-8`}>
      <Text style={tw`text-white text-xl`}>Test</Text>
    </View>
  );
}
