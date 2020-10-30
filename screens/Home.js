import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import * as firebase from "firebase";
import { Banner } from 'react-native-paper';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      userName: "",
      userDetails: "",
      userDailyTimings: "",
      userWeeklyTimings: "",
      userCarDetails: "",
      modalVisible: false,
      displaySlotBoard:true, 
      slot:[],
      Owner: firebase.auth().currentUser.uid,
      data: [
        {
          id: 1,
          title: "Profile",
          display: "Profile",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/profile-icon.png"),
          imgUri: "https://img.icons8.com/nolan/256/contract-job.png",
        },
        {
          id: 3,
          title: "CarDetails",
          display: "Car details",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/car-icon.png"),
          imgUri: "https://img.icons8.com/nolan/256//car.png",
        },
        {
          id: 4,
          title: "Notifications",
          display: "Notifications",
          color: "#f0f8ff00",
          members: "*",
          image: require("../assets/images/notificationIcon.png"),
          imgUri: "https://img.icons8.com/nolan/256/push-notifications.png",
        },
        {
          id: 5,
          title: "ContactUs",
          display: "Contact Us",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/contactIcon.png"),
          imgUri: "https://img.icons8.com/nolan/256//phone-disconnected.png",
        },
        {
          id: 6,
          title: "SelectCar",
          display: "Car Insurance",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/insuranceIcon.png"),
          imgUri: "https://img.icons8.com/nolan/256/wallet.png",
        },
        {
          id: 6,
          title: "SelectCar",
          display: "Security",
          color: "#f0f8ff00",
          members: "*",
          image: require("../assets/images/securityIcon.png"),
          imgUri: "https://img.icons8.com/ios-filled/50/000000/name.png",
        },
      ],
      otherToAdd: [
        {
          id: 2,
          title: "SelectCar",
          display: "Book here",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/car-icon.png"),
          imgUri: "https://img.icons8.com/nolan/256//todo-list.png",
        },
        {
          id: 5,
          title: "Notifications",
          display: "Notifications",
          color: "#FF69B4",
          members: "",
          image:
            "https://img.icons8.com/windows/64/000000/topic-push-notification.png",
        },
        {
          id: 6,
          title: "Contact",
          display: "Contact Us",
          color: "#00BFFF",
          members: "",
          image:
            "https://img.icons8.com/wired/80/000000/phone-disconnected.png",
        },
        {
          id: 7,
          title: "Complaint",
          display: "Complaint",
          color: "red",
          members: "We will hear you",
          image: "https://img.icons8.com/ios-filled/64/000000/complaint.png",
        },
        {
          id: 8,
          title: "Website",
          display: "Visit our website",
          color: "#20B2AA",
          members: "",
          image: "https://img.icons8.com/dusk/70/000000/globe-earth.png",
        },
      ],
      preferences: [
        {
          id: 1,
          title: "GAddCar",
          display: "Add car",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/profile-icon.png"),
          imgUri: "https://img.icons8.com/nolan/256/contract-job.png",
        }]
    };
  }

  clickEventListener(item) {
    if (item.title === "Profile") {
      this.props.navigation.navigate(item.title, {
        profileDetails: this.state.userDetails,
      });
    }
    if (item.title === "Progress") {
      this.props.navigation.navigate(item.title, {
        userDailyTimings: this.state.userDailyTimings,
        userWeeklyTimings: this.state.userWeeklyTimings,
      });
    }
    if (item.title === "CarDetails") {
      this.props.navigation.navigate(item.title, {
        userCarDetails: this.state.userData.CarDetails,
        AppartmentID: this.state.userDetails[0].AppartmentID,
        carSubscriptionDetails: this.state.userData.SubsriptionDetails,
      });
    }
    this.props.navigation.navigate(item.title);
  }

  getAvailableSlot = async () => {

    //appartment which he belongs to
    let appartmentID = this.state.userDetails[0].AppartmentID;

    let calender = new Date();
    let url = `AllCommunities/${appartmentID}/Slots/${calender.getFullYear()}/${calender.getMonth() + 1}`;

    //get all slots of current month
    let slotDetails = await this.getDetails(url);

    console.log("s",slotDetails);

    //getting latest booking date
    let bookingDate = Object.keys(slotDetails).reduce((target, next) => {
      return Math.max(Number(target), Number(next));
    });
    console.log("slot", slotDetails[bookingDate]);

    let data = [];
    data.push(
      slotDetails[bookingDate]
    );
    this.setState({ slot: data });

    console.log(this.state.slot);
  }

  getDetails = async (params) => {
    const eventref = firebase.database().ref(params);
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  componentDidMount = async () => {  
    let response = await this.getUserDetails();
    this.setState({ userName: response.UserDetails.Name, userData: response });
    await this.setUserDetails();
    await this.getAvailableSlot();
    console.log("getExpiray", this.getExpiryDate());
  };

  getExpiryDate = async () => {
    let calender = new Date();
    let nextMonthEndDate = new Date(calender.getFullYear(), calender.getMonth() + 2, 0);
    let nextMonth = calender.getMonth() === 11 ? 1 : calender.getMonth() + 2;
    let expiry = new Date(calender.getFullYear() + "-" + nextMonth + "-" + calender.getDate());
    if (expiry > nextMonthEndDate) return nextMonthEndDate;
    return expiry;
  }

  setUserDetails = async() => {
    let userDetails = [];
    console.log(this.state.userData.UserDetails);
    userDetails.push({
      Name: this.state.userData.UserDetails.Name,
      Phone: this.state.userData.UserDetails.Phone,
      Email: this.state.userData.UserDetails.Email,
      AppartmentID: this.state.userData.UserDetails.AppartmentID,
      AppartmentName: this.state.userData.UserDetails.AppartmentName,
      Address: this.state.userData.UserDetails.Address,
      FlatNo: this.state.userData.UserDetails.FlatOrHouseNo,
    });
    console.log(userDetails);
    this.setState({ userDetails });
  };

  handleLogout = () => {
    AsyncStorage.removeItem("ASMtoken");
    this.props.navigation.navigate("UserSignedOut");
  };

  getUserDetails = async () => {
    const eventref = firebase.database().ref("Users/" + this.state.Owner);
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  setModalVisible = async (value) => {
    this.setState({ modalVisible: value });
  };

  render() {
    return (
      <View style={styles.container}>
        <Banner
          visible={this.state.displaySlotBoard}
          actions={[
            {
              label: 'close',
              onPress: () => this.setState({ displaySlotBoard : false}),
            },
            {
              label: 'book',
              onPress: () => this.props.navigation.navigate("CarDetails", {
                userCarDetails: this.state.userData.CarDetails,
                AppartmentID: this.state.userDetails[0].AppartmentID,
                carSubscriptionDetails: this.state.userData.SubsriptionDetails,
              }),
            },
          ]}
          
          icon={({ size }) => (
            <Image
              source={{
                uri: 'https://img.icons8.com/ios-filled/50/000000/hourglass-sand-bottom.png',
              }}
              style={{
                width: size,
                height: size
              }}
            />
          )}>
            {this.state.slot.length >0 ? 
            <> 
              <Text style={{fontFamily:"m-bold", fontSize:20, color:"black"}}>Next available slot is from: {" "}</Text>
            <Text style={{ fontFamily: "m-bold", fontSize: 20, color: "black" }}>{this.state.slot[0].Date}{" "}{this.state.slot[0].Month}{" "}{this.state.slot[0].timings}</Text>
              </>
            : <Text style={{ fontFamily: "m-bold", fontSize: 20, color: "black" }}>Loading...</Text>
          }
          
    </Banner>

        <ScrollView>
          {/* <Text style={styles.subHeading}></Text> */}
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            data={this.state.data}
            horizontal={false}
            numColumns={2}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={[styles.card, { backgroundColor: item.color }]}
                  onPress={() => {
                    this.clickEventListener(item);
                  }}
                >
                  <Image style={styles.cardImage} source={item.image} />
                  <Text style={styles.title}>
                    {item.display}
                    <Text style={{ color: "red" }}>{item.members}</Text>
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
<Text style={{fontFamily:"m-bold", fontSize:25, alignSelf:"center"}}>Prefrences</Text>
          <Text style={{ fontFamily: "m-bold", fontSize: 25, alignSelf: "center", marginTop:-20 }}>________</Text>
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            data={this.state.preferences}
            horizontal={false}
            numColumns={2}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={[styles.card, { backgroundColor: item.color }]}
                  onPress={() => {
                    this.clickEventListener(item);
                  }}
                >
                  <Image style={styles.cardImage} source={item.image} />
                  <Text style={styles.title}>
                    {item.display}
                    <Text style={{ color: "red" }}>{item.members}</Text>
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>

                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.setModalVisible(false);
                  }}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          {/* About us Stsrts here */}
          <View>
            <Text
              style={{
                color: "black",
                fontSize: 25,
                fontFamily:'m-bold',
                alignSelf: "center",
                marginBottom: 10,
              }}
            >
              Our Features
            </Text>
            <Text
              style={{
                color: "#E74C3C",
                fontSize: 45,
                alignSelf: "center",
                marginTop: -55,
              }}
            >
              ______
            </Text>
            <ScrollView horizontal={true}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginLeft: 10,
                  marginRight: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 12,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 16.0,

                  elevation: 24,
                }}
              >
                <View
                  style={{
                    width: 300,
                    height: 200,
                    borderColor: "black",
                    backgroundColor: "#E74C3C",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.0,

                    elevation: 24,
                  }}
                >
                  <View style={{ flex: 1, marginTop: 20 }}>
                    <Text style={styles.headerText4}>24/7 HELPLINE</Text>
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                      source={{
                        uri: "https://img.icons8.com/nolan/256/time.png",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      width: 250,
                      height: 200,
                      alignSelf: "center",
                      marginBottom: 10,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text style={styles.headerText2}>
                      We provide our helpline available 24/7 all the time
                      provide our helpline available 24/7{" "}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "#E74C3C",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <View
                  style={{
                    width: 300,
                    height: 200,
                    borderColor: "black",
                    backgroundColor: "#E74C3C",
                    borderRadius: 10,
                  }}
                >
                  <View style={{ flex: 1, marginTop: 20 }}>
                    <Text style={styles.headerText4}>Door step Service</Text>
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                      source={{
                        uri: "https://img.icons8.com/nolan/256/exit-sign.png",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      width: 250,
                      height: 200,
                      alignSelf: "center",
                      marginBottom: 10,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text style={styles.headerText2}>
                      We provide our helpline available 24/7 all the time
                      provide our helpline available 24/7{" "}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "#E74C3C",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <View
                  style={{
                    width: 300,
                    height: 200,
                    borderColor: "black",
                    backgroundColor: "#E74C3C",
                    borderRadius: 10,
                  }}
                >
                  <Text style={styles.headerText4}>You Are Our</Text>
                  <Image
                    style={{ width: 100, height: 100, alignSelf: "center" }}
                    source={{
                      uri:
                        "https://img.icons8.com/nolan/64/bank-card-back-side.png",
                    }}
                  />
                  <Text style={styles.headerText2}>*PREMIUM MEMBER</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const resizeMode = "cover";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor: "white",
    marginTop: 5,
  },
  listContainer: {
    alignItems: "center",
  },
  /******** card **************/
  card: {
    marginHorizontal: -10,
    marginVertical: 10,
    flexBasis: "48%",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 60,
    width: 60,
    alignSelf: "center",
  },
  title: {
    fontSize: 15,
    flex: 1,
    color: "black",
    alignSelf: "center",
    fontFamily:'m-bold'
  },
  subTitle: {
    fontSize: 12,
    flex: 1,
    color: "black",
    marginLeft: 25,
  },
  icon: {
    height: 20,
    width: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 30,

    marginTop: 40,
    alignSelf: "center",
  },
  headerText2: {
    color: "white",
    fontSize: 13,
    fontFamily:'m-light',
    alignSelf: "center",
  },
  subHeading: {
    color: "black",
    fontSize: 15,

    alignSelf: "center",
  },
  headerText4: {
    color: "white",
    fontSize: 20,
    fontFamily:'m-bold',

    alignSelf: "center",
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: 300,
    height: 400,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  bgImage: {
    flex: 1,
    resizeMode,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
});
