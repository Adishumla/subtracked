import { signInWithEmail } from "../../lib/authentication";
import tw from "tailwind-react-native-classnames";
import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function EmailAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    const { user, error } = (await signInWithEmail(email, password)) as any;
    if (user) {
      const userMetadata = user.user_metadata;
      console.log(userMetadata);
    } else {
      console.log(error);
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Login</Text>
      <TextInput
        style={tw`border-2 border-gray-300 w-3/4 mb-4 p-2 rounded-md text-white`}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={tw`border-2 border-gray-300 w-3/4 mb-4 p-2 rounded-md`}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
