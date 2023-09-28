import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, useColorScheme } from "react-native";
import supabase from "../../../lib/supabaseStore";
import tw from "../../../lib/tailwind";
import Category from "../../../components/Category";
import SubscriptionType from "../../../components/SubscriptionType";
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

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
}

export default function App() {
  let colorScheme = useColorScheme();

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

  const categories = [
    "Hushåll",
    "Hälsa",
    "Ljud",
    "Molntjänst",
    "Spel",
    "Streaming",
  ];
  const subscriptionTypes = ["Eget", "Delat", "Familj"];
  const [provider, setProvider] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubscriptionType, setSelectedSubscriptionType] =
    useState<string>("");

  return (
    <ScrollView style={tw`px-4 pt-8`}>
      <Text
        style={[
          tw`font-H4 ${
            colorScheme === "dark"
              ? "text-onPrimaryDark"
              : "text-onPrimaryLight"
          }`,
        ]}
      >
        Tillbaka
      </Text>
      <Text
        style={[
          tw`font-H1 ${
            colorScheme === "dark"
              ? "text-onPrimaryDark"
              : "text-onPrimaryLight"
          }`,
        ]}
      >
        Lägg till abonnemang
      </Text>

      <View style={tw`mt-16`}>
        <Text
          style={[
            tw`text-H2 ${
              colorScheme === "dark"
                ? "text-onPrimaryDark"
                : "text-onPrimaryLight"
            }`,
          ]}
        >
          Kategori
        </Text>
        <View style={tw`mt-5 flex flex-row flex-wrap`}>
          {categories.map((category) => (
            <Category
              key={category}
              name={category}
              onPress={() => setSelectedCategory(category)} // Update selected category
              selected={selectedCategory === category} // Pass selected prop
            />
          ))}
        </View>
      </View>

      <View style={tw`mt-12`}>
        <Text
          style={[
            tw`text-H2 ${
              colorScheme === "dark"
                ? "text-onPrimaryDark"
                : "text-onPrimaryLight"
            }`,
          ]}
        >
          Leverantör
        </Text>
        <Input
          placeholder="Ex. Spotify"
          onChangeText={(value) => setProvider(value)}
        />
        <Text
          style={[
            tw`font-H4 ${
              colorScheme === "dark"
                ? "text-onPrimaryDark"
                : "text-onPrimaryLight"
            }`,
          ]}
        >
          Ex. Spotify
        </Text>
      </View>

      <View style={tw`mt-12`}>
        <View style={tw``}>
          <Text
            style={[
              tw`text-H2 ${
                colorScheme === "dark"
                  ? "text-onPrimaryDark"
                  : "text-onPrimaryLight"
              }`,
            ]}
          >
            Pris/mån
          </Text>
          <Input
            placeholder="Ex. 99"
            onChangeText={(value) => setPrice(parseInt(value))}
          />
        </View>

        <View style={tw``}>
          <Text
            style={[
              tw`text-H2 ${
                colorScheme === "dark"
                  ? "text-onPrimaryDark"
                  : "text-onPrimaryLight"
              }`,
            ]}
          >
            Betaldatum
          </Text>
          <Input placeholder="Ex. 1" onChangeText={(value) => setDate(value)} />
        </View>
      </View>

      <View style={tw`mt-12`}>
        <Text
          style={[
            tw`text-H2 ${
              colorScheme === "dark"
                ? "text-onPrimaryDark"
                : "text-onPrimaryLight"
            }`,
          ]}
        >
          Abonnemangstyp
        </Text>
        <View style={tw`flex-1 items-center justify-center flex-row`}>
          {subscriptionTypes.map((subscriptionType, index) => (
            <View
              key={subscriptionType}
              style={[
                tw`flex-1 p-2`, // Adjust padding to control the size of SubscriptionType components
                index !== subscriptionTypes.length - 1 && tw`mr-2`, // Adjust margin between components
              ]}
            >
              <SubscriptionType
                name={subscriptionType}
                onPress={() => {
                  if (selectedSubscriptionType === subscriptionType) {
                    setSelectedSubscriptionType(""); // Deselect if already selected
                  } else {
                    setSelectedSubscriptionType(subscriptionType); // Select the current one
                  }
                }}
                selected={selectedSubscriptionType === subscriptionType}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={tw`mt-12`}>
        <Text
          style={[
            tw`text-H2 ${
              colorScheme === "dark"
                ? "text-onPrimaryDark"
                : "text-onPrimaryLight"
            }`,
          ]}
        >
          Notering
        </Text>

        <Input
          placeholder="Ex. Annas mobil"
          onChangeText={(value) => setNote(value)}
        />
        <Text
          style={[
            tw`font-H4 ${
              colorScheme === "dark"
                ? "text-onPrimaryDark"
                : "text-onPrimaryLight"
            }`,
          ]}
        >
          Ex. Annas mobil.
        </Text>
      </View>

      <Button
        style={tw`mb-12`}
        title="Uppdatera"
        onPress={async () => {
          const { data, error } = await supabase
            .from("subscriptions")
            .update({
              bill_date: date || subscription?.bill_date,
              category: selectedCategory || subscription?.category,
              cost: price || subscription?.cost,
              note: note || subscription?.note,
              plan: selectedSubscriptionType || subscription?.plan,
              provider: provider || subscription?.provider,
            })
            .eq("id", subId);
          if (error) {
            console.error("Error inserting data:", error);
          } else {
            console.log("Data inserted successfully:", data);
            // Optionally, you can clear the input fields or perform any other actions here
          }
        }}
      />
    </ScrollView>
  );
}
