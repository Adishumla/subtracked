import React from "react";
import { View, Image } from "react-native";
import tw from "twrnc";

export default function App() {
  return (
    <View style={tw`flex-1 items-center justify-center mt-8`}>
           <Image
                  style={tw`w-50% h-50%`}
                  source={require("../../assets/images/cookies.png")}
                />
    </View>
  );
}
