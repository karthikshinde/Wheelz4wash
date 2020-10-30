import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Picker,
  Image,
} from "react-native";
import * as firebase from "firebase";

export default class AddCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppartmentID: "",
      CarModel: "",
      CarName: "",
      CarNo: "",
      CarType: "",
      Color: "",
      Fuel: "",
      Owner: firebase.auth().currentUser.uid,
    };
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    const AppartmentID = this.props.route.params.appartmentID;
    if (AppartmentID != undefined) {
      this.setState({ AppartmentID });
    }
  };

  onClickListener = () => {
    if (this.validateDetails()) {
      this.addCarDetails();
      this.addCarToOwner();
      this.props.navigation.navigate("Booked", {
        title: "Car Added !",
        description: "You car has been successfully added !",
      });
    }
  };

  validateDetails = () => {
    const { CarModel, CarName, CarNo, CarType, Color, Fuel } = this.state;
    if (
      CarModel != "" &&
      CarName != "" &&
      CarNo != "" &&
      CarType != "" &&
      Color != "" &&
      Fuel != ""
    ) {
      return true;
    } else {
      Alert.alert("Alert", "Please fill all the details");
      return false;
    }
  };

  addCarDetails = () => {
    const {
      AppartmentID,
      CarModel,
      CarName,
      CarNo,
      CarType,
      Color,
      Fuel,
      Owner,
    } = this.state;
    firebase
      .database()
      .ref("AllCars/" + CarNo.split(" ").join("").toLowerCase())
      .update({
        Appartment: AppartmentID,
        CarModel: CarModel,
        CarName: CarName,
        CarNo: CarNo.trim().split(" ").join("").toLowerCase(),
        CarType: CarType,
        Color: Color,
        Fuel: Fuel,
        Owner: Owner,
      })
      .then(() => {
        console.log("Car details have been saved successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addCarToOwner = () => {
    const { CarNo, Owner } = this.state;
    let carID = CarNo.split(" ").join("").toLowerCase();
    firebase
      .database()
      .ref("Users/" + Owner + "/CarDetails/" + carID)
      .update({
        carID,
      })
      .then(() => {
        console.log("Car details have been saved successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View>
          <TouchableOpacity
            style={{ alignSelf: "center", margin:20 }}
            onPress={() => this.props.navigation.navigate("CarDetails")}
          >
          <Text style={{ fontFamily: 'm-bold', color: 'black', fontSize: 30, alignSelf: 'center' }}>  <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/images/backButton.png")}
          />{" "}Add Car</Text>
         </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Picker
              selectedValue={this.state.CarType}
              style={{ flex: 1, marginLeft: 10 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ CarType: itemValue })
              }
            >
              <Picker.Item key="0" label="Select" value="Select" style={{fontFamily:'m-bold'}}/>
              <Picker.Item key="1" label="Sedan" value="sedan" style={{fontFamily:'m-bold'}}/>
              <Picker.Item key="2" label="SUV" value="suv" style={{fontFamily:'m-bold'}}/>
              <Picker.Item key="3" label="Hatchback" value="hatchback" style={{fontFamily:'m-bold'}}/>
            </Picker>
            <View
              style={{
                backgroundColor: "#E74C3C",
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                width: 130,
                height: 45,
              }}
            >
              <Text style={styles.inputIcon}>Type</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            {/* <TextInput
              autoCapitalize="characters"
              style={styles.inputs}
              placeholder="eg: Petrol or Diesel"
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ Fuel: text })}
            /> */}
            <Picker
              selectedValue={this.state.Fuel}
              style={{ flex: 1, marginLeft: 10 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ Fuel: itemValue })
              }
            >
              <Picker.Item key="0" label="Select" value="Select" />
              <Picker.Item key="1" label="Petrol" value="petrol" />
              <Picker.Item key="2" label="Diesel" value="diesel" />
            </Picker>
            <View
              style={{
                backgroundColor: "#E74C3C",
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                width: 130,
                height: 45,
              }}
            >
              <Text style={styles.inputIcon}>Fuel</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="characters"
              style={styles.inputs}
              placeholder="Brand"
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ CarModel: text })}
            />
            <View
              style={{
                backgroundColor: "#E74C3C",
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                width: 130,
                height: 45,
              }}
            >
              <Text style={styles.inputIcon}>Brand</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="characters"
              style={styles.inputs}
              placeholder="Model"
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ CarName: text })}
            />
            <View
              style={{
                backgroundColor: "#E74C3C",
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                width: 130,
                height: 45,
              }}
            >
              <Text style={styles.inputIcon}>Model</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="characters"
              style={styles.inputs}
              placeholder="eg: TS 00 FF 0000"
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ CarNo: text })}
            />
            <View
              style={{
                backgroundColor: "#E74C3C",
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                width: 130,
                height: 45,
              }}
            >
              <Text style={styles.inputIcon}>Vehicle No</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="characters"
              style={styles.inputs}
              placeholder="eg: blue, green"
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ Color: text })}
            />
            <View
              style={{
                backgroundColor: "#E74C3C",
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                width: 130,
                height: 45,
              }}
            >
              <Text style={styles.inputIcon}>Vehicle color</Text>
            </View>
          </View>
          <View style={{ alignSelf: "center" }}>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => this.onClickListener()}
            >
              <Text style={styles.loginText}>Add</Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => this.props.navigation.navigate("CarDetails")}
          >
            <Image
              style={{ width: 50, height: 50, marginLeft: 10 }}
              source={require("../assets/images/backButton.png")}
            />
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const resizeMode = "center";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderBottomWidth: 1,
    width: "95%",
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
    fontFamily:'m-bold',
    flex: 1,
  },
  inputIcon: {
    fontSize: 15,
    alignSelf: "center",

    color: "#FFFFFF",
    fontFamily:'m-bold'
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 150,
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  btnByRegister: {
    height: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: 300,
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
  loginText: {
    color: "white",
  },
  bgImage: {
    flex: 1,
    resizeMode,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  textByRegister: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
