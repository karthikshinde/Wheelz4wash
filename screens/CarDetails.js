import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from "react-native";
import * as firebase from "firebase";

export default class CarDetails extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      modalVisible: false,
      Owner: firebase.auth().currentUser.uid,
      SubsriptionDetails: "",
      usersPackages: "",
      appartmentID: "",
      isLoading: true,
      data: [
        {
          image:
            "https://img.icons8.com/cute-clipart/64/000000/gas-station.png",
          carName: "********",
          carNo: "********",
          carType: "********",
          fuel: "********",
          carModel: "********",
          color: "********",
        },
      ],
    };
  }

  getExpiryMonth=()=>{
    let month = new Date().getMonth() + 2;
    if(month > 12) {
      return month - 12 + "-" + new Date().getFullYear()+1;
    }
    return month + "-" + new Date().getFullYear();
  }

  clickEventListener = (item) => {
    Alert.alert(
      "Message",
      "To change car details Please contact Customer care"
    );
  };

  componentDidMount = async () => {
    this.animate();
    const appartmentID = this.props.route.params.AppartmentID;
    const SubsriptionDetails = await this.getSubscribtionDetails();
    const usersPackages = await this.getAllPackageDetails();
    this.setState({ SubsriptionDetails });
    this.setState({ usersPackages });
    let carIDs = await this.getCarIDs();
    let data = [];

    if(carIDs !== null) {

      const Promises = await Object.keys(carIDs).map(async (each) => {
        return await this.getCardetails(each);
      });
      const results = await Promise.all(Promises);

      results.forEach((eachCar) => {

        let isCarSubscribed = this.isSubscribed(eachCar.CarNo);
        let eachCarDetail = {
          image: "https://img.icons8.com/cute-clipart/64/000000/gas-station.png",
          carName: eachCar.CarName,
          carNo: eachCar.CarNo,
          carType: eachCar.CarType,
          fuel: eachCar.Fuel,
          carModel: eachCar.CarModel,
          color: eachCar.Color,
          remarks: eachCar.Remarks,
          isSubscribed: isCarSubscribed,
          remainingCarWashes: 0,
          completedCarWashes: 0,
          isSubForCurrentMonth: false,
          allWashesCompleted: false,
          packExpiryDate: 0,
          isPackExpired: false,
          newCar: true

        };

        if (isCarSubscribed && this.state.SubsriptionDetails !== null) {
          data.push(this.calculateCurrentMonthDetails(eachCar.CarNo, eachCarDetail));          
        } else {
          data.push(eachCarDetail);
        }

      });

    }


    data.push({
      carName: "Add Button",
      carNo: "Add",
    });
    this.setState({ appartmentID });
    this.setState({ data });
    this.setState({ isLoading: false });
  };

  isSubscribed = (carNo) => {
    let count = 0;
    if (!this.isEmpty(carNo) && !this.isEmpty(this.state.SubsriptionDetails)) {
      Object.keys(this.state.SubsriptionDetails).forEach((id) => {
        if (id === carNo) {
          count++;
        }
      });
      return count != 1 ? false : true;
    }
  };


  calculateCurrentMonthDetails = (carNo, data) => {
    let calender = new Date();
    let carSubscriptionDetails = this.state.SubsriptionDetails[carNo];
    let expirayDate = new Date(carSubscriptionDetails.expiry);
    data.newCar = false;
    data.packExpiryDate = this.formatDate(carSubscriptionDetails.expiry);

    if(expirayDate > calender ) {
      data.isSubForCurrentMonth = true;
        // getting pack details
        let userPack = this.state.usersPackages[
          carSubscriptionDetails.PackageID
        ];
        if (!this.isEmpty(userPack)) {
          data.completedCarWashes = carSubscriptionDetails.CarWashDone;
          data.remainingCarWashes = userPack.PackWashes - carSubscriptionDetails.CarWashDone;
          
          if (data.remainingCarWashes === 0) {
              data.allWashesCompleted = true;
          }
        }
    } else {
          data.isPackExpired = true;
    }
    return data;
  };

  isSubscribedForCurrentMonth = (carNo, data) => {
    let calender = new Date();
      let packageDetails = this.state.SubsriptionDetails[carNo];
        // checking current month subscription
        if (
          packageDetails[calender.getFullYear()] &&
          packageDetails[calender.getFullYear()][calender.getMonth() + 1]
        ) {
          data.isSubForCurrentMonth = true;
          let currentMonthSubDetails =
            packageDetails[calender.getFullYear()][calender.getMonth() + 1];

          // getting pack details
          let userPack = this.state.usersPackages[
            currentMonthSubDetails.PackageID
          ];

          //updating carWash Details
          if (!this.isEmpty(userPack)) {
            data.completedCarWashes = currentMonthSubDetails.CarWashDone;
            data.remainingCarWashes = userPack.PackWashes - currentMonthSubDetails.CarWashDone;
            if (data.remainingCarWashes === 0) {
              data.allWashesCompleted = true;
            }
          }

        } else {
          data.isPackExpired = true;
          data.isSubForCurrentMonth = false;
        }

    return data;
  };


  getPackageDetails = async (param) => {
    const eventref = firebase.database().ref("PackageDetails/" + param);
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  getAllPackageDetails = async () => {
    const eventref = firebase.database().ref("PackageDetails/");
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  isEmpty = (value) => {
    if (value === undefined || value === null || value === "") {
      return true;
    }
    return false;
  };

  getCardetails = async (each) => {
    const eventref = firebase.database().ref("AllCars/" + each + "/");
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  getSubscribtionDetails = async () => {
    const eventref = firebase
      .database()
      .ref("Users/" + this.state.Owner + "/SubsriptionDetails/");
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  getCarIDs = async () => {
    const eventref = firebase
      .database()
      .ref("Users/" + this.state.Owner + "/CarDetails");
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  formatDate =(date)=> {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  getCarImage = (ctype) => {
    let type = ctype.toLowerCase();
    if (type === "sedan") {
      return (
        <Image
          style={styles.bgImage}
          //sedanCard
          source={require("../assets/images/SEDAN.png")}
        />
      );
    } else if (type === "suv") {
      return (
        <Image
          style={styles.bgImage}
          //suvCard
          source={require("../assets/images/SUV.png")}
        />
      );
    } else {
      return (
        <Image
          style={styles.bgImage}
          // hatchbackCard
          source={require("../assets/images/SUV.png")}
        />
      );
    }
  };

  animate () {
  this.animatedValue.setValue(0)
  const createAnimation = function (value, duration, easing, delay = 0) {
    return Animated.timing(
      value,
      {
        toValue: 1,
        duration,
        easing,
        delay
      }
    )
  }
  Animated.parallel([
    createAnimation(this.animatedValue, 1000, Easing.ease, 2000)        
  ]).start()
    }

  render() {
    const { height, width} = Dimensions.get("screen");
    const introButton = this.animatedValue.interpolate({
     
    inputRange: [0, 1],
    outputRange: [-100, ((height / 100)* 65)]
      });
    return (
      <View style={styles.container}>
    <ImageBackground
  // resizeMethod={'auto'}
  style={{
    width: "100%",
    height: "100%",
    backgroundColor:'#e74c3c',
    borderTopLeftRadius: 300,
    borderBottomRightRadius: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  }}
  imageStyle={{
    resizeMode: "cover",
  }}
>

        {this.state.isLoading ? (
          <ActivityIndicator size="large" color="#e74c3c" />
        ) : (
          <FlatList
            style={styles.contentList}
            columnWrapperStyle={styles.listContainer}
            data={this.state.data}
            horizontal={true}
            keyExtractor={(item) => {
              return item.carNo;
            }}
            renderItem={({ item }) => {
              if (item.carNo != "Add") {
                return (
                  <View>
                  <View style={styles.card}>
                    {this.getCarImage(item.carType)}
                    <View style={{flex:1}}>
 
                    </View>
                    <View style={{flex:1}}>
                      <Text style={{ fontFamily: 'm-bold', color: 'black', fontSize: 30, alignSelf: 'center' }}>{item.carType}</Text>
                      <Text
                        style={[
                          {
                            alignSelf: "center",
                            fontSize: 20,
                            marginTop: 15,
                            fontFamily:'m-bold',
                            color: "black",
                          },
                        ]}
                      >
                        {item.carNo.toUpperCase()}
                      </Text>
                      <Text style={styles.count}>
                        {item.carName} / {item.carModel}
                      </Text>
                    </View>
                     <View style={{flex:1}}>
                       <View style={{flex:1}}></View>
                       <View style={{flex:1}}></View>
                       {/* <View style={{flex:1}}></View> */}
                       <View style={{flex:1, flexDirection:"row"}}>
                         <View style={{flex : 1, justifyContent:"flex-end", flexDirection:"row",paddingRight:"20%"}}>
                         <Text style={{ color: "black", fontFamily:'m-bold' }}>
                          {item.fuel}
                        </Text>
                         </View>
                         <View style={{flex : 1, justifyContent:"flex-start", flexDirection:"row"}}>
                         <Text style={{ color: "black", fontFamily:'m-bold' }}>
                          {item.color}
                        </Text>
                         </View>
                       </View>

                    </View>


        {/* <View style={{height: 150}}>
                    <View
                      style={{
                        width: ((width/100)*80),
                        height: 80,
                        borderColor: "black",
                        backgroundColor: "#f1f3f4",
                        borderRadius: 10,
                        alignSelf: "center",
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
                          flex: 1,
                          width: ((width/100)*80),
                          height: 80,
                          alignSelf: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.newCar ? 
                        <Image style={{ height: "100%", width: "100%", alignSelf: 'center' }} source={require("../assets/images/buyImage.png")}></Image>
                          :
                          item.isPackExpired ? 
                            <Image style={{ height: "100%", width: "100%", alignSelf: 'center' }} source={require("../assets/images/renewbutton.png")}></Image>
                          :
                            item.remainingCarWashes === 0 ?
                              <Image style={{ height: "100%", width: "100%", alignSelf: 'center' }} source={require("../assets/images/donebutton.png")}></Image>
                              :
                          <>
                         <Text
                          style={{
                            fontSize: 20,
                            color: "white",
                            alignSelf: "center",
                            fontFamily:'m-bold'
                          }}
                        >
                          Remaining Interior Washes
                        </Text>
                        <Text
                          style={{
                            fontSize: 60,
                            color: "white",
                            fontFamily:'m-bold',
                            alignSelf: "center",
                          }}
                        >
                          {item.remainingCarWashes}
                        </Text>
                        <Text
                          style={{
                            fontSize: 20,
                            color: "white",
                            fontFamily:'m-bold',
                            alignSelf: "center",
                          }}
                        >
                          Expires on : {item.packExpiryDate}
                        </Text> 
                        </>}
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop:10
                      }}
                    >
                      {item.isSubscribed && item.isSubForCurrentMonth ? (
                        item.remainingCarWashes === 0 ?
                          <Text style={{color: "black", fontFamily: 'm-bold', marginBottom:50 }}>*Your daily cleaning activity remains active</Text> :
                        <TouchableOpacity
                          style={[
                            styles.buttonContainer,
                            styles.loginButton,
                            { marginBottom: 10 },
                          ]}
                          onPress={() =>
                            this.props.navigation.navigate("Progress", {
                              carID: item.carNo,
                              carWashesdone: item.completedCarWashes,
                            })
                          }
                        >
                          <Text style={{ color: "#E74C3C", fontFamily:'m-bold' }}>Book</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.buttonContainer,
                            styles.loginButton,
                            { marginBottom: 10 },
                          ]}
                          onPress={() =>
                            this.props.navigation.navigate("BuyPack", {
                              carID: item.carNo,
                              carWashesdone: item.completedCarWashes,
                            })
                          }
                        >
                            <Text style={{ color: "#E74C3C", fontFamily: 'm-bold' }}>{item.isPackExpired ? "Renew Pack" : "Browse & Buy"}</Text>
                        </TouchableOpacity>
                      )}
                    </View>

            </View> */}
          </View>
                    <View
                      style={{
                        width: ((width/100)*80),
                        height: 80,
                        borderColor: "black",
                        backgroundColor: "#f1f3f4",
                        borderRadius: 10,
                        alignSelf: "center",
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
                          flex: 1,
                          width: ((width/100)*80),
                          height: 80,
                          alignSelf: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.newCar ? 
                        <Image style={{ height: "100%", width: "100%", alignSelf: 'center' }} source={require("../assets/images/buyImage.png")}></Image>
                          :
                          item.isPackExpired ? 
                            <Image style={{ height: "100%", width: "100%", alignSelf: 'center' }} source={require("../assets/images/renewbutton.png")}></Image>
                          :
                            item.remainingCarWashes === 0 ?
                              <Image style={{ height: "100%", width: "100%", alignSelf: 'center' }} source={require("../assets/images/donebutton.png")}></Image>
                              :
                          <>
                         <Text
                          style={{
                            fontSize: 20,
                            color: "white",
                            alignSelf: "center",
                            fontFamily:'m-bold'
                          }}
                        >
                          Remaining Interior Washes
                        </Text>
                        <Text
                          style={{
                            fontSize: 60,
                            color: "white",
                            fontFamily:'m-bold',
                            alignSelf: "center",
                          }}
                        >
                          {item.remainingCarWashes}
                        </Text>
                        <Text
                          style={{
                            fontSize: 20,
                            color: "white",
                            fontFamily:'m-bold',
                            alignSelf: "center",
                          }}
                        >
                          Expires on : {item.packExpiryDate}
                        </Text> 
                        </>}
                      </View>
                    </View>

                    {/* <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop:10
                      }}
                    >
                      {item.isSubscribed && item.isSubForCurrentMonth ? (
                        item.remainingCarWashes === 0 ?
                          <Text style={{color: "black", fontFamily: 'm-bold', marginBottom:50 }}>*Your daily cleaning activity remains active</Text> :
                        <TouchableOpacity
                          style={[
                            styles.buttonContainer,
                            styles.loginButton,
                            { marginBottom: 10 },
                          ]}
                          onPress={() =>
                            this.props.navigation.navigate("Progress", {
                              carID: item.carNo,
                              carWashesdone: item.completedCarWashes,
                            })
                          }
                        >
                          <Text style={{ color: "#E74C3C", fontFamily:'m-bold' }}>Book</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.buttonContainer,
                            styles.loginButton,
                            { marginBottom: 10 },
                          ]}
                          onPress={() =>
                            this.props.navigation.navigate("BuyPack", {
                              carID: item.carNo,
                              carWashesdone: item.completedCarWashes,
                            })
                          }
                        >
                            <Text style={{ color: "#E74C3C", fontFamily: 'm-bold' }}>{item.isPackExpired ? "Renew Pack" : "Browse & Buy"}</Text>
                        </TouchableOpacity>
                      )}
                    </View> */}
          </View>
                );
              } else {
                return (
                  <View style={[styles.card]}>
                    <View
                      style={[
                        styles.cardContent,
                        {
                          flex: 1,
                          width: 280,
                          justifyContent: "center",
                          backgroundColor:"#e74c3c",
                          borderRadius: 10
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("AddCar", {
                            appartmentID: this.state.appartmentID,
                          })
                        }
                        style={{ alignSelf: "center" }}
                      >
                        <Image
                          style={styles.image}
                          source={require("../assets/images/plus-icon.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            }}
          />
        )}
        </ImageBackground>
      </View>
    );
  }
}

const resizeMode = "cover";
const { height, width} = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 5,
    marginTop: 10,
  },
  cardContent2: {
    marginLeft: 10,
  },
  cardContent3: {
    marginLeft: 5,
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  bgImage: {
    flex: 1,
    resizeMode,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,

    marginLeft: 20,
    marginRight: 15,
    marginTop: 20,
    backgroundColor: "#1b1f2300",
    //padding: 10,
    flexDirection: "column",
    borderRadius: 15,
    marginBottom: 20,
    height: height - ((height / 100)*40),
    width: width - ((width/100) * 20),
  },

  name: {
    fontSize: 25,
    flex: 1,
    color: "black",
  },
  count: {
    fontSize: 18,
    alignSelf: "center",
    color: "black",
    fontFamily:'m-bold',
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  followButtonText: {
    color: "red",
    fontSize: 12,
  },
  headerText: {
    color: "black",
    fontSize: 30,

    marginTop: 40,
    alignSelf: "center",
  },
  shareButton: {
    marginTop: 10,
    height: 40,
    width: 80,
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#1A6DFF",
  },
  shareButton1: {
    marginTop: 10,
    height: 40,
    width: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#C822FF",
    marginRight: 10,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    width: 300,
    borderRadius: 5,
    borderWidth:2,
    borderColor:"#E74C3C",
    backgroundColor: "transparent",
  },
  loginButton: {
    backgroundColor: "white",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    top: 30,
    zIndex: 3,
  },

  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
});
