import tw from '../lib/tailwind';
import { useState, useEffect } from "react";
import { Text, View } from "react-native";

interface CategoryProps {
    content: string;
  }

export default function H3({content}:CategoryProps)  {
    return (
        <>
          <Text style={tw`font-normal font-Inter text-lg text-white`}>{content}</Text>
        </>
      );
}