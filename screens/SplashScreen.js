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

const SplashScreen = ({navigation}) => {
    const { colors } = useTheme();

    return (
      <View style={styles.container}>
            <StatusBar backgroundColor='#170051' barStyle="light-content"/>
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={require('../assets/main.png')}
            style={styles.logo}
            resizeMode="stretch"
            />
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: "#E74C3C"
            }]}
            animation="fadeInUpBig"
        >
            <Text style={[styles.title, {
                color: "white"
            }]}>Welcome to Wheelz4Wash!!</Text>
            {/* <Text style={styles.text}>Sign in with account</Text> */}
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
                            }]}>Sign In</Text>
                        </TouchableOpacity>
            
            </View>
        </Animatable.View>
      </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
        backgroundColor: 'white'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
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
      width: height_logo,
      height: height_logo
  },
  title: {
      color: 'white',
      fontSize: 30,
      fontFamily:"m-bold"
  },
  text: {
      color: 'white',
      marginTop:5
  },
  button: {
    width:"100%",
  },
  signIn: {
      width: "100%",
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      flexDirection: 'row',
      backgroundColor:"white"
  },
  textSign: {
      color: 'white',
      fontFamily:'m-bold'
  }
});

