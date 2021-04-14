import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, Image } from 'react-native';

import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

import { scrollInterpolator, animatedStyles } from '../utils/animation.js';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

const DATA = [
          {
          id: 1,
          title: "SELECT LOCATION",
          description: "You can be in any corner, we are here to assist you. You can avail our serice by just sharing you location. we will auto detect your location to reduce human efforts., ",
          display: "Profile",
          color: "#f0f8ff00",
          width: 150,
          height:"80%",
          members: "",
          showSteps: true,
          image: require("../assets/images/slider/down1.png"),
          imgUri: require("../assets/images/slider/selectLocation.png"),
        },
        {
          id: 2,
          title: "BOOK SLOT",
          description: "You can be in any corner, we are here to assist you. You can avail our serice by just sharing you location. we will auto detect your location to reduce human efforts., ",
          display: "Profile",
          color: "#f0f8ff00",
          width: 150,
          height:"80%",
          members: "",
          showSteps: false,
          image: require("../assets/images/slider/down2.png"),
         imgUri: require("../assets/images/slider/bookCar.png"),
        },
                {
          id: 3,
          title: "WASHING",
          description: "You can be in any corner, we are here to assist you. You can avail our serice by just sharing you location. we will auto detect your location to reduce human efforts., ",
          display: "Profile",
          color: "#f0f8ff00",
          width: 200,
          height:"80%",
          members: "",
          showSteps: false,
          image: require("../assets/images/slider/down3.png"),
         imgUri: require("../assets/images/slider/washing.png"),
        },
           
];


export default class Slider extends Component {
  
  state = {
    index: 0
  }

  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this)
  }

  _renderItem({ item }) {
    return (
      <View style={styles.itemContainer}>
        <View style={{flex: 2}}>
           <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
             {item.showSteps &&
             <>
              <Text style={{fontFamily:"m-medium", fontSize:30, color:"#E74C3C"}}>Get your Car Wash</Text>
              <Text style={{fontFamily:"m-medium", fontSize:30, color:"#E74C3C"}}> In</Text>
          <Text style={{fontFamily:"m-bold", fontSize:30, color:"#E74C3C"}}>3 Simple Steps</Text>
          </>}
         {!item.showSteps && <Text style={{fontFamily:"m-bold", fontSize:40, color:"#E74C3C"}}> Step {item.id}</Text>}
          </View>
          <View style={{flex: 2, justifyContent:"center", alignItems:"center"}}>
            <Image  source={item.imgUri}
            style={{width: item.width, height: item.height}}
            resizeMode="stretch" />
          </View>
          <View style={{flex: 1, alignItems:"center"}}>
             <Text style={styles.itemLabel}>{item.title}</Text>
             <View style={{paddingLeft:20,paddingRight:20, justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontFamily:"m-medium", fontSize:14, alignSelf:"center", color:"grey"}}>{item.description}</Text>
             </View>
          </View>
        </View>       
      </View>
    );
  }
  
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{flex:10}}>
        <Carousel
          ref={(c) => this.carousel = c}
          data={DATA}
          renderItem={this._renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
          onSnapToItem={(index) => this.setState({ index })}
          scrollInterpolator={scrollInterpolator}
          slideInterpolatedStyle={animatedStyles}
          useScrollView={true}          
        />
        </View>
        <View style={{flex:1}}>
         <Image  source={DATA[this.state.index].image}
            style={{width: 100, height: 50, alignSelf:"center"}}
            resizeMode="stretch" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  carouselContainer: {
  },
  itemContainer: {
    width: "100%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  itemLabel: {
    color: 'black',
    fontSize: 24,
    fontFamily:"m-bold"
  }
});
