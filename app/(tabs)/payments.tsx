import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Link } from "expo-router";
import supabase from "../../lib/supabaseStore";
import tw from "../../lib/tailwind";
import SubCard from "../../components/SubCard";
import { Button } from "react-native-elements";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Verify, subtle } from "crypto";
import { useFocusEffect } from "expo-router";
import React from "react";

export default function App() {
  let colorScheme = useColorScheme();

  const [subscriptions, setSubscriptions] = useState<any>([]);

  useEffect(() => {
    AsyncStorage.getItem("id").then((id) => {
      if (!id) {
        console.error("User not found.");
        return;
      }

      const fetchData = async () => {
        const currentDate = new Date();

        try {
          const { data: subscriptions, error } = await supabase
            .from("subscriptions")
            .select("icons (url), *")
            .order("bill_date", { ascending: true })
            .eq("user_id", id);
          if (error) {
            console.error("Error fetching data:", error.message);
          } else {
            console.log("Fetched data:", subscriptions);

            const updatedSubscriptions = subscriptions.map((subscription) => {
              const billDate = new Date(subscription.bill_date);

              if (billDate < currentDate) {
                billDate.setMonth(billDate.getMonth() + 1);
                supabase
                  .from("subscriptions")
                  .update({ bill_date: billDate.toISOString() })
                  .eq("id", subscription.id)
                  .then((result) => {
                    if (result.error) {
                      console.error(
                        "Error updating bill_date:",
                        result.error.message
                      );
                    } else {
                      console.log(
                        "Bill date updated for subscription:",
                        subscription.id
                      );
                    }
                  });
              }

              return subscription;
            });

            setSubscriptions(updatedSubscriptions);
          }
        } catch (error) {
          //@ts-ignore
          console.error("An error occurred:", error.message);
        }
      };

      fetchData();
    });
  }, []);

  const groupedSubscriptions = subscriptions.reduce(
    (data: any, subscription: any) => {
      const billDate = new Date(subscription.bill_date);
      const month = billDate.toLocaleString("sv-SE", { month: "long" });
      const year = billDate.getFullYear();

      const key = `${year}-${month}`;
      if (!data[key]) {
        data[key] = {
          label: `${month} ${year}`,
          subscriptions: [],
          totalCost: 0,
        };
      }
      data[key].subscriptions.push(subscription);
      data[key].totalCost += subscription.cost;
      return data;
    },
    {}
  );

  const sortedGroupedSubscriptions = Object.keys(groupedSubscriptions).reduce(
    (sortedData: any, key) => {
      sortedData[key] = groupedSubscriptions[key];
      return sortedData;
    },
    {}
  );

  let currentMonth = "";

  return (
    <ScrollView
      style={[
        tw`px-4 pt-8 ${colorScheme === "dark" ? "bg-backgroundPrimaryDark" : "bg-backgroundPrimaryLight"}`,
      ]}
    >
      <View style={tw`mb-16 gap-5`}>
      <Link href="/(tabs)/overview">
        {/* Icon chevron right/left */}
        <Text style={tw`font-Inter text-H4 font-medium ${colorScheme === "dark" ? "text-onBackgroundDark" : "text-onBackgroundLight"}`}>Tillbaka</Text>
      </Link>
      <Text style={tw`font-Inter text-H1 font-medium ${colorScheme === "dark" ? "text-H1Dark" : "text-onBackgroundLight"}`}>Kommande betalningar</Text>
      </View>

      <View>
        {Object.keys(sortedGroupedSubscriptions).map((data) => {
          const monthLabel = data.split("-")[1];
          const totalCost = sortedGroupedSubscriptions[data].totalCost;

          if (monthLabel !== currentMonth) {
            currentMonth = monthLabel;
            return (
              <View key={data}>
                <View style={tw`flex flex-row justify-between`}>
                  <Text style={tw`font-Inter mb-[20px] text-H2 font-medium ${colorScheme === "dark" ? "text-onBackgroundDark" : "text-onBackgroundLight"}`}>{monthLabel}</Text>
                  <Text style={tw`font-Inter mb-[20px] text-H2 font-medium ${colorScheme === "dark" ? "text-onBackgroundDark" : "text-onBackgroundLight"}`}>{totalCost + " kr"}</Text>
                </View>

                {sortedGroupedSubscriptions[data].subscriptions.map(
                  (subscription: any) => (
                    <View key={subscription.id}>
                      <SubCard
                        productName={subscription.provider}
                        icon="Bild"
                        price={subscription.cost + "kr"}
                        subType={subscription.plan}
                        subId={subscription.id}
                        subStatus={subscription.draw_unsuccessful}
                        productIcon={subscription.icons.url}
                      />
                    </View>
                  )
                )}
              </View>
            );
          } else {
            return (
              <View key={data}>
                {sortedGroupedSubscriptions[data].subscriptions.map(
                  (subscription: any) => (
                    <View key={subscription.id}>
                      <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`font-Inter mb-[20px] text-H2 font-medium ${colorScheme === "dark" ? "text-onBackgroundDark" : "text-onBackgroundLight"}`}>{monthLabel}</Text>
                        <Text style={tw`font-Inter mb-[20px] text-H2 font-medium ${colorScheme === "dark" ? "text-onBackgroundDark" : "text-onBackgroundLight"}`}>{totalCost + " kr"}</Text>
                       </View>
                      <SubCard
                        productName={subscription.provider}
                        icon="Bild"
                        price={subscription.cost + "kr"}
                        subType={subscription.plan}
                        subId={subscription.id}
                        subStatus={subscription.draw_unsuccessful}
                        productIcon={subscription.icons.url}
                      />
                    </View>
                  )
                )}
              </View>
            );
          }
        })}
      </View>
    </ScrollView>
  );
}
