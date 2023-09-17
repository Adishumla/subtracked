import tw from "twrnc";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";

interface CategoryProps {
  content: string;
}

export default function H4({ content }: CategoryProps) {
  return (
    <>
      <Text style={tw`font-normal text-lg text-white`}>{content}</Text>
    </>
  );
}
