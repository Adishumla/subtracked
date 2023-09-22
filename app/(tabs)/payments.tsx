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

export default function App() {
  // Fetch and save subscription data. Remove data not connected to the logged in user.
  const [subscriptions, setSubscriptions] = useState<any>([]);
  useEffect(() => {
    AsyncStorage.getItem("id").then((id) => {
      if (!id) {
        console.error("User not found.");
        return;
      }

      // Fetch all data from the "subscriptions" table containing correct user id.
      const fetchData = async () => {
        const currentDate = new Date(); // Get the current date and time


      //IF BILL DATE < TODAYS DATE { +1month} .then(update databas med nytt datum)



        try {
          const currentDate = new Date();
          const { data: subscriptions, error } = await supabase
            .from("subscriptions")
            .select("*")
            .order("bill_date", { ascending: true })
            .eq("user_id", id)
            .gt("bill_date", currentDate.toISOString()); // Filter out dates that have passed
          if (error) {
            console.error("Error fetching data:", error.message);
          } else {
            console.log("Fetched data:", subscriptions);

            setSubscriptions(subscriptions);
          }
        } catch (error) {
          //@ts-ignore
          console.error("An error occurred:", error.message);
        }
      };

      fetchData();
    });
  }, []);

  // Sort the subscriptions by date. Save year, month and day so that we're able
  // to show the cards in correct order. January 2024 is placed above December 2023 for example.
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
    <ScrollView style={tw`px-4 pt-8`}>
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
                        subStatus="active"
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
                        subStatus="active"
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
