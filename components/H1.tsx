import tw from "../lib/tailwind";
import { Text } from "react-native";
interface CategoryProps {
  content: string;
}

export default function H1({ content }: CategoryProps) {
  return (
    <>
      <Text
        style={tw`font-medium font-Inter text-3xl text-onBackgroundLight
          `}
      >
        {content}
      </Text>
    </>
  );
}
