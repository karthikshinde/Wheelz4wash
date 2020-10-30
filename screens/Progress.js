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

export default class Progress extends Component {
  state = {
    carID: "",
    appartmentID: "",
    limit: 0,
    carWashesdone: 0,
    isLoading: true,
    slot:[]
  };

  navigateBookingDetails = async()=>{
    let thisYear = new Date().getFullYear();
    this.props.navigation.navigate("Book", {
      appartmentID: this.state.appartmentID,
      Date: this.state.slot[0].Date,
      Year: thisYear,
      Month: this.state.slot[0].Month,
      MonthNum: this.state.slot[0].MonthNum,
      carID: this.state.carID,
      carWashesdone: this.state.carWashesdone,
      Day: this.state.slot[0].Day,
      Timings: this.state.slot[0].timings,
      limit: this.state.slot[0].limit,
    });
  }

  refresh = async () => {
    // get Car ID for booking
    let carID = this.props.route.params.carID;
    let carWashesdone = this.props.route.params.carWashesdone

    //get all car Details
    let carDetails = await this.getCarDetails(carID);

    //appartment which he belongs to
    let appartmentID = carDetails.Appartment;

    this.setState({appartmentID});
    this.setState({ carID });
    this.setState({ carWashesdone});

    let calender = new Date();
    let url = `AllCommunities/${appartmentID}/Slots/${calender.getFullYear()}/${calender.getMonth() + 1}`;

    //get all slots of current month
    let slotDetails = await this.getDetails(url);

    //getting latest booking date
    let bookingDate = Object.keys(slotDetails).reduce((target,next)=>{
        return Math.max(Number(target),Number(next));
    });
    console.log("slot", slotDetails[bookingDate]);

    let data = [];
    data.push(
      slotDetails[bookingDate]
      );
    this.setState({ slot: data});

   // this.setState({ isLoading: false });
  }

  componentDidMount = async () => {
    await this.refresh();
    this.setState({ isLoading: false });
  };

  getMonth = (i) => {
    let month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[i];
  };

  getCarDetails = async (carNumber) => {
    return this.getDetails("AllCars/" + carNumber);
  };

  getAppartmentDetails = async (appartmentID) => {
    return this.getDetails("AllCommunities/" + appartmentID);
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
        <ScrollView>
          <View
            style={{
              felx: 1,
              height: 250,
              backgroundColor: "#E74C3C",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 30, alignSelf: "center", color: "white", fontFamily:'m-bold' }}>
              PICK YOUR SLOT
            </Text>
          </View>

          {/* Lotest Slot Booking */}
          {this.state.isLoading ? (
            <ActivityIndicator
              size="large"
              style={{ marginTop: 20 }}
              color="#e74c3c"
            />
          ) : (
            this.state.slot.map(each => (
              <View style={styles.eventList} key={each.Date}>
                <TouchableOpacity
                  onPress={() => this.navigateBookingDetails()}
                >
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
                        Remaining slots {each.limit}
                      </Text>

                      <View style={{ alignSelf: "center" }}>
                        <TouchableOpacity
                          onPress={() => this.navigateBookingDetails()}
                          style={styles.shareButton}
                        >
                          <Text style={styles.shareButtonText}>Book</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
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
