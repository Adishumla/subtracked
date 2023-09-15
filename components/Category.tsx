import tw from "twrnc";
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
      <>
        <Text style={tw`rounded-xl p-2 bg-white w-max`}>{name}</Text>
      </>
    );
  }
  //otherwise, return nothing
  else {
    return null;
  }
}
