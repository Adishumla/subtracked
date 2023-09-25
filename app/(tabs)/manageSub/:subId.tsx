import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import tw from "twrnc";
import supabase from "../../../lib/supabaseStore";
import SubscriptionType from "../../../components/SubscriptionType";
import { Pressable } from "react-native";
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
}

const ManageSub = () => {
  const route = useRoute();
  const { subId } = route.params as { subId: string };
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  async function getSub() {
    const { data, error } = await supabase
      .from("subscriptions")
      .select()
      .eq("id", subId);
    if (error) {
      console.error(error);
      return;
    }
    if (data.length > 0) {
      setSubscription(data[0] as Subscription); // Set the subscription data
      console.log(data[0]);
    } else {
      setSubscription(null); // No matching subscription found
    }
  }

  useEffect(() => {
    getSub();
  }, []);

  return (
    <View style={tw`flex-1 justify-center items-center bg-blue-500`}>
      <Text style={tw`font-medium text-3xl text-white`}>Sub ID: {subId}</Text>

      {/* Display the subscription data if available */}
      {subscription && (
        <>
          <View style={tw`border p-2 my-2 rounded-md bg-white`}>
            <Text>Bill Date: {subscription.bill_date}</Text>
            <Text>Category: {subscription.plan}</Text>
            <Text>Cost: {subscription.cost}</Text>
            <Text>Created At: {subscription.created_at}</Text>
            <Text>ID: {subscription.id}</Text>
            <Text>Note: {subscription.note}</Text>
            <Text>Provider: {subscription.provider}</Text>
            <Text>User ID: {subscription.user_id}</Text>
            <Text>
              Status: {subscription.draw_unsuccessful ? "Failed" : "Success"}
            </Text>
          </View>
          <Text style={tw`text-4xl text-white`}>{subscription.provider}</Text>
          <Text style={tw`text-base text-white`}>{subscription.note}</Text>
          {/* Kunde inte dras eller prishöjning */}
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
          {/* link */}
          <Link href={`/editSub/${subId}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <MaterialCommunityIcons
                  name="information"
                  size={24}
                  color="black"
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
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
