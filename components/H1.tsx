import tw from "twrnc";
import { Text, View } from "react-native";

interface CategoryProps {
    content: string;
  }

export default function H2({content}:CategoryProps)  {
    return (
        <>
          <Text style={tw`font-medium text-3xl text-white`}>{content}</Text>
        </>
      );
}