import "react-native-url-polyfill/auto";
import tw from "../../lib/tailwind";
import SubscriptionType from "../../components/SubscriptionType";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H3 from "../../components/H3";
import { useState, useEffect, useRef } from "react";
import supabase from "../../lib/supabaseStore";
import Auth from "../../components/Auth/EmailAuth";
import {
  View,
  Text,
  Button,
  ScrollView,
  useColorScheme,
  Appearance,
  Animated,
  Dimensions,
  PanResponder,
  Easing,
  ImageBackground,
} from "react-native";

import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SubCard from "../../components/SubCard";
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "../../lib/notificationService";

export default function App() {
  let colorScheme = useColorScheme();
  if (colorScheme === "dark") {
    tw`bg-black`;
  } else {
    tw`bg-white`;
  }
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState<String | undefined>("");
  const [id, setId] = useState<String | undefined>("");

  // Handle login+session states to fetch user id.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setEmail(session?.user.email);

      supabase
        .from("login")
        .insert([{ email: email, Users: session?.user.id }])
        .select();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const [name, setName] = useState<String | undefined>("");
  // Fetch the correct username to print it in the header below.
  useEffect(() => {
    AsyncStorage.getItem("id").then((id) => {
      if (!id) {
        console.error("User not found.");
        return;
      }

      const fetchData = async () => {
        try {
          const { data: login, error } = await supabase
            .from("login")
            .select("*")
            .eq("id", id);
          if (error) {
            console.error("Error fetching data:", error.message);
          } else {
            setName(login[0].name);
          }
        } catch (error) {
          console.error("An error occurred:", (error as Error).message);
        }
        const nameChanger = supabase
          .channel("custom-all-channel")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "login",
              filter: `id=eq.${id}`,
            },
            (payload) => {
              fetchData();

              console.log("Change received!", payload);
            }
          )
          .subscribe();
      };
      fetchData();
    });
  }, []);

  const [total, setTotal] = useState<any>([]);
  useEffect(() => {
    AsyncStorage.getItem("id").then((id) => {
      if (!id) {
        console.error("User not found.");

        return;
      }

      const fetchData = async () => {
        try {
          let { data, error } = await supabase
            .from("subscriptions")
            .select("cost")
            .eq("user_id", id);
          if (error) {
            console.error("Error fetching data:", error.message);
          } else {
            const sum = data?.reduce((total, data) => total + data.cost, 0);
            setTotal(sum);
          }
        } catch (error) {
          console.error("An error occurred:", (error as Error).message);
        }
      };
      fetchData();
    });
  }, []);

  const [subscriptions, setSubscriptions] = useState<any>([]);
  const [groupedSubscriptions, setGroupedSubscriptions] = useState<any>({});
  const subscriptionTypes = ["Alla", "Eget", "Delat", "Familj"];
  const [selectedSubscriptionType, setSelectedSubscriptionType] =
    useState<string>("Alla");

  useEffect(() => {
    AsyncStorage.getItem("id").then((id) => {
      if (!id) {
        console.error("User not found.");
        return;
      }

      // Fetch data from the "subscriptions" table where user uuid is logged in.
      const fetchData = async () => {
        try {
          const { data: subscriptions, error } = await supabase
            .from("subscriptions")
            .select("*, icons (url)")
            .eq("user_id", id);
          if (error) {
            console.error("Error fetching data:", error.message);
          } else {
            // Combine subscription data with image URLs
            const subscriptionsWithImages = subscriptions.map(
              (subscription, index) => ({
                ...subscription,
              })
            );

            let filteredSubscriptions =
              selectedSubscriptionType === "Alla"
                ? subscriptionsWithImages
                : subscriptionsWithImages.filter(
                    (subscription) =>
                      subscription.plan === selectedSubscriptionType
                  );

            setSubscriptions(filteredSubscriptions);

            // Push category into array to make it sortable.
            let groupedData = filteredSubscriptions.reduce(
              (groups: any, subscription: any) => {
                const category = subscription.category;
                if (!groups[category]) {
                  groups[category] = [];
                }
                groups[category].push(subscription);
                return groups;
              },
              {}
            );
            setGroupedSubscriptions(groupedData);
          }
        } catch (error) {
          console.error("An error occurred:", (error as Error).message);
        }

        const subscriptionsSub = supabase
          .channel("custom-all-channel")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "subscriptions",
            },
            (payload) => {
              fetchData();

              console.log("Change received!", payload);
            }
          )
          .subscribe();
      };

      fetchData(); // Call the fetchData function to execute the query
    });
  }, [selectedSubscriptionType]);

  const ballPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const moveBall = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ballPosition.x, {
            toValue: Dimensions.get("window").width - 90,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(ballPosition.y, {
            toValue: Dimensions.get("window").height - 50,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ballPosition.x, {
            toValue: 0,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(ballPosition.y, {
            toValue: 0,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();
  };

  useEffect(() => {
    moveBall();
  }, []);

  return (
    <View
      style={tw`
    `}
    >
      <Animated.View
        style={[
          tw`absolute bg-indigo-500 rounded-full w-40 h-40 blur-xl opacity-50 
            `,
          {
            left: ballPosition.x,
            top: ballPosition.y,
            filter: "blur(100px)",
          },
        ]}
      />
      <ScrollView
        style={tw`w-full px-4 pt-8 font-family: Inter bg-opacity-50 backdrop-blur-xl rounded drop-shadow-lg
    ${colorScheme === "dark" ? "bg-black" : "bg-white"}`}
      >
        <H1 content={"Hej " + name + "!"} />
        <View style={tw`mt-4 mb-20`}>
          <H2 content={"Din månadskostnad är " + total + "kr / mån"} />
        </View>

        <View style={tw`flex flex-row justify-between`}>
          {subscriptionTypes.map((subscriptionType, index) => (
            <View
              key={subscriptionType}
              style={[tw``, index !== subscriptionTypes.length - 1 && tw``]}
            >
              <SubscriptionType
                name={subscriptionType}
                onPress={() => {
                  setSelectedSubscriptionType(subscriptionType);
                }}
                selected={selectedSubscriptionType === subscriptionType}
              />
            </View>
          ))}
        </View>

        {Object.keys(groupedSubscriptions).map((category: string) => (
          <View style={tw`mt-8`} key={category}>
            <H2 content={category} />

            {subscriptions
              .filter((subscription: any) => subscription.category === category)
              .map((subscription: any) => (
                <SubCard
                  key={subscription.id}
                  productName={subscription.provider}
                  productIcon={subscription.icons.url}
                  price={subscription.cost + "kr"}
                  subType={subscription.plan}
                  subId={subscription.id}
                  subStatus={subscription.draw_unsuccessful}
                  priceIncrease={subscription.price_increase}
                />
              ))}
          </View>
        ))}
        <View style={tw`mb-20`}>
          <Button
            title="Send notification now"
            onPress={async () => {
              await schedulePushNotification();
            }}
          />
          <Button
            title="Dark mode"
            onPress={() => {
              //change color scheme
              Appearance.setColorScheme(
                colorScheme === "dark" ? "light" : "dark"
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
