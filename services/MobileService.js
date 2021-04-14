import * as React from "react";
import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from '../keys/ApiKeys';
import FireBaseServices from "../services/FireBaseServices";


export default function MobileService(props) {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [codeSent, setCodeSent] = React.useState(false);
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const [message, showMessage] = React.useState((!firebaseConfig || Platform.OS === 'web')
    ? { text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device."}
    : undefined);

  return (
    <View style={{ padding: 10}}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <Text style={{ marginTop: 20 , fontFamily:"m-bold"}}>Enter phone number</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17, fontFamily:"m-bold" }}
        placeholder="+91 999 999 9999"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
      />
        <TouchableOpacity
           onPress={async () => {
          try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
              phoneNumber,
              recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            setCodeSent(true);
            FireBaseServices.log("Verification code has been sent to your phone.");
            showMessage({
              text: "Verification code has been sent to your phone.",
            });
          } catch (err) {
            FireBaseServices.log(err, true, "Failed to send Verification code to your phone.");
            showMessage({ text: `Error: Failed to send Verification code to your phone.`, color: "red" });
          }
        }}
          disabled={!phoneNumber}
                    style={{
                        width: '80%',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        marginTop: 15,
                        width:"100%",
                        marginLeft:5,
                    }}
                >
                    <Text style={{
                        color: '#e74c3c',
                         fontSize: 14,
                          fontFamily:'m-bold'    
                    }}> Send Verification Code</Text>
      </TouchableOpacity>

      {codeSent && (<>
      <Text style={{ marginTop: 20 , fontFamily:"m-bold"}}>Enter Verification code</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 , fontFamily:"m-bold" }}
        editable={!!verificationId}
        placeholder="123456"
        keyboardType="phone-pad"
        onChangeText={setVerificationCode}
      />
      <TouchableOpacity
        disabled={!verificationId}
        onPress={async () => {
            let result = await FireBaseServices.mobileLogin(verificationId, verificationCode);
            if(result) {
              showMessage({ text: "Phone authentication successful 👍" });
              props.canShow(true, phoneNumber);
            } else {
              showMessage({ text: "Phone authentication failed" });
            }
        }}
            style={{
                        width: '80%',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        marginTop: 15,
                        width:"100%",
                        marginLeft:5,
                    }}
                >
                    <Text style={{
                        color: '#e74c3c',
                         fontSize: 14,
                          fontFamily:'m-bold'    
                    }}>Confirm Verification Code</Text>
        
        
        </TouchableOpacity></> )}
      
      {/* {message ? (
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, { backgroundColor: 0xffffffee, justifyContent: "center", marginTop:10 }]}
          onPress={() => showMessage(undefined)}>
          <Text style={{color: message.color || "blue", fontSize: 17, textAlign: "center", margin: 20, }}>
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : undefined} */}
    </View>
  );
}
