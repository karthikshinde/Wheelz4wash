import React, { Component } from 'react';
import { View, StyleSheet, Image, ImageBackground, Text} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

class VehicleDetails extends Component {


  render() {
    return (
      <View style={{ flex: 1, justifyContent:"center", alignItems:"center"}}>

      <LinearGradient
        // Background Linear Gradient
        colors={['#d9dada','#d9dada','#e74c3c','#e74c3c', '#d9dada', '#d9dada']}
        style={styles.background}
      >
        <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
        <Image
          style={{
            width: "80%",
            height: 450 ,
          }}
          source={require("../assets/images/SEDAN.png")}
        />
        </View>


      </LinearGradient>
      </View>
    );
  }
};

export default VehicleDetails;

const styles = StyleSheet.create({
    textSign: {
        fontSize: 15,
        fontFamily:'m-bold'
    },
    background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",

  },
});
