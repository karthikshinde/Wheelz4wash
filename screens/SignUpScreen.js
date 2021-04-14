import React from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Image,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Linking,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MobileService from "../services/MobileService";
// import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const SignInScreen = ({navigation}) => {

   const { signIn } = React.useContext(AuthContext);
   
   const dialCall = () => {
        let phoneNumber = "";
        if (Platform.OS === "android") {
            phoneNumber = "tel:${" + Number("9494408744") + "}";
        } else {
            phoneNumber = "telprompt:${" + Number("9494408744") + "}";
        }
        Linking.openURL(phoneNumber);
    };

    return (
      <View style={styles.container}>
            <StatusBar backgroundColor='#E74C3C' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <MobileService> </MobileService>

                {/* <Image style={{ height: 300, width: 300, alignSelf:'center' }} source={require("../assets/images/IT-Support.png")}></Image>
                <Text style={styles.content}>Currently we are accepting offline registrations.</Text>
                <TouchableOpacity
                    onPress={() => dialCall()}
                    style={[styles.signIn, {
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#e74c3c'
                    }]}>Call Us</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignInScreen')}
                    style={[styles.signIn]}
                >
                    <Text style={[styles.textSign, {
                        color: '#e74c3c'
                    }]}>Go Back</Text>
                </TouchableOpacity> */}
        </Animatable.View>
      </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
        backgroundColor: '#E74C3C'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
       fontFamily:'m-light',
        fontSize: 40
    },
    content: {
        color: 'black',
        fontFamily: 'm-bold',
        fontSize: 20
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontFamily:'m-bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });
