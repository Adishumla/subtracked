import React, { useState, useEffect } from "react";
import { Pressable, Text, View, useColorScheme, Image } from "react-native";
import { Button, colors } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "../lib/tailwind";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useFocusEffect } from "expo-router";

interface SubCardProps {
  productName: string;
  price: string;
  subType: string;
  subId: string;
  subStatus: boolean;
  icon?: any;
  productIcon: any;
  priceIncrease?: boolean;
}

export default function SubCard({
  productName,
  price,
  subType,
  subId,
  subStatus,
  productIcon,
  priceIncrease,
}: SubCardProps) {
  const colorScheme = useColorScheme();

  // Function to render the subType icon based on its value
  const renderSubTypeIcon = () => {
    let icon = null;

    if (subType === "Eget") {
      icon = (
        <MaterialCommunityIcons
          name="account"
          size={20}
          color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
        />
      );
    } else if (subType === "Delat") {
      icon = (
        <MaterialCommunityIcons
          name="account-multiple"
          size={20}
          color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
        />
      );
    } else if (subType === "Familj") {
      icon = (
        <MaterialCommunityIcons
          name="account-group"
          size={20}
          color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
        />
      );
    }

    return icon || subType; // Return subType itself if no matching icon is found
  };

  return (
    <Link href={`/manageSub/${subId}`} asChild>
      <Pressable>
        <View
          style={[
            tw`flex-col font-Inter justify-between items-center px-0 py-4 rounded-full mt-[-10px] shadow-lg shadow-indigo-700`,
          ]}
        >
          <View
            style={[
              tw`flex-row items-center  rounded-lg w-full h-20 overflow-hidden px-4
              ${colorScheme === "dark" ? "bg-primaryDark" : "bg-primaryLight"}`,
            ]}
          >
            <View style={tw`mr-4 rounded-full`}>
              <Image
                source={{ uri: productIcon }}
                style={tw`w-14 h-14 rounded-full `}
              />
            </View>
            <View style={tw`flex-1`}>
              <View
                style={tw`flex flex-row justify-between items-start w-full`}
              >
                <Text
                  style={[
                    tw`font-Inter text-H2 font-medium ${
                      colorScheme === "dark"
                        ? "text-onBackgroundDark"
                        : "text-onBackgroundLight"
                    }`,
                  ]}
                >
                  {productName}
                </Text>
                <View style={tw`flex flex-row justify-between items-center`}>
                  <Button
                    title="Mer info"
                    buttonStyle={tw`p-0 m-0 bg-transparent`}
                    titleStyle={[
                      tw`text-H4 font-normal ${
                        colorScheme === "dark"
                          ? "text-onPrimaryDark"
                          : "text-onPrimaryLight"
                      }`,
                    ]}
                    onPress={() => console.log("hej")}
                  />
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
                  />
                </View>
              </View>
              <View>
                <Text
                  style={[
                    tw`font-light text-H4 font-light ${
                      colorScheme === "dark"
                        ? "text-onBackgroundDark"
                        : "text-onBackgroundLight"
                    }`,
                  ]}
                >
                  {price} / mån {renderSubTypeIcon()}
                </Text>
              </View>
            </View>
          </View>
          {subStatus === true ? (
            <View
              style={[
                tw`flex-col items-center w-full mt-[-8px]  pl-4 ${
                  priceIncrease === true ? "" : "rounded-b-xl"
                }
                ${
                  colorScheme === "dark"
                    ? "bg-secondaryDark"
                    : "bg-secondaryLight"
                }`,
              ]}
            >
              <View style={tw`flex flex-row items-center w-full p-1`}>
                <View style={tw`rounded-full bg-red-500`}>
                  <MaterialCommunityIcons
                    name="exclamation"
                    size={20}
                    color="black"
                  />
                </View>
                <Text
                  style={[
                    tw`text-H4 font-normal pl-2 ${
                      colorScheme === "dark"
                        ? "text-onPrimaryDark"
                        : "text-onPrimaryLight"
                    }`,
                  ]}
                >
                  Kunde ej dras!
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={tw`flex-col items-center bg-slate-600 w-full rounded-b-xl`}
            ></View>
          )}
          {priceIncrease === true ? (
            <View
              style={[
                tw`flex-col items-center w-full rounded-b-xl pl-4 ${
                  subStatus === true ? "mt-[-0px]" : "mt-[-8px]"
                }
                ${
                  colorScheme === "dark"
                    ? "bg-secondaryDark"
                    : "bg-secondaryLight"
                }`,
              ]}
            >
              <View style={tw`flex flex-row items-center w-full p-1`}>
                <View style={tw`rounded-full bg-yellow-500`}>
                  <MaterialCommunityIcons
                    name="exclamation"
                    size={20}
                    color="black"
                  />
                </View>
                <Text
                  style={[
                    tw`text-H4 font-normal pl-2 ${
                      colorScheme === "dark"
                        ? "text-onPrimaryDark"
                        : "text-onPrimaryLight"
                    }`,
                  ]}
                >
                  Prishöjning!
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={tw`flex-col items-center bg-slate-600 w-full rounded-b-xl mt-[-0px]`}
            ></View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
