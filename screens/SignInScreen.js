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
    Picker,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Colors } from 'react-native-paper';
import MobileService from "../services/MobileService";
import { useTheme, RadioButton } from 'react-native-paper';
import { AuthContext } from '../components/context';
import FireBaseServices from "../services/FireBaseServices";
import { ScrollView } from 'react-native-gesture-handler';

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
        appartmentN:"",
        mobileNumber: 0,
        flatNo:"",
        area:"",
        city:"",
        pincode:"",
        email:"",
        address:"",
        appartmentName:"",
        selectedStayType: true,
        citySelected: false,
        cityName:"",
        hydSelected: true,
        vijaywadaSelected: false,
        bangaloreSelected: false,
        vizagSelected:false,
        chennaiSelected: false
    });

    const [appartmentListObj, setAppartmentListObj] = React.useState({});
    const { colors } = useTheme();
    const { signIn } = React.useContext(AuthContext);

    const selectedCity = async(city) => {
        FireBaseServices.log("City Selected "+city);
        await setData({...data, 
            hydSelected: city === "Hyderabad" ? true : false,
            vijaywadaSelected: city === "Vijayawada" ? true : false,
            vizagSelected: city === "Vizag" ? true : false,
            bangaloreSelected: city === "Bengaluru" ? true : false,
            chennaiSelected: city === "Chennai" ? true : false
        });
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



    const shouldShowDetailsCard = async(canShow = false, mobile) => {
        if(canShow) {
            let isLive = await FireBaseServices.isUserAvailable();
            if(!isLive) {
                await getPickerWithApparmentDetails();
                setData({
                    ...data,
                    showDetailsCard: canShow,
                    authenticationDone: true,
                    mobileNumber: mobile
                });
            } else {
              logMeIn();
            }
        }
    }

    const logMeIn = async() => {
        let uid = await String(FireBaseServices.getOwner());
        signIn(uid);
    }

    const signUpUser = async() => {
        let validationStatus = await validateUserData();
        FireBaseServices.log("Validating user inputs, Status: "+validationStatus)
        if(validationStatus) {
            let result = await FireBaseServices.signUpUserData(data);
            if(result) {
                logMeIn();
            }         
        } 
    }

    const validateUserData = async() => {
        let canProceed = true;
        let isEmailValidated  = FireBaseServices.validateEmail(data.email);
        if(!isEmailValidated) {
            canProceed = false;
            Alert.alert("Please check the email you have entered.");
        } else if(!FireBaseServices.isEmpty(data.username)) {
            canProceed = false;
            Alert.alert("Please enter your Name.");
        }  else if(!FireBaseServices.isEmpty(data.flatNo)) {
            canProceed = false;
            Alert.alert("Please enter your villa/House/Flat Number.");
        } else if(data.appartentType === "Other") {
            if(!FireBaseServices.isEmpty(data.area)) {
            canProceed = false;
            Alert.alert("Please enter your area.");
            } else if(!FireBaseServices.isEmpty(data.pincode)) {
            canProceed = false;
            Alert.alert("Please enyer your pincode.");
            } else if(!FireBaseServices.isEmpty(data.address)) {
            canProceed = false;
            Alert.alert("Please enter your address.");
            }
        } 

        return canProceed;
    }

    const getPickerWithApparmentDetails = async()=>{
        let response = await FireBaseServices.getAppartmentList();
        await setAppartmentListObj(response);
    }

    return (
        
      <View style={[styles.container,{backgroundColor: data.authenticationDone ? (data.citySelected ? "#E74C3C": (data.hydSelected ? "#3f474e":"#E74C3C" ) ) :'#E74C3C'}]}>
            <StatusBar backgroundColor={data.authenticationDone ? (data.citySelected ? "#E74C3C": (data.hydSelected ? "#3f474e":"#E74C3C" )) :'#E74C3C'} barStyle="light-content"/>
        <View style={styles.header}>

            {!data.authenticationDone && <Text style={styles.text_header}>Sign In / SignUp</Text>}
            {data.authenticationDone && <><Text style={styles.text_header}> <FontAwesome 
                    name="check-circle"
                    color="white"
                    size={40}
                /> Mobile Verified</Text>
                <Text style={styles.text_header}> <FontAwesome 
                    name= {data.citySelected ? "check-circle" : "circle"}
                    color="white"
                    size={40}
                /> Select City</Text>
                
                </>}
            {/* {data.authenticationDone && <Text style={{fontSize:14, fontFamily:"m-medium", color:"white"}}>Please fill the details to continue...</Text>} */}
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


        {(data.showDetailsCard && !data.citySelected) && <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <View style={{flex: 1}}>
            <View style={{ flex:1, alignSelf:"center", flexDirection:"row"}} >
                <View style={{flex: 1, flexDirection:"column"}}>
                                  <Image
                style={{ width: 80, height: 100 , alignSelf:"center"}}
                resizeMode="stretch"
               source={require("../assets/images/cities/hyd.png")}
              />
              <View style={{flexDirection: "row", marginLeft:"10%"}}>
                                      <RadioButton
                    value="Hyderabad"
                    label="Hyderabad"
                    status={data.hydSelected ? 'checked' : 'unchecked'}
                    onPress={() => selectedCity("Hyderabad")}
                /> 
                    <Text style={{fontFamily:"m-bold", fontSize: 15, marginTop:5}}>Hyderabad</Text>

              </View>
  
                    </View>

                    <View style={{flex: 1}}>
                 <Image
                style={{ width: 100, height: 100, alignSelf:"center"}}
               source={require("../assets/images/cities/bengaluru.png")}
              />
                <View style={{flexDirection: "row", marginLeft:"10%"}}>
                                            <RadioButton
                        value="Bengaluru"
                        label="Bengaluru"
                        status={data.bangaloreSelected ? 'checked' : 'unchecked'}
                        onPress={() => selectedCity("Bengaluru")}
                    /> 
                    <Text style={{fontFamily:"m-bold", fontSize: 15, marginTop:5}}>Bengaluru</Text>
                    
                    </View> 
                    </View> 
                    </View>


            <View style={{ flex:1, alignSelf:"center", flexDirection:"row"}} >
                <View style={{flex: 1, flexDirection:"column"}}>
            <Image
                style={{ width: 80, height: 100 , alignSelf:"center"}}
                resizeMode="stretch"
               source={require("../assets/images/cities/vizag.png")}
              />
              <View style={{flexDirection: "row", marginLeft:"10%"}}>
                <RadioButton
                    value="Vizag"
                    status={data.vizagSelected ? 'checked' : 'unchecked'}
                    onPress={() => selectedCity("Vizag")}
                /> 
                    <Text style={{fontFamily:"m-bold", fontSize: 15, marginTop:5}}>Vizag</Text>

              </View>
  
                    </View>
                    
                    <View style={{flex: 1}}>
                 <Image
                style={{ width: 80, height: 100, alignSelf:"center"}}
               source={require("../assets/images/cities/chennai.png")}
              />
                <View style={{flexDirection: "row", marginLeft:"10%"}}>
                                            <RadioButton
                        value="Chennai"
                        status={data.chennaiSelected ? 'checked' : 'unchecked'}
                        onPress={() => selectedCity("Chennai")}
                    /> 
                    <Text style={{fontFamily:"m-bold", fontSize: 15, marginTop:5}}>Chennai</Text>
 
                    </View>
                    </View> 
                    </View>
            {data.hydSelected && <View style={styles.button}>
                <TouchableOpacity
                    onPress={() => setData({...data, citySelected: true})}
                    style={[styles.signIn, {
                        borderColor: 'black',
                        borderWidth: 2,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: 'black'
                    }]}>Next</Text>
                </TouchableOpacity>
            </View>}

            {!data.hydSelected && <View style={styles.button}>
                <TouchableOpacity
                    style={[styles.signIn, {
                        borderColor: '#E74C3C',
                        borderWidth: 2,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#E74C3C'
                    }]}>Coming Soon</Text>
                </TouchableOpacity>
            </View>}

            </View>
        </Animatable.View>}

        

        {(data.showDetailsCard && data.citySelected) && <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <ScrollView showsVerticalScrollIndicator={false} >
            <View style={{marginBottom: 10}}>
            <Text style={[styles.text_footer, {
                color: "black",
            }]}>Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user"
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
                   onChangeText={(val) => setData({...data, username: val })}
                />
            </View>
            </View>

            <View style={{marginBottom: 10}}>
            <Text style={[styles.text_footer, {
                color: "black",
            }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="envelope"
                    color="black"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Email"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                   onChangeText={(val) => setData({...data, email: val })}
                   //onEndEditing={(e)=>validEmail(e.nativeEvent.text)}
                />
            </View>
            </View>

             <View style={{ width: "100%", height: 50 , alignSelf:"center", flexDirection:"row"}} >
             <View style={{flexDirection: "row"}}>
                    
                    <RadioButton
                    value="first"
                    label="Individual House"
                    status={data.selectedStayType ? 'checked' : 'unchecked'}
                    onPress={() => setData({...data, selectedStayType : true})}
                /> 
                <Text style={{fontFamily:"m-medium", fontSize: 12, marginTop:5}}>Individual House</Text>
              </View>
                <View style={{flexDirection: "row"}}>
                     <RadioButton
                    value="first"
                    label="Apartment/Gated Community"
                    status={data.selectedStayType ? 'unchecked' : 'checked'}
                    onPress={() => setData({...data, selectedStayType : false})}
                /> 
                <View style={{flexDirection:"column"}}>
                    <Text style={{fontFamily:"m-medium", fontSize: 12, marginTop:5}}>Apartment /</Text>
                    <Text style={{fontFamily:"m-medium", fontSize: 12, marginTop:5}}>Gated Community</Text>
                </View>
                
              </View>
             </View>


       {!data.selectedStayType && 
       <View style={{marginBottom:10}}>
           <Text style={[styles.text_footer, {
                color: "black"
            }]}>Select your Apartment / Gated Community </Text>

         <View style={styles.inputContainer}>
             <View style={{flex:3}}>
           <Picker
              selectedValue={data.appartmentN}
              style={{marginLeft: 10, fontSize:10}}
              itemStyle={{fontSize: 10}}
              onValueChange={async(itemValue, itemIndex) => {
                await setData({
                    ...data,
                    appartentType: Object.keys(appartmentListObj)[itemIndex],
                    appartmentN: itemValue
                });
               }
              }
            >
            {Object.keys(appartmentListObj).map(each => (        
            <Picker.Item key={appartmentListObj[each].ID} label={appartmentListObj[each].NAME} itemStyle={{fontSize:10, fontFamily:"m-bold"}} value={appartmentListObj[each].NAME} />
            ))}
            {/* <Picker.Item fontFamily="m-bold" label="Other / Not Listed"  value="Other" />   */}
            </Picker>
 
            </View>
            </View>
            <Text style={[styles.text_footer, {
                color: "red",
                fontSize: 12,
                fontFamily:"m-medium"
            }]}>Note: If your Apartment / Gated Community isn't present please select "other".</Text>
          </View>}


            {(data.appartentType === "Other" || data.selectedStayType) ?  <><Text style={[styles.text_footer, {
                color: "black",
            }]}>{data.selectedStayType ? "House Name" : "Provide Apartment / Gated Community Name"}</Text>

            <View style={[styles.action,{marginBottom:5}]}>
                <FontAwesome 
                    name="building"
                    color="black"
                    size={20}
                />
                <TextInput 
                    placeholder={data.selectedStayType ? "House Name" : "Apartment Name"}
                    placeholderTextColor="#666666"
                    //secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => setData({...data, appartmentName: val })}
                />
            </View>
            
            </> :   undefined}
            
     <View style={{width:"100%",flexDirection:"row"}}>
         <View style={{flexDirection:"column", flex:1}}>
            <Text style={[styles.text_footer, {
                color: "black"
            }]}>{data.selectedStayType ? "House Number" : "Flat / Villa Number"}</Text>
                <View style={{flexDirection:"row", paddingTop:10}}>
                <MaterialCommunityIcons 
                    name="door"
                    color="black"
                    size={25}
                />
                <TextInput 
                    placeholder={data.selectedStayType ? "Ex: 1-3/A/302" : "Ex: Block A/ 304"}
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => setData({...data, flatNo: val })}
                    //onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                </View>
                </View>
            { (data.appartentType === "Other" || data.selectedStayType) && <View style={{flexDirection:"column", flex:1}}>
            <Text style={[styles.text_footer, {
                color: "black"
            }]}>Area / Street</Text>
                <View style={{flexDirection:"row",padding:10}}>
                <FontAwesome 
                    name="street-view"
                    color="black"
                    size={25}
                />
                <TextInput 
                    placeholder="Ex: Manikonda"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                      color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => setData({...data, area: val })}
                    //onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                </View>
                </View>}
            </View>
            
        <View style={{width:"100%",flexDirection:"row"}}>
        {/* <View style={{flexDirection:"column", flex:1}}>
            <Text style={[styles.text_footer, {
                color: "black"
            }]}>City:</Text>
                <View style={{flexDirection:"row", padding:10}}>
                <FontAwesome 
                    name="building"
                    color="black"
                    size={25}
                />
                <TextInput 
                    placeholder="Ex: Hyderabad"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => setData({...data, city: val })}
                    //onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                </View>
                </View> */}
            {(data.appartentType === "Other" || data.selectedStayType )&&<View style={{flexDirection:"column", flex:1}}>
            <Text style={[styles.text_footer, {
                color: "black"
            }]}>Pincode</Text>
                <View style={{flexDirection:"row",paddingTop:10, paddingBottom:10}}>
                <FontAwesome 
                    name="map-pin"
                    color="black"
                    size={25}
                />
                <TextInput 
                    placeholder="Ex: 500082"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                      color: "black"
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => setData({...data, pincode: val })}
                   // onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                </View>
                </View>}
            </View>

        { (data.appartentType === "Other" || data.selectedStayType) && <View>
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
                    placeholder="Ex: Road no: 10, 182/A , Manikonda."
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: "black"
                    }]}
                    autoCapitalize="none"
                    numberOfLines={2}
                    onChangeText={(val) => setData({...data, address: val })}
                />
            </View>
            </View>}



            <View style={styles.button}>
                <TouchableOpacity
                    onPress={() => signUpUser()}
                    style={[styles.signIn, {
                        borderColor: '#E74C3C',
                        borderWidth: 2,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#E74C3C'
                    }]}>Finish</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </Animatable.View>}


      </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 10
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
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 12,
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
        fontFamily:"m-medium",
        fontSize:12,
        paddingTop: 5
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        fontFamily:'m-bold'
    },
    button: {
        alignItems: 'center',
        marginTop: 10
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
    inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderBottomWidth: 1,
    height: 45,
    width:"100%",
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 5,

    elevation: 5,
  },
  });
