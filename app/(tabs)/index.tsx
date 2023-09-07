import { StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import * as LocalAuthentication from "expo-local-authentication";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { SafeAreaView, Alert, Button } from "react-native";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={[tw`text-2xl italic`, styles.title]} lightColor="#000">
        Tab One
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Button
        title="Authenticate with Face ID"
        onPress={handleAuthentication}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

const handleAuthentication = async () => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();

    if (compatible) {
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (enrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to continue", // Message displayed to the user
        });

        if (result.success) {
          // Authentication was successful
          Alert.alert("Authentication successful!");
          // You can navigate to the main screen or perform any other actions here
        } else {
          // Authentication failed
          Alert.alert("Authentication failed.");
        }
      } else {
        Alert.alert("You have not enrolled in biometrics.");
      }
    } else {
      Alert.alert("Biometrics not available on this device.");
    }
  } catch (error) {
    console.error("Authentication error:", error);
  }
};
