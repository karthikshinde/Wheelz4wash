import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import Slider from "../components/Slider.js";
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = ({navigation}) => {
    const { colors } = useTheme();

    return (
      <View style={styles.container}>
            <StatusBar backgroundColor='#e74c3c' barStyle="light-content"/>
        <View style={styles.header}>
            {/* <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={require('../assets/images/w4wlogo.png')}
            style={styles.logo}
            resizeMode="stretch"
            /> */}
            <View style={{flex:10}}>
            <Slider></Slider>

            </View>
            <View style={{flex:1}}>
                

                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignInScreen')}
                            style={[styles.signIn, {
                                alignSelf:"center"
                            }]}
                        >
                        <LinearGradient
                            // Button Linear Gradient
                            colors={['#e74c3c', '#e74c3c', '#FFCC70']}
                            start={[0,1]}
                            end={[1,0]}
                            style={styles.button}
                            >
                            <Text style={styles.text}>Get Started</Text>

                        </LinearGradient>
                            {/* <Text style={[styles.textSign, {
                                color: 'black'
                            }]}>Get Started</Text> */}
                        </TouchableOpacity>
            
            </View>

        </View>
        {/* <Animatable.View 
            style={[styles.footer, {
                backgroundColor: "#E74C3C"
            }]}
            animation="fadeInUpBig"
        >
            <Text style={[styles.title, {
                color: "white"
            }]}>Welcome to Wheelz4Wash!!</Text>
            
            <View style={styles.button}>
            
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignInScreen')}
                            style={[styles.signIn, {
                                borderColor: '#e74c3c',
                                borderWidth: 1,
                                marginTop: 15,
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: 'black'
                            }]}>Get Started</Text>
                        </TouchableOpacity>
            
            </View>
        </Animatable.View> */}
      </View>
    );
};

export default SplashScreen;

const { height, width} = Dimensions.get("screen");
const height_logo = height * 0.18;
const width_logo = width * 0.70;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
        backgroundColor: 'white'
  },
  header: {
      flex: 2,
  },
  footer: {
      flex: 1,
      backgroundColor: '#170051',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: width_logo,
      height: height_logo
  },
  title: {
      color: 'white',
      fontSize: 30,
      fontFamily:"m-bold"
  },
  signIn: {
      width: "80%",
      height: 50,
      borderRadius: 10,
      flexDirection: 'row',
  },
  textSign: {
      color: 'white',
      fontFamily:'m-bold'
  },
    button: {
    width:"100%",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
    fontFamily:"m-bold"
  },
});

