import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { registerForPushNotificationsAsync } from "./notificationService";
import * as Notifications from "expo-notifications";
import DrawerNavigator from './components/DrawerNavigator';
import HomeScreen from './screens/HomeScreen';  

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("Received Notification:", notification);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  return (
    <DrawerNavigator />
    
  );
}
