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
import { Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

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
      packs:[],
      Owner: firebase.auth().currentUser.uid,
      slotAvailable: false,
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
          display: "Your Vehicle",
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
          title: "GAddCar",
          display: "Add Vehicle",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/colored-plus-480.png"),
          imgUri: "https://img.icons8.com/nolan/256/contract-job.png",
        },
          {
          id: 7,
          title: "MyBookings",
          display: "My Bookings",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/myBookings.png"),
          imgUri: "https://img.icons8.com/nolan/256/contract-job.png",
        }

      ],
      otherToAdd: [
        {
          id: 2,
          title: "SelectCar",
          display: "Book Here",
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
          {
          id: 8,
          title: "MapViews",
          display: "Spot Wash",
          color: "#f0f8ff00",
          members: "*",
          image: require("../assets/images/spotWash.png"),
          imgUri: "https://img.icons8.com/ios-filled/50/000000/name.png",
        },
      ],
      preferences: [
        {
          id: 1,
          title: "VehicleDetails",
          display: "Car Insurance",
          color: "#f0f8ff00",
          members: "",
          image: require("../assets/images/insuranceIcon.png"),
          imgUri: "https://img.icons8.com/nolan/256/wallet.png",
        },
        {
          id: 2,
          title: "SelectCar",
          display: "Apartment Security",
          color: "#f0f8ff00",
          members: "*",
          image: require("../assets/images/securityIcon.png"),
          imgUri: "https://img.icons8.com/ios-filled/50/000000/name.png",
        },
      ]
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
    // get Car ID for booking
    let data = [];
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
    let url = `AllCommunities/${appartmentID}/Slots/${calender.getFullYear()}/${(calender.getMonth() + 1)}`;

    //get all slots of current month
    let slotDetails = await this.getDetails(url);

    if(slotDetails !== null && slotDetails !== undefined) {
      //getting latest booking date
      let bookingDate = Object.keys(slotDetails).reduce((target,next)=>{
          return Math.max(Number(target),Number(next));
      });

      if(calender.getDate() < Number(bookingDate) ) {
        data.push(slotDetails[bookingDate]);
        this.setState({slotAvailable : true});
      }
    }

    this.setState({ slot: data});
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
    await this.fetchPackDetails();
    //await this.getAvailableSlot();
  };

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

  fetchPackDetails = async() => {
    let packs = [];
    const response = await this.getPackages();
    Object.keys(response).forEach((each) => {
      packs.push(response[each]);
    });
    this.setState({ packs });
  };

  getPackages = async () => {
    const eventref = firebase.database().ref("PackageDetails/");
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  render() {
    return (
      <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#fff','#fff','#fff','#fff', '#fff', '#fff']}
        style={styles.background}
      >
      {/* <Searchbar
      placeholder="Search"
      //onChangeText={onChangeSearch}
      value=""
      /> */}

        <ScrollView>
          {/* <Text style={styles.subHeading}></Text> */}
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            data={this.state.data}
            horizontal={false}
            numColumns={3}
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

            {/* <Text
              style={{
                color: "black",
                fontSize: 25,
                fontFamily:'m-bold',
                alignSelf: "center",
                marginBottom: 10,
              }}
            >
              Hot Deals
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
            </Text> */}
            <View
                style={{
                  flex: 1,
                  backgroundColor: "#e7bb22",
                  margin:5
                }}
              >
                  <TouchableOpacity onPress={()=> this.clickEventListener({title:"MapViews"})}>
                  <View style={{ flex: 1 , alignSelf:"center" }}>
                      <Image  
                        style={{
                          width:300,
                          height: 240,
                        }}
                        source={require("../assets/images/spotWash.gif")}
                      />
                      <TouchableOpacity  onPress={()=> this.clickEventListener({title:"MapViews"})}
                       style={{width:200, height:50,
                         backgroundColor:"#E74C3C",
                    borderRadius:15, alignItems:"center", justifyContent:"center", alignSelf:"center",margin:5
                    }}>
                      <Text style={{fontFamily:"m-bold", fontSize:15}}>Click here !!</Text>
                    </TouchableOpacity>
                </View>
                </TouchableOpacity>
              </View>
              
<Text style={{fontFamily:"m-bold", fontSize:20, alignSelf:"center"}}>Coming Soon</Text>
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

          
          {/* Pack details Stsrts here */}
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
              Our Packs
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
            <ScrollView  showsHorizontalScrollIndicator={false} horizontal={true}>
              {this.state.packs.map(each =>(
                <View
                key={each.PackageID}
                  style={{
                    width: 300,
                    height: 120,
                    borderColor: "#E74C3C",
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderWidth:3,
                    borderTopLeftRadius:30,
                    borderBottomRightRadius:30,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.0,

                    elevation: 24,
                    marginRight:10,
                    marginLeft:5,
                    marginTop:10,
                    marginBottom:50
                  }}
              >
                <TouchableOpacity onPress={()=> this.clickEventListener({title:"CarDetails"})}>
                  <Text style={styles.packText}>{each.PackName}</Text>
                  <View style={{flexDirection:"row", justifyContent:"center"}}>
                    <Text style={styles.packTextRate}>{each.PackAmount}</Text>
                    <Image
                    style={{ width: 50, height: 50, alignSelf: "center" }}
                    source={{
                      uri:
                        "https://img.icons8.com/material/64/000000/rupee--v1.png",
                    }}
                  />
                  </View>
                  </TouchableOpacity>
                </View>
              ))}
              
            </ScrollView>
          </View>


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

              {/* <View
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
              </View> */}
            </ScrollView>
          </View>
        </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}
const resizeMode = "cover";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff00",
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor: "#ffffff00",
    marginTop: 5,
  },
  listContainer: {
    alignItems: "center",
  },
  /******** card **************/
  card: {
    marginHorizontal: -30,
    marginVertical: 10,
    flexBasis: "48%",
    width: 80,
    height: 80,
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
    height: 50,
    width: 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 12,
    flex: 1,
    color: "black",
    alignSelf: "center",
    fontFamily:'m-bold'
  },
  subTitle: {
    fontSize: 10,
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
    packText: {
    color: "black",
    fontSize: 20,
    fontFamily:'m-bold',

    alignSelf: "center",
    marginTop: 10,
  },
      packTextRate: {
    color: "black",
    fontSize: 50,
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
