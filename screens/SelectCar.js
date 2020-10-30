import React, { Component } from 'react';
import { View, Image,Text, StyleSheet, TouchableHighlight } from 'react-native';

class SelectCar extends Component {
  render() {
    return (
      <View style={styles.container}>
   
          <Image
            style={{
              width: 300,
              height: 300,
            }}
            source={require("../assets/images/csoon.png")}
          />
        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "white" }}
          onPress={() => {
            this.props.navigation.navigate("Home")
          }}
        >
          <Text style={styles.textStyle}>Go Back</Text>
        </TouchableHighlight>
            
      </View>
    );
  }
};

export default SelectCar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#E74C3C"
  },
  openButton: {
    width: "80%",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    borderWidth: 2,
    borderColor: "#E74C3C"

  },
  textStyle: {
    color: "black",
    fontFamily: "m-bold",
    textAlign: "center",
  },
});
