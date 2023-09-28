import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, useColorScheme } from "react-native";
import { useRoute } from "@react-navigation/native";
import tw from "../../../lib/tailwind";
import supabase from "../../../lib/supabaseStore";
import SubscriptionType from "../../../components/SubscriptionType";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Define an interface for your subscription data
interface Subscription {
  bill_date: string;
  category: string;
  cost: number;
  created_at: string;
  id: number;
  note: string;
  provider: string;
  user_id: string;
  plan: string;
  draw_unsuccessful: boolean;
  price_increase: boolean;
  icons: {
    url: string;
  };
}

const ManageSub = () => {
  let colorScheme = useColorScheme();
  const route = useRoute();
  const { subId } = route.params as { subId: string };
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  async function getSub() {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("icons (url), *")
      .eq("id", subId);
    if (error) {
      console.error(error);
      return;
    }
    if (data.length > 0) {
      setSubscription(data[0] as Subscription);
      console.log(data[0]);
    } else {
      setSubscription(null);
    }
  }

  useEffect(() => {
    getSub();
  }, [subId]);

  return (
    <ScrollView
      style={tw`${
        colorScheme === "dark"
          ? "bg-backgroundPrimaryDark"
          : "bg-backgroundPrimaryLight"
      }`}
    >
      <View
        style={tw`flex-1 justify-center items-center w-full ${
          colorScheme === "dark"
            ? "bg-backgroundPrimaryDark"
            : "bg-backgroundPrimaryLight"
        }`}
      >
        {subscription && (
          <>
            <View style={tw`flex w-full`}>
              <View style={tw`flex justify-between items-center w-full`}>
                <Image
                  source={{ uri: subscription.icons.url }}
                  style={tw`w-16 h-16 rounded-full mt-8 mb-2`}
                />
              </View>
              <View
                style={tw`flex flex-col justify-center items-center w-full`}
              >
                <Text
                  style={tw`text-H1 font-Inter font-medium text-center ${
                    colorScheme === "dark"
                      ? "text-H1Dark"
                      : "text-onBackgroundLight"
                  }`}
                >
                  {subscription.provider}
                </Text>
                <Text
                  style={tw`text-H4 font-normal font-Inter ${
                    colorScheme === "dark"
                      ? "text-onBackgroundDark"
                      : "text-onBackgroundLight"
                  }
                `}
                >
                  {subscription.note}
                </Text>
              </View>
              <View
                style={tw`${
                  subscription.draw_unsuccessful || subscription.price_increase
                    ? "my-6"
                    : "my-[-15px]"
                }
              `}
              >
                {subscription.draw_unsuccessful ? (
                  <View
                    style={tw`mb-1 flex-row w-11/12 p-2 mx-4 shadow-lg shadow-indigo-600 justify-between items-center 
                    ${colorScheme === "dark"
                      ? "bg-primaryDark text-onBackgroundDark"
                      : "bg-primaryLight text-onBackgroundLight"}
                    `}
                  >
                    <View
                      style={tw`w-8 h-8 bg-danger rounded-full items-center justify-center`}
                    >
                      <MaterialCommunityIcons
                        name="exclamation"
                        size={34}
                        color="black"
                      />
                    </View>
                    <Text
                      style={tw`text-H4 font-Inter pl-2 ${
                        colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"
                      }
                  `}
                    >
                      Kunde ej dras!
                    </Text>
                    <View
                      style={tw`flex flex-row justify-end items-center pl-16
                  `}
                    >
                      <Text
                        style={tw`text-H4 font-Inter font-normal
                      ${
                        colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"
                      }
                  `}
                      >
                        Mer info
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={38}
                        color={`${colorScheme === "dark" ?  "#FDFDFF" : "#202020" }`}
                        />
                    </View>
                  </View>
                ) : (
                  <Text style={tw`text-H2 text-white`}></Text>
                )}
                {subscription.price_increase ? (
                  <View
                  style={tw`flex-row w-11/12 p-2 mx-4 shadow-lg shadow-indigo-600 justify-between items-center 
                  ${colorScheme === "dark"
                    ? "bg-primaryDark text-onBackgroundDark"
                    : "bg-primaryLight text-onBackgroundLight"}
                  `}
                >
                    <View
                      style={tw`w-8 h-8 bg-alert rounded-full items-center justify-center`}
                    >
                      <MaterialCommunityIcons
                        name="exclamation"
                        size={34}
                        color="black"
                      />
                    </View>
                    <Text
                      style={tw`text-H4 font-Inter ${
                        colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"
                      }
                  `}
                    >
                      Prishöjning!
                    </Text>
                    <View
                      style={tw`flex flex-row justify-end items-center pl-16
                `}
                    >
                      <Text
                        style={tw`text-H4 font-Inter pl-4 font-normal
                        ${
                          colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"
                        }
                    `}
                      >
                        Mer info
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={38}
                        color={`${colorScheme === "dark" ?  "#FDFDFF" : "#202020" }`}
                        />
                    </View>
                  </View>
                ) : (
                  <Text style={tw`text-H2 text-white`}></Text>
                )}
              </View>

              <View
                style={[tw`my-4 p-3  ${colorScheme === "dark" ? "bg-backgroundSecondaryDark" : "bg-backgroundSecondaryLight"}
              `]}
              >
                <Text
                  style={[tw`text-H2 font-medium ${colorScheme === "dark" ? "text-onBackgroundDark" : "text-onBackgroundLight"}
                `]}
                >
                  Om abonnemanget
                </Text>
                <View
                  style={tw`flex-row justify-between items-center w-26 mt-4`}
                >
                  <SubscriptionType
                    width={28}
                    name={subscription.plan}
                    onPress={() => {}}
                    selected={false}
                  />
                </View>
                <View style={tw`flex-col justify-between items-center w-full`}>
                <View style={tw`w-full p-3 m-2 rounded-xl ${colorScheme === "dark" ? "bg-tertiaryDark" : "bg-tertiaryLight"}`}>
                    <View style={tw`flex flex-row justify-between`}>
                      <Text
                        style={tw`text-H3 font-normal font-Inter ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}
                    `}
                      >
                        Månadskostnad
                      </Text>
                      <Text
                        style={tw`text-H3 font-normal font-Inter ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}
                        `}
                      >
                        {subscription.cost} kr
                      </Text>
                    </View>
                  </View>
                  <View style={tw`w-full p-3 m-2 rounded-xl ${colorScheme === "dark" ? "bg-tertiaryDark" : "bg-tertiaryLight"}`}>
                    <View style={tw`flex flex-row justify-between`}>
                      <Text
                        style={tw`text-H3 font-normal font-Inter ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}
                        `}
                      >
                        Årskostnad
                      </Text>
                      <Text
                        style={tw`text-H3 font-normal font-Inter ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}
                        `}
                      >
                        {subscription.cost * 12} kr
                      </Text>
                    </View>
                  </View>
                  <View style={tw`w-full p-3 m-2 rounded-xl ${colorScheme === "dark" ? "bg-tertiaryDark" : "bg-tertiaryLight"}`}>
                    <View style={tw`flex flex-row justify-between`}>
                      <Text
                        style={tw`text-H3 font-normal font-Inter ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}
                        `}
                      >
                        Nästa dragning
                      </Text>
                      <Text
                        style={tw`text-H3 font-normal font-Inter ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}
                        `}
                      >
                        {subscription.bill_date}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={tw`flex mt-12 p-4 mx-4 shadow-lg shadow-indigo-600 ${colorScheme === "dark" ? "bg-primaryDark" : "bg-primaryLight"}
              `}
              >
                <Text 
                style={tw`text-H4 font-Inter font-normal ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}`}
                >
                  För mer information, uppsägning och ändringar agående
                  abbonnemanget, gå till leverantörens hemsida.
                </Text>
                <Link
                style={tw`text-H4 font-Inter self-end underline font-medium ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}`}                  /* www.provider.com */
                  href={`http://www.${subscription.provider}.com`}
                >
                  www.{subscription.provider}.com
                </Link>
              </View>
              <View
                style={tw`p-4 my-12 rounded-xl mx-4 shadow-lg shadow-indigo-600 ${colorScheme === "dark" ? "bg-primaryDark" : "bg-primaryLight"}
                `}
              >
                <Link
                  href={`/editSub/${subId}`}
                  style={tw`w-full h-7 flex flex-row ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}
                  `}
                >
                  <View
                    style={tw`flex flex-row items-center w-full justify-between pt-1
                    `}
                  >
                    <Text
                      style={tw`text-H4 font-Inter font-normal ${colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"}
                    `}
                    >
                      Ändra abonnemang
                    </Text>
                    <MaterialCommunityIcons
                      style={tw``}
                      name="chevron-right"
                      size={28}
                      color={`${colorScheme === "dark" ?  "#FDFDFF" : "#202020" }`}                    />
                  </View>
                </Link>
              </View>
            </View>
          </>
        )}

        {/* Display a message if no subscription data is available */}
        {!subscription && (
          <Text style={tw`text-lg text-white`}>
            No subscription found for ID: {subId}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ManageSub;
