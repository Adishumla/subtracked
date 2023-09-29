import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, useColorScheme } from "react-native";
import supabase from "../../../lib/supabaseStore";
import tw from "../../../lib/tailwind";
import Category from "../../../components/Category";
import SubscriptionType from "../../../components/SubscriptionType";
import { Button, Input } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  }, [subId]);

  const categories = [
    "Hushåll",
    "Hälsa",
    "Ljud",
    "Molntjänst",
    "Spel",
    "Streaming",
  ];
  const subscriptionTypes = ["Eget", "Delat", "Familj"];
  const [provider, setProvider] = useState<string>(
    subscription?.provider || ""
  );
  const [price, setPrice] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubscriptionType, setSelectedSubscriptionType] =
    useState<string>("");
  const dateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  useEffect(() => {
    if (subscription) {
      setProvider(subscription.provider);
      setPrice(subscription.cost);
      setDate(subscription.bill_date);
      setNote(subscription.note);
      setSelectedCategory(subscription.category);
      setSelectedSubscriptionType(subscription.plan);
    }
  }, [subscription]);
  return (
    <ScrollView
      style={tw`px-4 pt-8 ${
        colorScheme === "dark"
          ? "bg-backgroundPrimaryDark"
          : "bg-backgroundPrimaryLight"
      }

    `}
    >
      <View style={tw`mb-5`}>
        <Link href="/(tabs)/overview" style={tw`flex`}>
          <MaterialCommunityIcons
            style={tw``}
            name="chevron-left"
            size={15}
            color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
          />
          <Text
            style={tw`font-Inter text-H4 h-full  font-normal flex self-center text-center mt-0 items-center
             ${
               colorScheme === "dark"
                 ? "text-onBackgroundDark"
                 : "text-onPrimaryLight"
             }`}
          >
            Tillbaka
          </Text>
        </Link>
      </View>

      <Text
        style={tw`mb-16 font-Inter text-H1 font-medium ${
          colorScheme === "dark" ? "text-H1Dark" : "text-onBackgroundLight"
        }`}
      >
        Ändra abonnemang
      </Text>

      <View style={tw`mt-0`}>
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
              selected={category === selectedCategory}
            />
          ))}
        </View>
      </View>

      <View style={tw`mt-12`}>
        <View style={tw`px-1`}>
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
        </View>
        <Input
          style={tw`rounded-xl border-2 border-gray-300 bg-inputSectionLight p-2 mt-4 text-onPrimaryLight
          `}
          placeholder="Ex. Spotify"
          inputContainerStyle={[tw`border-b-0 p-0 mt-0`]}
          containerStyle={[tw`border-b-0 p-0 mt-0`]}
          value={provider}
          onChangeText={(value) => {
            setProvider(value);
          }}
        />
        {/* <H4 content="Ex. Spotify"></H4> */}
      </View>

      <View
        style={tw`flex flex-row justify-between px-0
      `}
      >
        <View style={tw`w-1/2`}>
          <View style={tw`px-1`}>
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
          </View>
          <Input
            style={tw`rounded-xl border-2 border-gray-300 bg-inputSectionLight p-2 mt-4 text-onPrimaryLight`}
            placeholder={subscription?.cost.toString()}
            inputContainerStyle={[tw`border-b-0 p-0 mt-0`]}
            containerStyle={[tw`border-b-0 p-0 mt-0`]}
            keyboardType="numeric" // Add keyboardType prop
            value={price.toString()}
            onChangeText={(value) => setPrice(parseInt(value))}
          />
        </View>

        <View style={tw`w-1/2`}>
          <View style={tw`px-5`}>
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
          </View>
          <View style={tw`mt-4 w-full flex pr-8`}>
            <DateTimePicker
              textColor="#202020"
              style={tw`w-full mr-8 text-black bg-transparent
            `}
              value={date ? new Date(date) : new Date()}
              onChange={dateChange}
            />
          </View>
        </View>
      </View>

      <View style={tw` flex flex-col px-1`}>
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
        <View style={tw`flex items-center justify-center flex-row`}>
          {subscriptionTypes.map((subscriptionType, index) => (
            <View
              key={subscriptionType}
              style={[
                tw`flex-1 p-0 mt-4`,
                index !== subscriptionTypes.length - 1 && tw`mr-2`,
              ]}
            >
              <SubscriptionType
                name={subscriptionType}
                width={28}
                onPress={() => {
                  if (selectedSubscriptionType === subscriptionType) {
                    setSelectedSubscriptionType("");
                  } else {
                    setSelectedSubscriptionType(subscriptionType);
                  }
                }}
                selected={subscriptionType === selectedSubscriptionType}
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
          style={tw`rounded-xl border-2 border-gray-300 bg-inputSectionLight p-2 mt-4 text-onPrimaryLight
          `}
          placeholder="Ex. Annas mobil"
          inputContainerStyle={[tw`border-b-0 p-0 mt-0`]}
          containerStyle={[tw`border-b-0 p-0 mt-0`]}
          onChangeText={(value) => setNote(value)}
          value={note}
        />
        {/* <H4 content="Ex. Annas mobil"></H4> */}
      </View>

      <Button
        buttonStyle={tw`p-4 rounded-xl ${
          colorScheme === "dark"
            ? "bg-primaryDark shadow-md"
            : "bg-primaryLight shadow-md"
        }`}
        titleStyle={tw`${
          colorScheme === "dark" ? "text-onPrimaryDark" : "text-onPrimaryLight"
        }`}
        style={tw`mt-8 mb-16`}
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
