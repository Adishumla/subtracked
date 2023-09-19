import "react-native-url-polyfill/auto";
import tw from "twrnc";
import SubscriptionType from "../../components/SubscriptionType";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H3 from "../../components/H3";
import { useState, useEffect } from "react";
import supabase from "../../lib/supabaseStore";
import Auth from "../../components/Auth/EmailAuth";
import { View, Text, Button, ScrollView } from "react-native";
import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SubCard from "../../components/SubCard";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState<String | undefined>("");
  const [id, setId] = useState<String | undefined>("");

  // Handle login+session states to fetch user id.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setEmail(session?.user.email);
      // console.log(session);

      // @ts-ignore
      const { data, error } = supabase
        .from("login")
        .insert([{ email: email, Users: session?.user.id }])
        .select();
      // console.log(error);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const [name, setName] = useState<String | undefined>("");
  // Fetch the correct username to print it in the header below.
  useEffect(() => {

    AsyncStorage.getItem('id').then((id) => {
      if (!id) {
        console.error('User not found.');
        return;
      }

      const fetchData = async () => {
        try {
          const { data: login, error } = await supabase
          .from('login')
          .select('*')
          .eq('id', id);
          if (error) {
            console.error('Error fetching data:', error.message);
          } else {
            // console.log('Fetched data:', login);

            setName(login[0].name);
          }
        } catch (error) {
          //@ts-ignore
          console.error('An error occurred:', error.message);
        }
      };
      fetchData(); // Call the fetchData function to execute the query
    });
  }, []);

  //Handle fetch of the logged in users subscriptions to map the
  //data into components below.
  // Also group the subscriptions by category type.
  const [subscriptions, setSubscriptions] = useState<any>([]);
  const [groupedSubscriptions, setGroupedSubscriptions] = useState<any>({});
    useEffect(() => {

    AsyncStorage.getItem('id').then((id) => {
      if (!id) {
        console.error('User not found.');
        return;
      }
      
      // Fetch data from the "subscriptions" table where user uuid is logged in.
      const fetchData = async () => {
        try {
          const { data: subscriptions, error } = await supabase
          .from('subscriptions')
          .select('*') 
          .eq('user_id', id);
          if (error) {
            console.error('Error fetching data:', error.message);
          } else {
            setSubscriptions(subscriptions);
            // Push category into array to make it sortable.
            const groupedData = subscriptions.reduce((groups: any, subscription: any) => {
            const category = subscription.category;
            if (!groups[category]) {
              groups[category] = [];
            }
            groups[category].push(subscription);
            return groups;
          }, {});
          setGroupedSubscriptions(groupedData);
          }
        } catch (error) {
          //@ts-ignore
          console.error('An error occurred:', error.message);
        }
      };
      
      fetchData();
    });
  }, []);

  //Fetch the logged in users total cost by selecting and adding together 
  // each entry from login.cost that matches the id.
  const [total, setTotal] = useState<any>([]);
  useEffect(() => {

    AsyncStorage.getItem('id').then((id) => {
      if (!id) {
        console.error('User not found.');
        return;
      }
      
      // Fetch data from the "subscriptions" table where user uuid is logged in.
      const fetchData = async () => {
        try {
          let { data, error } = await supabase
          .from('subscriptions')
          .select('cost')
          .eq('user_id', id);
          if (error) {
            console.error('Error fetching data:', error.message);
          } else {
            const sum = data?.reduce((total, data) => total+data.cost,0)
            setTotal(sum);
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
        <H1 content={"Hej " + name + "!"} />
        <View style={tw`mt-4`}>
          <H2 content={"Din månadskostnad är " + total + "kr / mån"} />
        </View>
        {Object.keys(groupedSubscriptions).map((category: string) => (
          <View key={category}>
            <H3 content={category} />
            {groupedSubscriptions[category].map((subscription: any) => (
              <SubCard
                key={subscription.id}
                productName={subscription.provider}
                icon="Bild"
                price={subscription.cost + "kr"}
                subType={subscription.plan}
                subId={subscription.id}
                subStatus="STATUS"
              />
            ))}
          </View>
        ))}
      </ScrollView>
    );
};
