import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import tw from "twrnc";
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
    <View style={tw`flex-1 justify-center items-center bg-slate-500`}>
      {subscription && (
        <>
          <View>
            <Image
              source={{ uri: subscription.icons.url }}
              style={tw`w-16 h-16`}
            />
            <Text style={tw`text-4xl text-white`}>{subscription.provider}</Text>
            <Text style={tw`text-base text-white`}>{subscription.note}</Text>

            {subscription.draw_unsuccessful ? (
              <Text style={tw`text-2xl text-white`}>Status: Failed</Text>
            ) : (
              <Text style={tw`text-2xl text-white`}></Text>
            )}
            {subscription.price_increase ? (
              <Text style={tw`text-2xl text-white`}>Price increase</Text>
            ) : (
              <Text style={tw`text-2xl text-white`}></Text>
            )}

            <Text style={tw`text-2xl text-white`}>Om abonnemanget</Text>
            <View style={tw`flex-row justify-between items-center w-26`}>
              <SubscriptionType
                name={subscription.plan}
                onPress={() => {}}
                selected={false}
              />
            </View>
            <Text style={tw`text-2xl text-white`}>
              Månadskostnad: {subscription.cost} kr
            </Text>
            <Text style={tw`text-2xl text-white`}>
              Årskostnad: {subscription.cost * 12} kr
            </Text>
            <Text style={tw`text-2xl text-white`}>
              Nästa dragning: {subscription.bill_date}
            </Text>
            <View style={tw`bg-[#DAD8D8] flex mt-16 p-4`}>
              <Text style={tw``}>
                För mer information, uppsägning och ändringar agående
                abbonnemanget, gå till leverantörens hemsida.
              </Text>
              <Link style={tw`self-end underline`} href="http://www.google.se">
                Läs mer här
              </Link>
            </View>
            <View style={tw`text-base text-white bg-white p-4 mt-2 rounded-xl`}>
              <Link
                href={`/editSub/${subId}`}
                style={tw`text-base text-black`}
                asChild
              >
                <Text style={tw`text-base text-black w-full bg-transparent `}>
                  Ändra abonnemang
                </Text>
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
  );
};

export default ManageSub;
