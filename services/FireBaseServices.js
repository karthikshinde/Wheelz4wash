import firebase from "../keys/ApiKeys";

class FireBaseServices {
    static uid = "";
    static enableLogs = true;
    static authTokenKey = "userToken";

    static requestDetails = async (reqUrl) => {
        try {
        const eventref = firebase.database().ref(reqUrl);
        const snapshot = await eventref.once("value");
        const value = snapshot.val();
        this.log("Got Details for: "+reqUrl);
        return value;
        } catch(e) {
            this.log(e, true, "Error: Requesting: " + reqUrl+" where uid is:"+ this.uid);
        }
    };

    static mobileLogin = async(verificationId, verificationCode) => {
        try{
            const credential = firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await firebase.auth().signInWithCredential(credential);
            this.log("Phone Authenticatione done.");
            return true;
        } catch(e) {
            this.log(e, true, "Failed to login (Mobile Service)");
            return false;
        }
    }

    static emailLogIn = async(userName, password) => {
        let result = await  firebase.auth()
                .signInWithEmailAndPassword(userName, password)
                .then(() => {
                    this.log("Email Authenticatione done.");
                    return true;
                })
                .catch((e) => {
                    this.log(e, true, "Failed to login (Email Service)");
                    return false;
                });
            return result;
       }

    static validateEmail = (email)=>{
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
      return re.test(String(email).toLowerCase());
    }

    static isEmpty = (val) => {
        if(val !== null && val !== undefined && val.length > 0) {
            return true;
        }
        return false;
    }

    static log = async(defaultErrorMessage, isError= false, customErrorMessage = "Not Specified") => {
        if(this.enableLogs) {
            if(isError) {
            console.log("ErrorStack: " + defaultErrorMessage);
            console.log("Custome Error: " + customErrorMessage);
            } else {
                console.log("Step: "+defaultErrorMessage+" successfully processed");
            }
        }
    }

static getCommunityAddressDetails = async(c_ID) => {
    return await this.requestDetails("AllCommunities/"+c_ID+"/AddressDetails");
}

static signUpUserData = async(data) => {
    let uid = await this.getOwner();
    let get_c_Data = (data.appartentType !== "Other") ? true : false;
    let c_Data = {};
    if(get_c_Data) {
       c_Data =  await this.getCommunityAddressDetails(data.appartentType);
    }

    let result = await firebase.database().ref("Users/"+uid+"/UserDetails/")
      .update({
        Email: data.email,
        Name: data.username,
        FlatOrHouseNo: data.flatNo,
        AppartmentID: data.appartentType,
        AppartmentName: data.appartmentN,
        Phone: data.mobileNumber,
        Address: get_c_Data ? c_Data.CAddress : data.address,
        AppartmentPinCode: get_c_Data ? c_Data.CPin : data.pincode,
        AppartmentArea: get_c_Data ? c_Data.CArea : data.area,
        City:"Hyderabad",
        uid: uid,
        live: true
      })
      .then(() => {
        this.log("Car details have been saved successfully");
        return true;
      })
      .catch((error) => {
        this.log("Error: Failed Saving SignUp Data", true, error);
        return false;
      });
      return result;

    }

    static getUserDetails = async () => {
        let uid = await this.getOwner();
        return await this.requestDetails(JSON.parse( JSON.stringify("Users/"+uid) ));
    };

    static getAppartmentList = async() => {
        return await this.requestDetails(JSON.parse( JSON.stringify("AllCommunitiesIDS/") ));
    }

    static getAuthToken = async (AsyncStorage) => {
        try{
        let userToken = await AsyncStorage.getItem("userToken");
        if(userToken === null) {
            this.log("AuthToken isn't available.")
        } else {
           this.log("AuthToken is available.") 
        }
        return userToken;
      } catch(e) {
        this.log(e, true, "Error while getting userToken"); 
      }
    }

    static setAuthToken = async (AsyncStorage, userToken) => {
        try{
            await AsyncStorage.setItem("userToken", userToken);
            if(userToken === null) {
                this.log("AuthToken isn't available to SET.")
            } else {
            this.log("AuthToken is SET.") 
            }
        } catch(e) {
            this.log(e, true, "Error while setting userToken");
        }

    }

    static isUserAvailable = async() => {
        let uid = await this.getOwner();
        let data =  await this.requestDetails(JSON.parse( JSON.stringify("Users/"+uid+"/UserDetails/live") ));
        if(data === null) {
            this.log("User isn't Live");
            return false;
        } else {
            this.log("User is Live");
            return true;
        }
    }

    static getOwner = async () => {
        let uid = await firebase.auth().currentUser.uid;
        this.uid = uid;
        return uid;
    };

}

export default FireBaseServices;