import React, { Component } from 'react';
import { View, StyleSheet, Image} from 'react-native';

class SelectCar extends Component {


  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#E74C3C"}}>
        <Image
          style={{
            width: 300,
            height: 300,
          }}
          source={require("../assets/images/csoon.png")}
        />
      </View>
    );
  }
};

export default SelectCar;

const styles = StyleSheet.create({
    textSign: {
        fontSize: 15,
        fontFamily:'m-bold'
    },
});
