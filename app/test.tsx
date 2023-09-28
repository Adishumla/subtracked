/* import React, { useRef, useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import tw from "../../lib/tailwind";

export default function App() {
  const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
  }, []);

  return (
    <View style={tw`flex-1 items-center justify-center mt-8`}>
      <LottieView
        autoPlay
        ref={animation}
        style={tw`w-full h-full`}
        loop
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require("../assets/animation.json")}
      />
    </View>
  );
}
 */
