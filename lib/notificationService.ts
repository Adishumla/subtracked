// notificationService.js

import * as Notifications from "expo-notifications";
import { Platform } from "react-native"; // Import Platform here if it's not already imported
import * as Device from "expo-device";
import supabase from "./supabaseStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "fdb7f1b0-741c-4e34-9f35-6f58032d840f",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use a physical device for Push Notifications");
  }

  return token;
}

export async function schedulePushNotification() {
  const userId = await AsyncStorage.getItem("id");
  if (!userId) {
    console.log("User ID not found");
    return;
  }

  const currentDate = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(currentDate.getDate() + 3);

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .lte("bill_date", threeDaysFromNow.toISOString())
    .gte("bill_date", currentDate.toISOString());

  if (error) {
    console.log(error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No subscription found");
    return;
  }

  console.log(data);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${data[0].provider} is about to renew!`,
      body: `In 3 days, your ${data[0].provider} subscription will renew.`,
      data: { data: "goes here" },
    },
    trigger: { seconds: 1 },
    identifier: "Hej",
  });
}

export function addNotificationReceivedListener(
  callback: (event: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
  callback: (event: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
