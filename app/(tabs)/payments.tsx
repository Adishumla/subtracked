import { View, StyleSheet, Text, ScrollView } from "react-native";
import {Link} from 'expo-router';
import supabase from "../../lib/supabaseStore";
import tw from "twrnc";
import H1 from "../../components/H1";
import H4 from "../../components/H4";
import SubCard from "../../components/SubCard";
import { Button } from "react-native-elements";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { subtle } from "crypto";


export default function App() {

  // AsyncStorage.getItem('id').then((id) => {
  //   if(!id){
  //     console.error('User not found.');
  //     return;
  //   }


  //   const subscriptions = supabase
  //   .channel('custom-all-channel')
  //   .on(
  //     'postgres_changes',
  //     { event: '*', schema: 'public', table: 'subscriptions' },
  //     (payload) => {
  //       //@ts-ignore
  //       if(payload.new && payload.new.id === id){
  //         console.log('Change recieved for the logged-in user.')
  //       }
  //       console.log('Change received!', payload)
  //     }
  //   )
  //   .subscribe();
  //   console.log(subscriptions);
  // });

  useEffect(() => {

    AsyncStorage.getItem('id').then((id) => {
      if (!id) {
        console.error('User not found.');
        return;
      }
      
      // Fetch data from the "subscriptions" table
      const fetchData = async () => {
        try {
          const { data: subscriptions, error } = await supabase
          .from('subscriptions') // Replace 'subscriptions' with your actual table name
          .select('*') // You can specify the columns you want to retrieve here, or use '*' to fetch all columns
          .eq('user_id', id); // Adjust the condition as needed
          if (error) {
            console.error('Error fetching data:', error.message);
          } else {
            console.log('Fetched data:', subscriptions);
            // Process the fetched data here
          }
        } catch (error) {
          //@ts-ignore
          console.error('An error occurred:', error.message);
        }
      };
      
      fetchData(); // Call the fetchData function to execute the query
    });
  }, []);




    
  return (
    <ScrollView style={tw`px-4 pt-8`}>
      <View>
        <H4 content="< Tillbaka" />
        <H1 content={"Kommande betalningar"} />
      </View>
      {subscriptions.map((subscription) => (
            <SubCard
            key={subscription.id}
            productName={subscription.provider}
            icon="Bild"
            price={subscription.cost}
            subType={subscription.plan}
            subId={subscription.id}
            subStatus="STATUS"
            />
          ))}
      <View>
        
      </View>
    </ScrollView>
  );
}
