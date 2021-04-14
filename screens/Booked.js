import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text
} from 'react-native';

export default class Booked extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      showNext: true,
      imageNumber : 0
    }
  }

  componentDidMount = async () => {
    let title = undefined;
    let description = undefined;
    let showNext = true;
    let imageNumber = 0;
    if(this.props && this.props.route && this.props.route.params){
      title = this.props.route.params.title;
      description = this.props.route.params.description;
    } else {
      title = this.props.title;
      description = this.props.description;
      showNext = this.props.showNext; 
      imageNumber = this.props.imageNumber;   
    }

   if (title !== undefined && description !== undefined) {
      this.setState({ title });
      this.setState({ description });
      showNext !== undefined && this.setState({ showNext });
      imageNumber !== undefined && this.setState({ imageNumber });
    }
    
  }

  getImageByNumber = (numb = 0) =>{
   switch(numb) {
     case 1: return (<Image style={styles.icon} source={require("../assets/images/success.gif")} />);
     default: return (<Image style={styles.icon} source={{ uri: "https://img.icons8.com/color/480/000000/ok--v1.png" }} />);
   }
  }

  render() {
    return ( 
      <View style={styles.container}>
        {this.getImageByNumber(this.state.imageNumber)}
        <Text style={styles.title}>{this.state.title}</Text>
        <Text style={styles.description}>{this.state.description}</Text>
        <View style={{ alignSelf: 'center' }}>
          {this.state.showNext && 
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")} style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Continue</Text>
          </TouchableOpacity> }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 50,
  },
  icon: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 22,
    color: "#5F6D7A",
    fontFamily:"m-bold"

  },
  description: {
    marginTop: 20,
    textAlign: 'center',
    color: "#A9A9A9",

    fontSize: 16,
    margin: 40,
    fontFamily: "m-bold"
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#e74c3c",

  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily:'m-bold'

  },
  shareButton: {
    height: 40,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "#e74c3c",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 15,

  }
});