import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import supabase from "../../lib/supabaseStore";
import tw from "twrnc";
import Category from "../../components/Category";
import SubscriptionType from "../../components/SubscriptionType";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H4 from "../../components/H4";
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import z from "zod";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function App() {
  const categories = [
    "Streaming",
    "Ljud",
    "Hälsa",
    "Hushåll",
    "Spel",
    "Molntjänst",
  ];
  const subscriptionTypes = ["Eget", "Delat", "Familj"];
  const [provider, setProvider] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubscriptionType, setSelectedSubscriptionType] =
    useState<string>("");

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

  return (
    <ScrollView style={tw`px-4 pt-8`}>
      <H4 content="<-- Tillbaka ska den här ens vara här?"></H4>
      <H1 content={"Lägg till abonnemang"}></H1>

      <View style={tw`mt-16`}>
        <H2 content="Kategori"></H2>
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
        <H2 content={"Leverantör"}></H2>
        <Input
          placeholder="Ex. Spotify"
          onChangeText={(value) => setProvider(value)}
        />
        <H4 content="Ex. Spotify"></H4>
      </View>

      <View style={tw`mt-12`}>
        <View style={tw``}>
          <H2 content={"Pris/mån"}></H2>
          <Input
            placeholder="Ex. 99"
            onChangeText={(value) => setPrice(parseInt(value))}
          />
        </View>

        <View style={tw` mt-12`}>
          <H2 content={"Betaldatum"}></H2>
          {/* <Input placeholder="Ex. 1" onChangeText={(value) => setDate(value)} /> */}
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            onChange={dateChange}
          />
        </View>
      </View>

      <View style={tw`mt-12 flex flex-col`}>
        <H2 content={"Abonnemangstyp"}></H2>
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
        <H2 content={"Notering"}></H2>
        <Input
          placeholder="Ex. Annas mobil"
          onChangeText={(value) => setNote(value)}
        />
        <H4 content="Ex. Annas mobil"></H4>
      </View>

      <Button
        style={tw`mb-12`}
        title="Spara"
        onPress={async () => {
          try {
            const formData = {
              provider,
              cost: price,
              bill_date: date,
              note,
              category: selectedCategory,
              plan: selectedSubscriptionType,
            };

            const validatedData = subscriptionSchema.parse(formData);

            // If validation passes, continue with inserting data into the database
            const { data, error } = await supabase
              .from("subscriptions")
              .insert([
                {
                  user_id: await AsyncStorage.getItem("id"),
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
          } catch (validationError: any | z.ZodError) {
            // Handle validation errors
            console.error("Validation error:", validationError.message);
            // You can also set some state or display error messages to the user
          }
        }}
      />
    </ScrollView>
  );
}
