import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import * as firebase from "firebase";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calls: [],
      options: [],
      Owner: firebase.auth().currentUser.uid,
    };
  }

  componentDidMount = async() => {
    let response = await this.getUserDetails();
    const profileDetails = this.setUserDetails(response);
    this.state.calls.push(
      {
        id: 23,
        name: profileDetails[0].Name,
        status: "Name",
        image: "",
      },
      {
        id: 24,
        name: profileDetails[0].Email,
        status: "Email",
        image: "",
      },
      {
        id: 25,
        name: profileDetails[0].Phone,
        status: "Phone",
        image: "",
      },
      {
        id: 26,
        name: profileDetails[0].AppartmentName,
        status: "location",
        image: "",
      },
      {
        id: 27,
        name: profileDetails[0].FlatNo,
        status: "Flat No",
        image: "",
      }
    );

    this.state.options.push(
      {
        id: 28,
        status: "Terms & Conditions",
        navigateTo: "TermsConditions",
      },
      {
        id: 29,
        status: "Privacy policy",
        navigateTo: "PrivacyPolicy",
      },
      {
        id: 30,
        status: "Help & Support",
        navigateTo: "PrivacyPolicy",
      },
      {
        id: 31,
        status: "My Subscriptions",
        navigateTo: "PrivacyPolicy",
      }
    );
  };

  getUserDetails = async () => {
    const eventref = firebase.database().ref("Users/" + this.state.Owner);
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  setUserDetails = (userData) => {
    let userDetails = [];
    userDetails.push({
      Name: userData.UserDetails.Name,
      Phone:userData.UserDetails.Phone,
      Email: userData.UserDetails.Email,
      AppartmentID: userData.UserDetails.AppartmentID,
      AppartmentName: userData.UserDetails.AppartmentName,
      Address: userData.UserDetails.Address,
      FlatNo: userData.UserDetails.FlatOrHouseNo,
    });
    return userDetails;
  };

  clickEventListener(item) {
    this.props.navigation.navigate(item.navigateTo);
    // Alert.alert("Please Contact customer care for any change in your Data")
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
        <View style={styles.row}>
          {/* <Image source={{ uri: item.image }} style={styles.pic} /> */}
          <View style={{ flex: 1 }}>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>{item.status}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text
                style={styles.nameTxt}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              {/* <Text style={styles.mblTxt}>Mobile</Text> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderOptions = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.clickEventListener(item);
        }}
      >
        <View style={styles.row2}>
          {/* <Image source={{ uri: item.image }} style={styles.pic} /> */}
          <View>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt2}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <FlatList
          extraData={this.state}
          data={this.state.calls}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={this.renderItem}
        />
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              styles.loginButton,
              { marginBottom: -10 },
            ]}
            onPress={() =>
              this.props.navigation.navigate("EditProfile", {
                profileDetails: this.state.calls,
              })
            }
          >
            <Text style={{ color: "white", fontFamily:'m-bold' }}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* <FlatList
          extraData={this.state}
          data={this.state.options}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={this.renderOptions} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  row2: {
    flexDirection: "column",
    alignItems: "center",
    //borderColor: '#DCDCDC',
    backgroundColor: "#fff",
    //borderBottomWidth: 1,
    padding: 8,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  nameTxt: {
    marginLeft: 15,
    fontFamily:'m-bold',
    color: "black",
    fontSize: 20,
    width: "100%",
  },
  mblTxt: {
    fontWeight: "200",
    color: "#777",
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    color: "#e74c3c",
    fontSize: 18,
    fontFamily:'m-bold',
    marginLeft: 15,
  },
  msgTxt2: {
    color: "#1A6DFF",
    fontSize: 30,

    //marginLeft: 15,
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 5,
    width: 300,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  loginButton: {
    backgroundColor: "#E74C3C",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
});
