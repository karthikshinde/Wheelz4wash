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

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calls: [],
      name: "",
      email: "",
      phone: "",
      location: "",
      flatNo: "",
      options: [],
    };
  }

  componentDidMount = () => {
    const profileDetails = this.props.route.params.profileDetails;
    this.setState({ name: profileDetails[0].name });
    this.setState({ email: profileDetails[1].name });
    this.setState({ phone: profileDetails[2].name });
    this.setState({ location: profileDetails[3].name });
    this.setState({ flatNo: profileDetails[4].name });
  };

  handleProfileEdit=()=>{
    firebase
      .database()
      .ref("Users/" + firebase.auth().currentUser.uid +"/UserDetails")
      .update({
        Name: this.state.name,
        Email: this.state.email,
        Phone: this.state.phone,
        AppartmentName: this.state.location,
        FlatOrHouseNo: this.state.flatNo
      })
      .then(() => {
        console.log("user details have been saved successfully");
        this.props.navigation.navigate("Booked", {
          title: "Profile Updated !",
          description: "Thanks for using Wheelz4Wash!",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clickEventListener(item) {
    this.props.navigation.navigate(item.navigateTo);
    // Alert.alert("Please Contact customer care for any change in your Data")
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <View>
          <View style={styles.inputContainer}>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>Name</Text>
            </View>
            <TextInput
              style={styles.inputs}
              underlineColorAndroid="transparent"
              value={this.state.name}
              onChangeText={(val) => this.setState({ name: val})}
            />
          </View>
        </View>
        {/* <View>
          <View style={styles.inputContainer}>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>Email</Text>
            </View>
            <TextInput
              style={styles.inputs}
              underlineColorAndroid="transparent"
              value={this.state.email}
              onChangeText={(val) => this.setState({ email: val })}
            />
          </View>
        </View> */}
        <View>
          <View style={styles.inputContainer}>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>Phone</Text>
            </View>
            <TextInput
              keyboardType="numeric"
              style={styles.inputs}
              underlineColorAndroid="transparent"
              value={`${this.state.phone}`}
              onChangeText={(val) => this.setState({ phone: val })}
            />
          </View>
        </View>

        <View>
          <View style={styles.inputContainer}>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>Location</Text>
            </View>
            <TextInput
              style={styles.inputs}
              underlineColorAndroid="transparent"
              value={this.state.location}
              onChangeText={(val) => this.setState({ location: val })}
            />
          </View>
        </View>

        <View>
          <View style={styles.inputContainer}>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>Flat No:</Text>
            </View>
            <TextInput
              keyboardType="numeric"
              style={styles.inputs}
              underlineColorAndroid="transparent"
              value={`${this.state.flatNo}`}
              onChangeText={(val) => this.setState({ flatNo: val })}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            styles.loginButton,
            { marginBottom: -10 },
          ]}
          onPress={() =>
            this.handleProfileEdit()
          }
        >
          <Text style={{ color: "white" }}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
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
    fontFamily:"m-bold",
    color: "#222",
    fontSize: 15,
    width: 170,
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
    fontFamily:'m-bold',
    color: "#e74c3c",
    fontSize: 15,

    marginLeft: 15,
  },
  msgTxt2: {
    fontWeight: "400",
    color: "black",
    fontSize: 15,
    fontWeight: "bold",

    //marginLeft: 15,
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    width: "100%",
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
    fontFamily:'m-bold',
    fontSize:18,
    color: "black",
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
