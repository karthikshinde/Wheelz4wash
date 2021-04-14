import React, { Component } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
  TouchableOpacity,
  ProgressBarAndroid,
  ScrollView,
  Image,
} from "react-native";
import * as firebase from "firebase";
import { Text } from "../components";

export default class MyBookings extends Component {
  state = {
    isLoading: true,
    slot:[]
  };


  refresh = async () => {
    let owner = await firebase.auth().currentUser.uid;
    console.log(owner);
    let data = [];
    let calender = new Date();
    let url = `Users/${owner}/MyBookings`;

    //get all booking of current month
    let bookingDetails = await this.getDetails(url);

    console.log("bb",bookingDetails);

    if(bookingDetails !== null && bookingDetails !== undefined) {
      //getting all latest bookings
       Object.keys(bookingDetails).forEach((each)=> {
           if(calender < new Date(Number(bookingDetails[each].Year), (Number(bookingDetails[each].MonthNum)-1), Number(bookingDetails[each].Date))){
             data.push(bookingDetails[each]);
           }
      });

      if(bookingDetails.length > 0) {
        this.setState({bookingsAvailable : true});
      }
    }

    this.setState({ slot: data});
  }

  componentDidMount = async () => {
    await this.refresh();
    this.setState({ isLoading: false });
  };

  getDetails = async (params) => {
    const eventref = firebase.database().ref(params);
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  render() {
    return (
      <View style={styles.container}>
          <View
            style={{
              felx: 1,
              height: 200,
              backgroundColor: "#E74C3C",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 30, alignSelf: "center", color: "white", fontFamily:'m-bold' }}>
              Active Bookings
            </Text>
          </View>
        <ScrollView>

          {/* Lotest Slot Booking */}
          {this.state.isLoading ? (
            <ActivityIndicator
              size="large"
              style={{ marginTop: 20 }}
              color="#e74c3c"
            />
          ) : (
            this.state.slot.length > 0 ?
            this.state.slot.map(each => (
              <View style={styles.eventList} key={each.Date}>

                <TouchableOpacity>
                  <View style={styles.eventBox}>
                    <View style={styles.eventDate}>
                      <Text style={styles.eventDay}>
                        {each.Date}
                      </Text>
                      <Text style={styles.eventMonth}>
                        {each.Month}
                      </Text>
                    </View>
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTime}>{each.Day}</Text>
                      <Text style={styles.eventTime}>
                        <Image
                          style={{ width: 20, height: 20 }}
                          source={{
                            uri:
                              "https://img.icons8.com/color/48/000000/sun.png",
                          }}
                        />
                        {each.timings}
                        </Text>

                      <Text style={styles.eventTime}>
                        For the car: {each.carID}
                      </Text>

                      {/* <View style={{ alignSelf: "center" }}>
                        <TouchableOpacity
                          onPress={() => this.navigateBookingDetails(each)}
                          style={styles.shareButton}
                        >
                          <Text style={styles.shareButtonText}>Book</Text>
                        </TouchableOpacity>
                      </View> */}

                    </View> 
                  </View>
                </TouchableOpacity>
              </View>
            ))
          :            <View style={{justifyContent:"center", alignItems:"center", marginTop:20}}>
                                    <Image
                          style={{ width: 100, height: 100 }}
                          source={{
                            uri:
                              "https://img.icons8.com/cotton/250/000000/taxi-booking-office.png",
                          }}
                        />
                      <Text style={styles.eventDay}>
                       OOPS !
                      </Text>
            <Text style={styles.eventTime}>
                        Sorry ! you don't have any active booking.
                      </Text></View>)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  eventList: {
    marginTop: 20,
    marginBottom: 20,
  },
  eventBox: {
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
  },
  eventDate: {
    flexDirection: "column",
  },
  eventDay: {
    fontSize: 50,
    color: "#0d1864",
    fontFamily:'m-bold'
  },
  eventMonth: {
    fontSize: 16,
    color: "#0d1864",
    fontFamily: 'm-bold'
  },
  eventContent: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "center",
    marginLeft: 10,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    // shadowColor: "#e74c3c",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  description: {
    fontSize: 15,
    color: "#646464",
  },
  eventTime: {
    fontSize: 15,
    color: "#151515",
    alignSelf: "center",
    fontFamily:"m-bold"
  },
  userName: {
    fontSize: 16,
    color: "#151515",
  },
  headerText: {
    color: "#0d1864",
    fontSize: 30,
    alignSelf: "center",
  },
  shareButton: {
    marginTop: 10,
    height: 40,
    width: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#e74c3c",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
});
