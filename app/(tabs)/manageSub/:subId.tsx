import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, useColorScheme } from "react-native";
import { useRoute } from "@react-navigation/native";
import tw from "../../../lib/tailwind";
import supabase from "../../../lib/supabaseStore";
import SubscriptionType from "../../../components/SubscriptionType";
import { Pressable } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Category from "../../../components/Category";

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
        colorScheme === "dark" ? "bg-backgroundPrimaryDark" : "bg-backgroundPrimaryLight"
      }`}
    >
      <View
        style={tw`flex-1 justify-center items-center w-full ${
          colorScheme === "dark" ? "bg-backgroundPrimaryDark" : "bg-backgroundPrimaryLight"
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
                  style={tw`text-4xl text-white text-center ${
                    colorScheme === "dark"
                      ? "bg-backgroundPrimaryDark"
                      : "text-onBackgroundLight"
                  }`}
                >
                  {subscription.provider}
                </Text>
                <Text
                  style={tw`text-base text-white text-center ${
                    colorScheme === "dark"
                      ? "bg-black"
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
                    style={tw`flex-row bg-white w-11/12 p-2 mx-4 shadow-lg shadow-indigo-600 justify-between items-center 
                `}
                  >
                    <View
                      style={tw`w-8 h-8 bg-red-500 rounded-full items-center justify-center`}
                    >
                      <MaterialCommunityIcons
                        name="exclamation"
                        size={34}
                        color="black"
                      />
                    </View>
                    <Text
                      style={tw`text-xl text-white pl-2 ${
                        colorScheme === "dark" ? "bg-black" : "text-black"
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
                        style={tw`text-xl text-white pl-2 font-normal
                      ${colorScheme === "dark" ? "bg-black" : "text-black"}
                  `}
                      >
                        Mer info
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={38}
                        color="black"
                      />
                    </View>
                  </View>
                ) : (
                  <Text style={tw`text-H2 text-white`}></Text>
                )}
                {subscription.price_increase ? (
                  <View
                    style={tw`flex-row bg-white w-11/12 p-2 mx-4 shadow-lg shadow-indigo-600 justify-between items-center mt-2
              `}
                  >
                    <View
                      style={tw`w-8 h-8 bg-yellow-400 rounded-full items-center justify-center`}
                    >
                      <MaterialCommunityIcons
                        name="exclamation"
                        size={34}
                        color="black"
                      />
                    </View>
                    <Text
                      style={tw`text-xl text-white pl-0
                    ${colorScheme === "dark" ? "bg-black" : "text-black"}
                `}
                    >
                      Prishöjning!
                    </Text>
                    <View
                      style={tw`flex flex-row justify-end items-center pl-16
                `}
                    >
                      <Text
                        style={tw`text-xl text-white pl-2 font-normal
                    ${colorScheme === "dark" ? "bg-black" : "text-black"}
                `}
                      >
                        Mer info
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={38}
                        color="black"
                      />
                    </View>
                  </View>
                ) : (
                  <Text style={tw`text-H2 text-white`}></Text>
                )}
              </View>

              <View
                style={tw`bg-backgroundSecondaryLight my-4 p-3
              `}
              >
                <Text
                  style={tw`text-H2 text-onBackgroundLight
                `}
                >
                  Om abonnemanget
                </Text>
                <View
                  style={tw`flex-row justify-between items-center w-26 mt-4`}
                >
                  <SubscriptionType
                    name={subscription.plan}
                    onPress={() => {}}
                    selected={false}
                  />
                </View>
                <View style={tw`flex-col justify-between items-center w-full`}>
                  <View style={tw`w-full bg-tertiaryLight p-3 m-2 rounded-xl`}>
                    <View style={tw`flex flex-row justify-between`}>
                      <Text
                        style={tw`text-xl text-black 
                    `}
                      >
                        Månadskostnad
                      </Text>
                      <Text
                        style={tw`text-xl text-black
                    `}
                      >
                        {subscription.cost} kr
                      </Text>
                    </View>
                  </View>
                  <View style={tw`w-full bg-tertiaryLight p-3 m-2 rounded-xl`}>
                    <View style={tw`flex flex-row justify-between`}>
                      <Text
                        style={tw`text-xl text-black 
                    `}
                      >
                        Årskostnad
                      </Text>
                      <Text
                        style={tw`text-xl text-black
                    `}
                      >
                        {subscription.cost * 12} kr
                      </Text>
                    </View>
                  </View>
                  <View style={tw`w-full bg-tertiaryLight p-3 m-2 rounded-xl`}>
                    <View style={tw`flex flex-row justify-between`}>
                      <Text
                        style={tw`text-xl text-black 
                    `}
                      >
                        Nästa dragning
                      </Text>
                      <Text
                        style={tw`text-xl text-black
                    `}
                      >
                        {subscription.bill_date}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={tw`bg-primaryLight flex mt-12 p-4 mx-4 shadow-lg shadow-indigo-600
              `}
              >
                <Text style={tw`text-lg`}>
                  För mer information, uppsägning och ändringar agående
                  abbonnemanget, gå till leverantörens hemsida.
                </Text>
                <Link
                  style={tw`self-end underline text-lg`}
                  /* www.provider.com */
                  href={`http://www.${subscription.provider}.com`}
                >
                  www.{subscription.provider}.com
                </Link>
              </View>
              <View
                style={tw`text-base text-white bg-white p-4 my-12 rounded-xl mx-4 shadow-lg shadow-indigo-600
                `}
              >
                <Link
                  href={`/editSub/${subId}`}
                  style={tw`text-base text-black w-full  h-7 flex flex-row justify-between items-center
                  `}
                >
                  <View
                    style={tw`flex flex-row justify-between items-center pt-1
                    `}
                  >
                    <Text
                      style={tw`text-base text-black 
                    `}
                    >
                      Ändra abonnemang
                    </Text>
                    <MaterialCommunityIcons
                      style={tw``}
                      name="chevron-right"
                      size={28}
                      color="black"
                    />
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
