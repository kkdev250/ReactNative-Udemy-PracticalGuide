import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Button, View, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({ //configuring notifications when app is foreground
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
})

export default function App() {
  useEffect(() => { //asking for permissions - only for ios!
    const permissionsHandler = async () => {
      let permissions = await Notifications.getPermissionsAsync();
      if (!permissions.granted) {
        await Notifications.requestPermissionsAsync();
      }
      permissions = await Notifications.getPermissionsAsync();
      if (!permissions.granted) {
        Alert.alert('Error', 'Notification permissions should be allowed', [{text: 'Okay'}]);
        return;
      }
    }

    permissionsHandler();
  }, []);

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      response => { //handle clicked notification
        console.log(response);
      }
    );

    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      notification => { //handle foreground notification
        console.log(notification);
      }
    );

    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({ //create a local notification
      content: {
        title: 'My first local notification',
        body: 'This is the first local notification we are sending!',
        data: { mySpecialData: 'Some text'}
      },
      trigger: {
        seconds: 10,
      }
    }); 
  };

  return (
    <View style={styles.container}>
      <Button
        title="Trigger Notification" //remember to hide the app to background to see the notification!
        onPress={triggerNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
