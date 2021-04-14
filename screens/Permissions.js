import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import * as firebase from "firebase";

class MyPermissions {

    static registerForPushNotificationsAsync = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Please allow to send latest updated via push notifications!');
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await this.saveExpoToken(token);
        return token;
      } else {
        alert('Must use physical device for Push Notifications');
      }
      };

    static saveExpoToken = async(token)=>{
        let owner = await firebase.auth().currentUser.uid;
        let uri = `ExpoDetails/${owner}`
        await this.pushExpoDetails(uri, token);
      }

    static getDetails = async (param) => {
        const eventref = firebase.database().ref(param);
        const snapshot = await eventref.once("value");
        const value = snapshot.val();
        return value;
   };

    static pushExpoDetails = async (uri, token) => {
    firebase
      .database()
      .ref(
        uri
      )
      .update({
        expoToken: token,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

 static sendPushNotification = async(expoPushToken)=> {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
    }
}

export default MyPermissions;