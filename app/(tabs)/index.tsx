import React, { useEffect, useState } from "react";
import { Text, View, Button, Image } from "react-native";
import supabase from "../../lib/supabaseStore";
import { signInWithGoogle, signOut } from "../../lib/authentication";
import tw from "tailwind-react-native-classnames";

export default function TabOneScreen() {
  const [user, setUser] = useState({ data: null, error: null });
  const [name, setName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loginInProgress, setLoginInProgress] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      console.log("user", data);
      console.log("email", data?.user?.user_metadata?.full_name);
      setName(data?.user?.user_metadata?.full_name);
      setProfilePic(data?.user?.user_metadata?.avatar_url);
      setUser({ data, error } as any);
      console.log(supabase);
    }

    fetchUser();
  }, []);

  const handleLogin = async () => {
    setLoginInProgress(true); // Set login in progress
    const { user, error } = (await signInWithGoogle()) as any;
    if (user) {
      const userMetadata = user.user_metadata;
      setName(userMetadata.full_name);
      setProfilePic(userMetadata.avatar_url);
      setUser({ data: user, error: null });
    } else {
      setUser({ data: null, error });
    }
    setLoginInProgress(false); // Reset login in progress
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      setUser({ data: null, error: null });
      setName(null);
      setProfilePic(null);
    }
  };

  return (
    <View style={[tw`flex-1 items-center justify-center`]}>
      {profilePic && (
        <Image
          source={{ uri: profilePic }}
          style={[tw`w-24 h-24 rounded-full`]}
        />
      )}

      {name && <Text style={[tw`text-2xl text-white`]}>{name}</Text>}

      {user.data ? (
        <Button title="Logout" onPress={handleLogout} />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={loginInProgress} // Disable the button during login
        />
      )}
      <View />
    </View>
  );
}
