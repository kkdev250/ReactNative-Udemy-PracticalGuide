import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
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
  const [pushToken, setPushToken] = useState();

  useEffect(() => { 
    const permissionsHandler = async () => {
      try {
        let permissions = await Notifications.getPermissionsAsync(); //asking for permissions - important only for ios!
        if (!permissions.granted) {                                  //...for Android is always granted
          await Notifications.requestPermissionsAsync();
        }
        permissions = await Notifications.getPermissionsAsync();
        if (!permissions.granted) {
          Alert.alert('Error', 'Notification permissions should be allowed', [{text: 'Okay'}]);
          throw new Error('Permission not granted!');
        }
        console.log('Getting token') //get push notification token (for this device) from Expo... 
        const response = await Notifications.getExpoPushTokenAsync();
        console.log(response)
        const token = response.data;
        setPushToken(token);
        //fetch('https://your-own-api.com'...) each app could send its token to the backend to create a all tokens database for sending notifications
      } catch(err) {
        console.log(err);
        return null;
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

  const triggerLocalNotificationHandler = () => {
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

  const triggerPushNotificationHandler = () => {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: pushToken,
        data: {extraData: 'Some data'},
        title: 'Sent via the app',
        body: 'This push notification was sent via the app!'
      }),
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Trigger Local Notification" //remember to hide the app to background to see the notification!
        onPress={triggerLocalNotificationHandler}
      />
      <Button
        title="Trigger Push Notification"
        onPress={triggerPushNotificationHandler}
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
    justifyContent: 'space-evenly',
  },
});
