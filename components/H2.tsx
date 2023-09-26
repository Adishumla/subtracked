import tw from '../lib/tailwind';
import { useState, useEffect } from "react";
import { Text, View } from "react-native";

interface CategoryProps {
    content: string;
  }

export default function H2({content}:CategoryProps)  {
    return (
        <>
          <Text style={tw`font-medium font-Inter text-2xl text-white`}>{content}</Text>
        </>
      );
}