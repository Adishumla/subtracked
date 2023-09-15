import { View, StyleSheet, Text } from "react-native";
import supabase from "../../lib/supabaseStore";
import { useState } from "react";
import tw from "twrnc";
import Category from "../../components/Category";
import SubscriptionType from "../../components/SubscriptionType";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H4 from "../../components/H4";
import { Button } from "react-native-elements";

export default function App() {
  const categories = ["Exempel", "Diverse", "Kategorier", "Använder", "Försökskanin", "Modell", "kekLeo"];
  const subscriptionTypes = ["Eget", "Delat", "Familj"];

  return (
      <View style={tw`px-4 pt-8`}>
        <H4 content="<-- Tillbaka ska den här ens vara här?"></H4>
        <H1 content={"Lägg till abonnemang"}></H1>
        
        <View style={tw`mt-16`}>
          <H2 content="Kategori"></H2>
          <View style={tw`mt-5 flex flex-row flex-wrap`}>
            {categories.map((category) => (
              <Category key={category} name={category} />
              ))}
          </View>
        </View>

        <View style={tw`mt-12`}>
          <H2 content={"Leverantör"}></H2>
          {/* inputbox */}
          <H4 content="Ex. Spotify"></H4>
        </View>

        <View style={tw`grid grid-rows-2 mt-12`}>
          <View style={tw``}>
            <H2 content={"Pris/mån"}></H2>
            {/* inputbox */}
          </View>

          <View style={tw``}>
            <H2 content={"Betaldatum"}></H2>
            {/* inputbox */}
          </View>
        </View>

        <View style={tw`mt-12`}>
          <H2 content={"Abonnemangstyp"}></H2>
          <View style={tw`flex-1 items-center justify-center flex-row`}>
            {subscriptionTypes.map((subscriptionType, index) => (
              <View
                key={subscriptionType}
                style={[
                  tw`flex-1`,
                  index !== subscriptionTypes.length - 1 && tw`mr-4`,
                ]}
              >
                <SubscriptionType name={subscriptionType} />
              </View>
            ))}
          </View>
        </View>

        <View style={tw`mt-12`}>
          <H2 content={"Notering"}></H2>
          {/* inputbox */}
          <H4 content="Ex. Annas mobil"></H4>
        </View>

        <Button disabled></Button>
      </View>
  );
}