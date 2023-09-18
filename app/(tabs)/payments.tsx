import { View, StyleSheet, Text, ScrollView } from "react-native";
import {Link} from 'expo-router';
import supabase from "../../lib/supabaseStore";
import tw from "twrnc";
import H1 from "../../components/H1";
import H3 from "../../components/H3";
import H4 from "../../components/H4";
import SubCard from "../../components/SubCard";
import { Button } from "react-native-elements";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { subtle } from "crypto";


export default function App() {

  const [subscriptions, setSubscriptions] = useState<any>([]);
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

            setSubscriptions(subscriptions);
          }
        } catch (error) {
          //@ts-ignore
          console.error('An error occurred:', error.message);
        }
      };
      
      fetchData(); // Call the fetchData function to execute the query
    });
  }, []);

  const groupedSubscriptions = subscriptions.reduce((data:any, subscription:any) => {
    const billDate = new Date(subscription.bill_date);
    const month = billDate.toLocaleString('sv-SE', { month: 'long' });
    const year = billDate.getFullYear();
    const day = billDate.getDate();
    const key = `${year}-${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}`;
    if (!data[key]) {
      data[key] = {
        label: billDate.toLocaleString('sv-SE', { month: 'long', year: 'numeric', day:'numeric' }),
        subscriptions: [],
      };
    }
    data[key].subscriptions.push(subscription);
    return data;
  }, {});

  const sortedGroupedSubscriptions = Object.keys(groupedSubscriptions)
  .sort()
  .reduce((sortedData:any, key) => {
    sortedData[key] = groupedSubscriptions[key];
    return sortedData;
  }, {});
  let currentMonth = '';


    
  return (
    <ScrollView style={tw`px-4 pt-8`}>
      <View>
        <H4 content="< Tillbaka" />
        <H1 content={"Kommande betalningar"} />
      </View>
      <View>

{Object.keys(sortedGroupedSubscriptions).map((data) => {
  const monthLabel = data.slice(8, 9).toUpperCase() + data.slice(9);
  
  if (monthLabel !== currentMonth) {
    currentMonth = monthLabel;
    return (
      <View key={data}>
        <H3 content={monthLabel} />
        {sortedGroupedSubscriptions[data].subscriptions.map((subscription:any) => (
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
      </View>
    );
  } else {
    return (
      <View key={data}>
        {sortedGroupedSubscriptions[data].subscriptions.map((subscription:any) => (
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
      </View>
    );
  }
})}
      </View>

    </ScrollView>
  );
}
