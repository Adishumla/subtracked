import React from "react";
import { View, Image } from "react-native";
import tw from "twrnc";
import { useColorScheme, Appearance } from "react-native";
import { Button } from "react-native-elements";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F1F1F1",
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#1B1B1B",
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? darkTheme : lightTheme}>
      <View style={tw`flex-1 items-center justify-center mt-8`}>
        <Button
          title="Dark mode"
          onPress={() => {
            //change color scheme
            Appearance.setColorScheme(
              colorScheme === "dark" ? "light" : "dark"
            );
          }}
        />
      </View>
    </ThemeProvider>
  );
}
