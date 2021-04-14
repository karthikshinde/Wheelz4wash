import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity , Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import MapView, { Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from "expo-location";
import smsClient from "../services/SMSClient";

class MapViews extends Component {


  constructor(props) {
    super(props);
      this.state ={
    dummy: {
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0021,
    },
    markerLocation:{},
    permissionsGranted: true,
    foundLocation: false,
    isLoading: true,
    userArea:"",
    userAddress:"",
    userPin:"",
    userCity:"",
    userRegion:"",
    Loc:""
  }
  }

  componentDidMount = async() => {
    try{
      let res =  smsClient.sendPartnerWelcomeMessage({name: "Ranjith", phone: "7675979097"});
      console.log(res);
    } catch(e) {
      console.log(e);
    }
   
    await this._getLocationAsync();
    this.setState({isLoading: false});
  }

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       permissionsGranted: false
     });
   }
   //Setting Google API KEY
  Location.setGoogleApiKey("AIzaSyD2Rkb3UUq0Xslkq5B2AB3BeddgMrcZ4Io");
  let markerLocation = await this.getCurrentLocation();
  this.setState({markerLocation: markerLocation });
  await this.getAddressFromCoordinates(markerLocation.latitude, markerLocation.longitude);
  this.setState({foundLocation : true});
 };

 setDetailsAfterLocationChange=async(place)=>{
  if(place!= undefined) {
     this.setState({userCity: place.city});
     this.setState({userAddress: place.name});
     this.setState({userArea: place.district});
      this.setState({userRegion: place.region});
     this.setState({userPin: place.postalCode});
     this.setState({Loc: place});
  }
 }

 getAddressFromCoordinates= async(lat, lon)=>{
   const place = await Location.reverseGeocodeAsync({
            latitude : lat,
            longitude : lon
        });
    await this.setDetailsAfterLocationChange(place[0]);
 }

 getCurrentLocation = async() => {
  let location = await Location.getCurrentPositionAsync({});
  this.setState({Loca : location});
  let mainLocation = this.state.dummy;
  mainLocation.latitude = location.coords.latitude;
  mainLocation.longitude = location.coords.longitude;
  return mainLocation;
 }

 onMarkerSelection = async(e) => {
   let coordinates = e.nativeEvent.coordinate;
   await this.setState({markerLocation : coordinates});
   await this.setState({region : coordinates});
   await this.getAddressFromCoordinates(coordinates.latitude, coordinates.longitude);
 }


 navigateToBook = ()=> {
   console.log(this.state.Loc);
  this.props.navigation.navigate("SpotBooking", {
    userArea: this.state.Loc.district,
    userAddress: this.state.Loc.name,
    userPin: this.state.Loc.postalCode,
    userCity: this.state.Loc.city,
    userRegion: this.state.Loc.region,
  });
 }

  render() {
    return (
      <>
        {this.state.isLoading ? 
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"white"}}>
        <Image
          style={{
            width: 300,
            height: 300,
          }}
          source={require("../assets/images/LocoMovingImage.gif")}
        />
        <Text style={{fontFamily:"m-bold", fontSize:15}}>Loading Your Location...</Text>
      </View>
        
         : 
      <>

      <View style={styles.container}>
        <MapView
        provider={PROVIDER_GOOGLE}
        onPress={(e) => this.onMarkerSelection(e)}
        style={styles.map}
        region={this.state.markerLocation}
        moveOnMarkerPress={true}
        showsUserLocation={true}
        >
          <>
    <Marker
    
    coordinate={this.state.markerLocation}
    >
      <Callout tooltip>
        <View style={{ width: 210, height:100, flexDirection:"row", backgroundColor:"white"}}>
          {/* <View style={{flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#e74c3c"}}>
        <Text style={{fontSize: 80}}><Image
          style={{
            width: 50,
            height: 50,
          }}
          resizeMode="cover"
          source={require("../assets/images/pinch.png")}
        /></Text>
          </View> */}
          <View style={{flexDirection:"column", flex: 1 , backgroundColor:"#e74c3c", justifyContent:"center", alignItems:"center"}}>
        <Text style={{fontFamily:"m-bold", fontSize:15, color:"white"}}>Location will be</Text>
        <Text style={{fontFamily:"m-bold", fontSize:15, color:"white"}}>updated on your</Text>
        <Text style={{fontFamily:"m-bold", fontSize:15, color:"white"}}> Pointer location change</Text>
          </View>

        </View>
       
      </Callout>
      
  </Marker>
  </>
  </MapView> 
      </View>
      <View style={styles.bottomPart}>
             <View style={{flexDirection:"row"}}>
                <Image style={{width:60, height:60}}
                  source={{uri: 'https://img.icons8.com/color/240/000000/treasure-map.png'}}/>
               <View style={{flexDirection:"column"}}>
                 <Text style={styles.name}>
                    {this.state.userAddress}, {this.state.userArea}
                </Text>
                <Text style={styles.name}>
                    {this.state.userCity}, {this.state.userRegion}
                </Text>
                <Text style={styles.name}>
                    {this.state.userPin}
                </Text>
               </View>

              </View>

                 {/* <Text style={[styles.textSign, {
                        color: '#e74c3c'
                    }]}>Address: <Text style={{color:"black"}}>{this.state.userAddress} {this.state.userArea}</Text></Text>
                 <Text style={[styles.textSign, {
                        color: '#e74c3c'
                    }]}>City: <Text style={{color:"black"}}>{this.state.userCity}</Text></Text>
                 <Text style={[styles.textSign, {
                        color: '#e74c3c'
                    }]}>State: <Text style={{color:"black"}}>{this.state.userRegion}</Text></Text>
                 <Text style={[styles.textSign, {
                        color: '#e74c3c'
                    }]}>Postal code: <Text style={{color:"black"}}>{this.state.userPin}</Text></Text> */}

              <View style={{flexDirection:"row"}}>
                  <TouchableOpacity
                    onPress={() => this.navigateToBook()}
                    style={[styles.signIn, {
                        //borderColor: 'white',
                        borderWidth: 2,
                        marginTop: 15,
                        width:"50%"
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: 'white',
                         fontSize: 14,
                    }]}>Confirm location</Text>
                </TouchableOpacity>
                          {/* <TouchableOpacity
                    onPress={() => console.log("")}
                    style={[styles.signIn, {
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        marginTop: 15,
                        width:"40%",
                        marginLeft:5,
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#e74c3c',
                         fontSize: 14,
                         
                    }]}>Enter Manually</Text>
                </TouchableOpacity> */}
              </View>

      </View>     
      </>} 
      </>
    );
  }
};

export default MapViews;

const styles = StyleSheet.create({
  container: {
    height: (Dimensions.get('window').height*60/100),
    backgroundColor:"#E74C3C",
  },
  bottomPart:{
    height: (Dimensions.get('window').height*30/100),
    // borderColor:"#E74C3C",
    // borderWidth:2,
    backgroundColor:"#E74C3C",
    // borderTopLeftRadius:30,
    // borderTopRightRadius:30,
    justifyContent:"center",
    alignItems:"center",
    margin:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  openButton: {
    width: "80%",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    borderWidth: 2,
    borderColor: "black"

  },
  name:{
    fontFamily:"m-bold",
    fontSize: 15,
    color:"white"
  },
  textStyle: {
    color: "black",
    fontFamily: "m-bold",
    textAlign: "center",
  },
    map: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height*80/100),
  },
      signIn: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor:"black"
    },
    textSign: {
        fontSize: 15,
        fontFamily:'m-bold'
    },
    inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
    fontFamily:'m-bold',
    fontSize:18,
    color: "black",
  },
});
