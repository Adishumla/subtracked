import React, { useState, useEffect } from "react";
import { View, ScrollView, useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import supabase from "../../lib/supabaseStore";
import tw from "../../lib/tailwind";
import { Link } from "expo-router";
import Category from "../../components/Category";
import SubscriptionType from "../../components/SubscriptionType";
import { Button, Input, Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import z from "zod";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  let colorScheme = useColorScheme();

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
  const [iconId, setIconId] = useState<number | null>(null); // State to store the matched icon_id

  const validCategory = (category: string) => {
    return categories.includes(category);
  };

  const validSubscriptionType = (subscriptionType: string) => {
    return subscriptionTypes.includes(subscriptionType);
  };

  const subscriptionSchema = z.object({
    provider: z.string().min(1).max(20),
    cost: z.number().min(1).max(10000),
    bill_date: z.date(),
    note: z.string().min(0).max(100),
    category: z.string().refine(validCategory),
    plan: z.string().refine(validSubscriptionType),
  });

  const dateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleSave = async () => {
    try {
      // Fetch the icon_id based on the provider's name
      const { data: iconData, error: iconError } = await supabase
        .from("icons")
        .select("id")
        .eq("name", provider);

      if (iconError) {
        console.error("Error fetching icon_id:", iconError.message);
      } else {
        let iconId = null; // Initialize iconId as null

        if (iconData.length > 0) {
          // If an icon with the provider's name is found, set the icon_id
          iconId = iconData[0].id;
        } else {
          // Handle the case where no matching icon is found
          iconId = 2; // You can set it to a default value or handle it accordingly
        }

        const formData = {
          provider,
          cost: price,
          bill_date: date,
          note,
          category: selectedCategory,
          plan: selectedSubscriptionType,
        };

        const validatedData = subscriptionSchema.parse(formData);

        const { data, error } = await supabase
          .from("subscriptions")
          .insert([
            {
              user_id: await AsyncStorage.getItem("id"),
              icon_id: iconId, // Include the icon_id in the data to be inserted
              ...validatedData,
            },
          ])
          .single();

        if (error) {
          console.error("Error inserting data:", error);
        } else {
          // Data inserted successfully
          // You can perform any further actions here
        }
      }
    } catch (validationError: any | z.ZodError) {
      // Handle validation errors
      console.error("Validation error:", validationError.message);
      // You can also set some state or display error messages to the user
    }
  };

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
            size={28}
            color={`${colorScheme === "dark" ? "#FDFDFF" : "#202020"}`}
          />
          <Text
            style={tw`font-Inter text-H4 self-center font-normal ${
              colorScheme === "dark"
                ? "text-onBackgroundDark"
                : "text-onBackgroundLight"
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
          onChangeText={(value) => {
            console.log(value);
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
            placeholder="Ex. 99"
            inputContainerStyle={[tw`border-b-0 p-0 mt-0`]}
            containerStyle={[tw`border-b-0 p-0 mt-0`]}
            keyboardType="numeric" // Add keyboardType prop
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
              style={tw`w-full mr-8 text-black
            `}
              value={date ? new Date(date) : new Date()}
              onChange={dateChange}
            />
          </View>
        </View>
      </View>

      <View style={tw`mt-6 flex flex-col px-1`}>
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
          style={tw`rounded-xl border-2 border-gray-300 bg-inputSectionLight p-2 mt-4 text-onPrimaryLight
          `}
          placeholder="Ex. Annas mobil"
          inputContainerStyle={[tw`border-b-0 p-0 mt-0`]}
          containerStyle={[tw`border-b-0 p-0 mt-0`]}
          onChangeText={(value) => setNote(value)}
        />
        {/* <H4 content="Ex. Annas mobil"></H4> */}
      </View>

      <Button
        style={tw`mb-20
      `}
        buttonStyle={tw`bg-primaryLight rounded-xl p-4 shadow-md shadow-indigo-400
        `}
        titleStyle={tw`text-onPrimaryLight
        `}
        title="Spara"
        onPress={handleSave}
      />
    </ScrollView>
  );
}
