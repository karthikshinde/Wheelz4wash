import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Picker,
  Alert, Modal, Pressable 
} from 'react-native';
import * as firebase from "firebase";
import GlobalAddCar from "../screens/GlobalAddCar.js";
import Booked from "../screens/Booked.js";
import DateTimePicker from '@react-native-community/datetimepicker';

export default class SpotBooking extends Component {

    state={
      showPicker : false,
      showTimer: false,
      date: new Date(),
      time: new Date(),
      mode: "Date",
      fixedTime:"",
      fixedDate:"",
      displayDate:"",
      diaplayTime:"",
      landMark:"",
      addressDetails:"",
      flatOrAddress:"",
    userArea:"",
    userAddress:"",
    userPin:"",
    userCity:"",
    userRegion:"",
    carDetails: [],
    isLoading: true,
    modalVisible: false,
    sModalVisible: false,
      Owner: firebase.auth().currentUser.uid,
    };

    saveDate = async(event, selectedDate) => {
      await this.disablePickers();
    const currentDate = selectedDate.toString().substring(0, 16);
        this.setState({fixedDate: currentDate});    
    }

    saveTime = async (event, date) => {
      await this.disablePickers();
      
        if (date !== undefined) {
        let time = date.toString().substring(17);
        this.setState({ fixedTime: time});
        }
    }

    disablePickers = () => {
        this.setState({showPicker: false});
        this.setState({showTimer: false});
    }

   componentDidMount = async() => {
    await this.getParmsFromNavigation();
    await this.reloadCars();
    await this.setState({isLoading : false});
    }

  getParmsFromNavigation= async()=>{
    const userArea = this.props.route.params.userArea;
    const userPin = this.props.route.params.userPin;
    const userAddress = this.props.route.params.userAddress;
    const userCity = this.props.route.params.userCity;
    const userRegion = this.props.route.params.userRegion;
    this.setState({ userArea});
    this.setState({ userPin});
    this.setState({ userAddress});
    this.setState({ userCity});
    this.setState({ userRegion});
  }

  getCarDetails = async () => {
    const eventref = firebase.database().ref("Users/"+this.state.Owner+"/CarDetails");
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setSuccModalVisible = (visible) => {
    this.setState({ sModalVisible: visible });
  }

  reloadCars = async()=> {
    let carDetails = await this.getCarDetails();
    let data = [];
    Object.keys(carDetails).forEach(e => {
        data.push(e);
    });
    await this.setState({carDetails : data});
  }

  reloadRequire = async(shouldReload)=>{
    if(shouldReload) {
      // await this.reloadCars();
      await this.componentDidMount();
      this.setState({modalVisible: false});
      this.setState({sModalVisible: true});
      setTimeout(()=>{
        this.setState({sModalVisible: false});
      }, 4000); 
    }
  }


  render() {
    const { modalVisible, sModalVisible } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          {/* <View style={styles.header}>
              <Text style={styles.headerTitle}>
                AT JUST 349/-
              </Text>
          </View> */}

          <View style={styles.postContent}>
            {/* <TouchableOpacity style={styles.shareButton} onPress={() => this.setModalVisible(true)}>
                <Text style={styles.shareButtonText}>Add New Car</Text>  
              </TouchableOpacity>  */}
            <Text style={styles.tags}>
              Select OR Add your vehicle:
            </Text>
            <View style={{ height:50, borderWidth: 2, borderColor:"black" , flexDirection:"row"}}>
            <Picker
              selectedValue={this.state.CarType}
              style={{ width:"80%",marginLeft: 10}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ CarType: itemValue })
              }
            >
            {/* <Picker.Item  label="Select Car" value="Select" style={{fontFamily:'m-bold'}}/> */}
            {this.state.carDetails.map(each =>(
                
            <Picker.Item key={each} label={each.toUpperCase()} itemStyle={{fontSize:15}} value={each} />
            ))}
       
            </Picker>
            <TouchableOpacity onPress={() => this.setModalVisible(true)}>
              <Image style={{width: 40, height: 40}}
              source={require("../assets/images/plus.png")}/>
            </TouchableOpacity>

              {/* <TouchableOpacity style={{width:"20%"}} onPress={() => this.setModalVisible(true)}>
                <Text style={styles.shareButtonText}>Add New Car</Text>  
              </TouchableOpacity>  */}
            </View>


            <Text style={styles.tags}>
              Enter Flat / Address:
            </Text>
            <TextInput
              style={styles.inputs}
              value={this.state.landMark}
              onChangeText={(val) => this.setState({ landMark: val })}
            />   

             <Text style={styles.tags}>
              Enter Nearby Landmark:
            </Text>
            <TextInput
              style={styles.inputs}
              value={this.state.flatOrAddress}
              onChangeText={(val) => this.setState({ flatOrAddress: val })}
            /> 
              {/* <TouchableOpacity style={{height: 50, borderWidth:2, borderColor:"#E74C3C", marginBottom:5}} onPress={() => {
                  this.setState({showPicker: true})
                  this.setState({showTimer: false})}
                  }>
              <Text style={[styles.tags, {color:"black", fontSize:15, marginLeft:5}]}>
              {this.state.fixedDate || "Select Date" } 
              </Text>
              </TouchableOpacity> */}

              <View style={{height: 100, flexDirection:"row"}}>
                <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
              <Text style={styles.tags}>
               Select Date: 
              </Text>
              <TouchableOpacity  onPress={() => {
                  this.setState({showPicker: true})
                  this.setState({showTimer: false})}
                  }>
              <Image style={{width: 80, height: 80}}
              source={require("../assets/images/date.png")}/>
              </TouchableOpacity>
                </View>
                <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
              <Text style={styles.tags}>
               Select Time: 
              </Text>
              <TouchableOpacity onPress={() => {
             this.setState({showPicker: false});
             this.setState({showTimer: true})}}>
              <Image style={{width: 80, height: 80}}
              source={require("../assets/images/time.png")}/>
              </TouchableOpacity>
                </View>
              </View>


            {/* <TextInput
              style={styles.inputs}
              onFocus ={() => this.setState({showPicker: true})}
              value={this.state.fixedDate}
              //onChangeText={(val) => this.setState({ location: val })}
            /> */}
              {/* <Text style={styles.tags}>
               Preferred Time: 
              </Text>
            <TouchableOpacity style={{height: 50, borderWidth:2, borderColor:"#E74C3C", marginBottom:5}} onPress={() => {
             this.setState({showPicker: false});
             this.setState({showTimer: true})}}>
              <Text style={[styles.tags, {color:"black", fontSize:15, marginLeft:5}]}>
              {this.state.fixedTime || "Select Time" } 
              </Text>
            </TouchableOpacity> */}

           {this.state.showPicker && 
            <DateTimePicker
            value={this.state.date}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            onChange={this.saveDate}
            />
           }

            {/* <Text style={styles.tags}>
               Select time:  
              </Text>
            <TextInput
              style={styles.inputs}
              onFocus ={() => this.setState({showTimer: true})}
              value={this.state.fixedTime}
            /> */}

           {this.state.showTimer && 
            (<DateTimePicker
            value={this.state.time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={this.saveTime}
            />)
           }


              {/* <Text style={styles.postDescription}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. 
              </Text>

              <Text style={styles.tags}>
                Lorem, ipsum, dolor, sit, amet, consectetuer, adipiscing, elit. 
              </Text>

              <Text style={styles.date}>
                2017-11-27 13:03:01
              </Text> */}

              <View style={styles.profile}>
                <Image style={styles.avatar}
                  source={{uri: 'https://img.icons8.com/color/240/000000/treasure-map.png'}}/>
               <View style={{flexDirection:"column"}}>
                <Text style={styles.name}>
                    <Text style={{fontFamily:"m-bold", color:"#e74c3c"}}>Date:</Text> {this.state.fixedDate || "No date specified" } 
                </Text>
                <Text style={styles.name}>
                     <Text style={{fontFamily:"m-bold", color:"#e74c3c"}}>Time:</Text> {this.state.fixedTime || "No time specified" } 
                </Text>
                 <Text style={styles.name}>
                    <Text style={{fontFamily:"m-bold", color:"#e74c3c"}}>Address:</Text> {this.state.userAddress}, {this.state.userArea}
                </Text>
                <Text style={styles.name}>
                    {this.state.userCity}, {this.state.userRegion}
                </Text>
                <Text style={styles.name}>
                    {this.state.userPin}
                </Text>       
               </View>

              </View>
              <TouchableOpacity style={styles.shareButton} onPress={() => this.componentDidMount()}>
                <Text style={styles.shareButtonText}>BOOK</Text>  
              </TouchableOpacity> 


<View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);
          }}
        >

          <View style={styles.centeredView}>
           <TouchableOpacity  style={{marginLeft:10 }}
                  onPress={() => this.setModalVisible(!modalVisible)}>
              <Image style={{width: 50, height: 50}}
              source={require("../assets/images/back.png")}/>
              </TouchableOpacity> 
            <GlobalAddCar reloadRequire={this.reloadRequire}></GlobalAddCar>
            {/* <View style={styles.modalView}>
              <GlobalAddCar></GlobalAddCar>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View> */}
                {/* <TouchableOpacity  
                  onPress={() => this.setModalVisible(!modalVisible)}>
              <Image style={{width: 80, height: 80}}
              source={require("../assets/images/back.png")}/>
              </TouchableOpacity>  */}
          </View>
        </Modal>

                <Modal
          animationType="slide"
          transparent={true}
          visible={sModalVisible}
          onRequestClose={() => {
            this.setSuccModalVisible(!sModalVisible);
          }}
        >
          
          <View style={styles.centeredView}>
          <Booked title="Your vehicle got added !" description="" showNext={false} imageNumber={1}></Booked>

              {/* <TouchableOpacity style={styles.shareButtonClose}  
                  onPress={() => this.setSuccModalVisible(!sModalVisible)}>
                <Text style={styles.shareButtonText}>Close</Text>  
              </TouchableOpacity>  */}
          </View>
        </Modal>

      </View>


          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  header:{
    padding:10,
    alignItems: 'center',
    backgroundColor: "#E74C3C",
  },
  headerTitle:{
    fontSize:30,
    color:"#FFFFFF",
    fontFamily:"m-bold"
  },
  postContent: {
    flex: 2,
    padding:20,
  },
  postTitle:{
    fontSize:26,
  },
  postDescription:{
    fontSize:16,
    marginTop:10,
  },
  tags:{
    color: '#E74C3C',
    marginTop:10,
    fontFamily:"m-medium",
    fontSize:12,
    marginBottom:5
  },
  date:{
    color: '#696969',
    marginTop:10,
  },
  avatar: {
    width: 80,
    height: 80,
    // borderRadius: 35,
    // borderWidth: 4,
    // borderColor: "#00BFFF",
  },
  profile:{
    flexDirection: 'row',
    marginTop:20,
    marginBottom:20,
    alignSelf:"center"
  },
  name:{
    fontSize:15,
    color:"black",
    fontWeight:'600',
    alignSelf:'center',
    marginLeft:10,
    fontFamily:"m-medium"
  }, 
  shareButton: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#e74c3c',
        borderWidth: 2,
        alignSelf:"center"
  },
    shareButtonClose: {
        width: '100%',
        height: 50,
        backgroundColor:"white",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#e74c3c',
        borderWidth: 2,
        alignSelf:"center",
        marginBottom:10
  },
  shareButtonText:{
        fontSize: 15,
        fontFamily:'m-bold',
         color: '#e74c3c',
  },
    inputs: {
    height: 45,
    fontFamily:'m-bold',
    fontSize:14,
    color: "black",
    borderWidth: 2,
    borderColor:"black",
    marginBottom:5,
    paddingLeft:5
  },
    centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    //marginTop: 22
    backgroundColor:"white"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
 