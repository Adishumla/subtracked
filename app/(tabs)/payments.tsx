//TO DO : Rad 33 + ta bort adams fina stycke.

import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import supabase from "../../lib/supabaseStore";
import tw from "twrnc";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H3 from "../../components/H3";
import H4 from "../../components/H4";
import SubCard from "../../components/SubCard";
import { Button } from "react-native-elements";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Verify, subtle } from "crypto";
import { useFocusEffect } from "expo-router";
import React from "react";

export default function App() {
  const [subscriptions, setSubscriptions] = useState<any>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  /*  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem("darkMode");
      console.log("s");
    };
    fetchData();
    console.log("s");
  }, [AsyncStorage]); */
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const data = await AsyncStorage.getItem("darkMode");
        if (data === "true") {
          setDarkMode(true);
        } else {
          setDarkMode(false);
        }
      };
      fetchData();
      console.log("s");
    }, [])
  );

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
    <ScrollView style={[tw`px-4 pt-8`, darkMode ? tw`bg-black` : tw`bg-white`]}>
      <View>
        <H4 content="< Tillbaka" />
        <H1 content={"Kommande betalningar"} />
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
                  <H2 content={monthLabel} />
                  <H2 content={totalCost + "kr"} />
                </View>
                {sortedGroupedSubscriptions[data].subscriptions.map(
                  (subscription: any) => (
                    <View key={subscription.id}>
                      <Text>{subscription.name}</Text>

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
                        <H2 content={monthLabel} />
                        <H2 content={totalCost + "kr"} />
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
                      {/* Display the monthly cost */}
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
