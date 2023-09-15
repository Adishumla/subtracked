import tw from "tailwind-react-native-classnames";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";

interface CategoryProps {
  name: string;
}

export default function Category({ name }: CategoryProps) {
  //set the state of the category to false
  const [category, setCategory] = useState<boolean>(false);

  //useEffect to set the state of the category to true
  useEffect(() => {
    setCategory(true);
  }, []);

  //if the category is true, return the category name
  if (category) {
    return (
      <View>
        <Text style={tw`text-2xl rounded-md p-2 bg-white`}>{name}</Text>
      </View>
    );
  }
  //otherwise, return nothing
  else {
    return null;
  }
}
