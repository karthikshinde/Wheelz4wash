    this.state = {
      calls: [
        {
          id: 1,
          name: "Customer Care Number",
          date: "+91 9494408744",
          dataType: "num",
          image: "https://bootdey.com/img/Content/avatar/avatar7.png",
        },
        {
          id: 2,
          name: "Customer Care EmailId",
          date: "wheelz4wash@gmail.com",
          dataType: "email",
          image: "https://bootdey.com/img/Content/avatar/avatar6.png",
        },
        {
          id: 3,
          name: "Supervisor",
          date: "+91 9032477277",
          dataType: "num",
          image: "https://bootdey.com/img/Content/avatar/avatar5.png",
        },
        {
          id: 4,
          name: "Manager",
          date: "+91 9494408744",
          dataType: "num",
          image: "https://bootdey.com/img/Content/avatar/avatar4.png",
        },
        {
          id: 5,
          name: "Technical problem",
          date: "+91 7675979097",
          dataType: "num",
          image: "https://bootdey.com/img/Content/avatar/avatar4.png",
        },
      ],
    };


isSubscribedForCurrentMonth = (carNo, data) => {
    console.log(carNo);
    let calender = new Date();
    let generateExpiry = new Date(
        calender.getFullYear(),
        calender.getMonth() + 1,
        0
    );
    data.expiryDate =
        generateExpiry.getDate() +
        "/" +
        generateExpiry.getMonth() +
        "/" +
        generateExpiry.getFullYear();

    let packageDetails = this.state.SubsriptionDetails[carNo];
    if (!this.isEmpty(packageDetails)) {
        if (
            packageDetails[calender.getFullYear()] &&
            packageDetails[calender.getFullYear()][calender.getMonth() + 1]
        ) {
            data.subscriptionActive = true;
            let currentMonthSubDetails =
                packageDetails[calender.getFullYear()][calender.getMonth() + 1];
            let userPack = this.state.usersPackages[
                currentMonthSubDetails.PackageID
            ];
            if (!this.isEmpty(userPack)) {
                data.completedCarWashes = currentMonthSubDetails.CarWashDone;
                data.remainingCarWashes =
                    userPack.PackWashes - currentMonthSubDetails.CarWashDone;
            }
        }
    }

    return data;
};



        {this.state.slotAvailable ? 
        <Banner
          visible={this.state.displaySlotBoard}
          actions={[
            {
              label: 'close',
              onPress: () => this.setState({ displaySlotBoard : false}),
            },
            {
              label: 'book',
              onPress: () => this.props.navigation.navigate("CarDetails", {
                userCarDetails: this.state.userData.CarDetails,
                AppartmentID: this.state.userDetails[0].AppartmentID,
                carSubscriptionDetails: this.state.userData.SubsriptionDetails,
              }),
            },
          ]}
          
          icon={({ size }) => (
            <Image
              source={{
                uri: 'https://img.icons8.com/ios-filled/50/000000/hourglass-sand-bottom.png',
              }}
              style={{
                width: 30,
                height: 30
              }}
            />
          )}>
            {this.state.slot.length >0 ? 
            <> 
              <Text style={{fontFamily:"m-bold", fontSize:20, color:"black"}}>Next available slot is from: {" "}</Text>
            <Text style={{ fontFamily: "m-bold", fontSize: 20, color: "black" }}>{this.state.slot[0].Date}{" "}{this.state.slot[0].Month}{" "}{this.state.slot[0].timings}</Text>
              </>
            : <Text style={{ fontFamily: "m-bold", fontSize: 20, color: "black" }}>loading available slot...</Text>
          }
          
    </Banner> : <Text></Text>}


  refresh = async () => {
    let owner = await firebase.auth().currentUser.uid;
    let data = [];
    let calender = new Date();
    let url = `${owner}/MyBookings`;

    //get all booking of current month
    let bookingDetails = await this.getDetails(url);

    console.log(bookingDetails);

    if(bookingDetails !== null && bookingDetails !== undefined) {
      //getting all latest bookings
       Object.keys(bookingDetails).forEach((each)=> {
           if(calender < new Date(bookingDetails[each].Year+"-"+bookingDetails[each].MonthNum+"-"+bookingDetails[each].Date)){
             data.push(bookingDetails[each]);
           }
      });

      if(bookingDetails.length > 0) {
        this.setState({bookingsAvailable : true});
      }
    }

    this.setState({ slot: data});
  }

  import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    Picker
} from 'react-native';
import firebase from "../keys/ApiKeys";
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { ActivityIndicator, Colors } from 'react-native-paper';
import MobileService from "../services/MobileService";
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../components/context';
import FireBaseServices from "../services/FireBaseServices";

const SignInScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        loading: false,
        showDetailsCard: false,
        loginToken:'',
        authenticationDone: false,
        appartentType:"",
    });

    const [appartmentList, setAppartmentList] = React.useState([]);
    const [appartmentListObj, setAppartmentListObj] = React.useState({});

    const { colors } = useTheme();

    const { signIn } = React.useContext(AuthContext);
    const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (pattern.test(String(val).toLowerCase())) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const startLoading =(signal)=>{
        if (signal) {
            setData({
                ...data,
                loading: true
            });
        } else {
            setData({
                ...data,
                loading: false
            });
        }
    }


    const loginHandle = (userName, password) => {

        if (userName.length == 0 || password.length == 0) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                { text: 'Okay' }
            ]);
            return;
        }
        startLoading(true);
        setTimeout(() => {
            firebase
                .auth()
                .signInWithEmailAndPassword(userName, password)
                .then((response) => {
                    signIn(response);
                })
                .catch((error) => {
                    Alert.alert(error.message);
                });
            startLoading(false);
        }, 500);
       // startLoading(false);
    }

    const shouldShowDetailsCard = async(canShow = false, errorMessage) => {
        if(canShow) {
            let isLive = await FireBaseServices.isUserAvailable();
            if(!isLive) {
                await getPickerWithApparmentDetails();
                setData({
                    ...data,
                    showDetailsCard: canShow,
                    authenticationDone: true
                });
            } else {
                await logMeIn();
            }
        }
    }

    const logMeIn = async() => {
        let uid = await String(FireBaseServices.getOwner());
        signIn(uid);
    }


    const getPickerWithApparmentDetails = async()=>{
        let response = await FireBaseServices.getAppartmentList();
        await setAppartmentListObj(response);
    }

    return (
        
      <View style={styles.container}>
            <StatusBar backgroundColor='#E74C3C' barStyle="light-content"/>
        <View style={styles.header}>

            {!data.authenticationDone && <Text style={styles.text_header}>Sign In / SignUp</Text>}
            {data.authenticationDone && <Text style={styles.text_header}> <FontAwesome 
                    name="check-circle"
                    color="white"
                    size={40}
                /> Verified</Text>}
            {data.authenticationDone && <Text style={{fontSize:14, fontFamily:"m-medium", color:"white"}}>Please fill the details to continue...</Text>}
            {data.loading ? <ActivityIndicator animating={true} color={Colors.red800} /> : <Text></Text>} 
        </View>
        {!data.authenticationDone && <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <MobileService canShow={shouldShowDetailsCard}> </MobileService>
        </Animatable.View>}
        {data.showDetailsCard && <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >

            <Text style={[styles.text_footer, {
                color: "black"
            }]}>Select your gated community/ Appartment</Text>
                        <Text style={[styles.text_footer, {
                color: "red",
                fontSize: 12,
                fontFamily:"m-medium"
            }]}>Note: if your gated community isn't present please select other.</Text>
            <View style={{ borderWidth:2, borderColor:"black", height: 50, margin:5}}>
           <Picker
              selectedValue={data.appartentType}
              style={{ width:"100%",marginLeft: 10}}
              onValueChange={(itemValue, itemIndex) =>
                setData({
                ...data,
                appartentType: itemValue 
               })
              }
            >       
            {Object.keys(appartmentListObj).map(each => (        
            <Picker.Item key={appartmentListObj[each].ID} label={appartmentListObj[each].NAME} itemStyle={{fontSize:15}} value={appartmentListObj[each].NAME} />
            ))}
            </Picker></View>
        
            <Text style={[styles.text_footer, {
                color: "black"
            }]}>Flat No:</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="building"
                    color="black"
                    size={20}
                />
                <TextInput 
                    placeholder="Eg: 304"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                
                <FontAwesome 
                    name="male"
                    color="black"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Name"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Please enter a valid email address.</Text>
            </Animatable.View>
            }
            

            {/* <Text style={[styles.text_footer, {
                color: "black",
                marginTop: 35
            }]}>Password</Text> */}
            <View style={styles.action}>
                <FontAwesome 
                    name="at"
                    color="black"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Email"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
            </View>
        <Text style={[styles.text_footer, {
                color: "black",
            }]}>Address</Text>
                        <View style={styles.action}>

                <FontAwesome 
                    name="home"
                    color="black"
                    size={25}
                />
                <TextInput 
                    placeholder="Eg: Flat no: 2A"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </Animatable.View>
            }
            

            {/* <TouchableOpacity>
                <Text style={{color: '#009387', marginTop:15}}>Forgot password?</Text>
            </TouchableOpacity> */}
            <View style={styles.button}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                    style={[styles.signIn, {
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#e74c3c'
                    }]}>Finish</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>}


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
        flex: 4,
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
    text_footer: {
        color: '#05375a',
        fontSize: 15,
        fontFamily:'m-bold'
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        fontFamily:'m-bold'
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
    }
  });
