import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Vibration,
  Platform,
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as firebase from "firebase";

export default class Book extends Component {
  state = {
    Owner: firebase.auth().currentUser.uid,
    appartmentID: "",
    Date: "",
    Year: "",
    Month: "",
    carID: "",
    carWashesdone: "",
    Day: "",
    Timings: "",
    expoPushToken: "",
    notification: {},
    canBook: false
  };

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  _handleNotification = (notification) => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });
  };

  componentDidMount= async() =>{
    const appartmentID = this.props.route.params.appartmentID;
    const Date = this.props.route.params.Date;
    const Year = this.props.route.params.Year;
    const Month = this.props.route.params.Month;
    const carWashesdone = this.props.route.params.carWashesdone;
    const Day = this.props.route.params.Day;
    const Timings = this.props.route.params.Timings;
    const carID = this.props.route.params.carID;
    const limit = this.props.route.params.limit;
    const MonthNum = this.props.route.params.MonthNum;

    await this.setState({ appartmentID });
    await this.setState({ Date });
    await this.setState({ Year });
    await this.setState({ Month });
    await this.setState({ MonthNum });
    await this.setState({ carID });
    await this.setState({ carWashesdone });
    await this.setState({ Day });
    await this.setState({ Timings });
    await this.setState({ limit });

    let url = "AllCommunities/" +this.state.appartmentID +"/FullWash/" +this.state.Year +"/" +this.state.MonthNum + "/" +this.state.Date+"/Customers/"+carID;
    console.log(url);
    let result = await this.getDetails(url);
    console.log(result);
    if(result === null || result === undefined) {
      this.setState({canBook : true});
    }

    this.registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
    this.sendPushNotification();
  }

  sendPushNotification = async () => {
    const message = {
      to: this.state.expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { data: "goes here" },
      _displayInForeground: true,
    };
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };


  handleBooking = async () => {
      await this.updateBookingDetailsInCommunity();
      await this.updateInSubScriptions();
      await this.updatelimitFOrTheDay();
      await this.updateUserBookings();
      this.props.navigation.navigate("Booked", {
        title: "Booking Successfull",
        description: "We will notify you a day before your booking date",
      });
  };

  updateUserBookings = async()=> {
    let calender = new Date();
    let year = calender.getFullYear();
     firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/MyBookings/"+ calender
      )
      .update({
         Date: this.state.Date,
         Day:  this.state.Day,
         Month:  this.state.Month,
         MonthNum:  this.state.MonthNum,
         timings: this.state.Timings,
         Year:year,
         carID: this.state.carID.toUpperCase()
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  updatelimitFOrTheDay= async () => {
    let newlimit = this.state.limit-1;
    firebase
      .database()
      .ref(
        "AllCommunities/" +
        this.state.appartmentID +
        "/Slots/" +
        this.state.Year +
        "/" +
        this.state.MonthNum +
        "/" +
        this.state.Date 
      )
      .update({
        limit :newlimit,
      })
      .then(() => { })
      .catch((error) => {
        console.log(error);
      });
  };

  updateBookingDetailsInCommunity = async () => {
    let carID = this.state.carID;
    firebase
      .database()
      .ref(
        "AllCommunities/" +
          this.state.appartmentID +
          "/FullWash/" +
          this.state.Year +
          "/" +
          this.state.MonthNum +
          "/" +
          this.state.Date +
          "/Customers/" +
          this.state.carID
      )
      .update({
        carID,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

    getDetails = async (url) => {
    const eventref = firebase.database().ref(url);
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  updateInSubScriptions = async () => {
    let count = this.state.carWashesdone + 1;
    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/SubsriptionDetails/" +
          this.state.carID
      )
      .update({
        CarWashDone: count,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <ScrollView style={{ backgroundColor: "white" }}>
        <View style={styles.container}>
          {this.state.canBook ? 
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>Interior & Exterior wash</Text>

            <Text style={styles.postDescription}>
              Our Wheelz4wash worker will be arriving in the following time gap for the keys. Please
              kindly make yourselves available at that time.
            </Text>
            <Text style={styles.name}>Note</Text>
            <Text style={styles.postDescription}>
              *Cancellation of booking can't be done in app. You need to call customer service for cancellation.
            </Text>
            <Text style={styles.postDescription}>
              *Please take care of your belongings before giving keys to our executive, as we are not responsible for any loss.
            </Text>
            <Text style={styles.postDescription}>
              *Please immediately raise an issue by calling customer service, If you feel any immproper service by the worker.
              This will make us to improve our service. 
            </Text>
            <Text style={styles.name}>{this.state.Day}</Text>
            <Text style={styles.name}>
              {this.state.Date}th {this.state.Month}, {this.state.Year}
            </Text>
            <Text style={styles.name}>{this.state.Timings}</Text>

            <View>
              <TouchableOpacity
                onPress={() => this.handleBooking()}
                style={styles.shareButton}
              >
                <Text style={styles.tags}>Book</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Progress")}
                style={{ alignItems: "center", marginTop: 10 }}
              >
                <Text style={styles.tags}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View> : 
          <View style={{justifyContent:"center", alignSelf:"center", marginTop:200}}>
            <Text style={{fontFamily:"m-bold", color: "#e74c3c",fontSize:50, alignSelf:"center"}}>Relax !!</Text>
             <Text style={{fontFamily:"m-bold", fontSize:20, alignSelf:"center"}}>We have already received your </Text>
              <Text style={{fontFamily:"m-bold", fontSize:20, alignSelf:"center"}}>booking details for this slot.</Text>
               <Text style={{fontFamily:"m-bold", fontSize:20, alignSelf:"center"}}>To cancel the booking,</Text>
                <Text style={{fontFamily:"m-bold", fontSize:20, alignSelf:"center"}}>Please contact customer care.</Text>
                <Image
                style={{ width: 300, height: 300 , alignSelf:"center"}}
                source={{ uri: "https://img.icons8.com/color/256/000000/task-completed.png" }}
              />
 
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Progress")}
                style={{ alignItems: "center", marginTop: 10 }}
              >
                <Text style={styles.tags}>Go back</Text>
              </TouchableOpacity>
            </View>}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#170051",
  },
  headerTitle: {
    fontSize: 30,
    color: "black",
    marginTop: 10,
    fontFamily:"m-bold"
  },
  postContent: {
    flex: 1,
    padding: 30,
    marginTop: 20,
  },
  postTitle: {
    fontSize: 26,
    color: "black",
    fontFamily: "m-bold"
  },
  postDescription: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    color: "black",
    fontFamily:"m-bold"
  },
  tags: {
    color: "black",
    fontFamily:"m-bold",
    alignSelf:"center",
    fontSize:20,
    paddingTop:10
  },
  date: {
    color: "#696969",
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#00BFFF",
  },
  profile: {
    flexDirection: "row",
    marginTop: 20,
  },
  name: {
    fontSize: 22,
    color: "#e74c3c",
    fontFamily:"m-bold"
  },
  shareButton: {
    marginTop: 10,
    height: 50,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "white",
    borderWidth:3,
    borderColor:"#e74c3c",
    alignSelf:"center"
  },
  shareButtonText: {
    color: "#e74c3c",
    fontSize: 15,
  },
});
