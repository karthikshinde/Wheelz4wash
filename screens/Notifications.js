import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import * as firebase from "firebase";
const { width, height } = Dimensions.get("window");

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      messages: [
        {
          id: 5,
          sent: false,
          msg:
            "Welcome to Wheelz4wash, Please feel free to contact us and give us feedback at any given time",
          image: "https://img.icons8.com/office/16/000000/checked.png",
        },
      ],
    };

    this.renderItem = this._renderItem.bind(this);
  }

  componentDidMount = async () => {
    let messages = this.state.messages;
    let response = await this.getNotifications();
    Object.keys(response).forEach((each) => {
      messages.push({
        id: each,
        sent: false,
        msg: response[each].message,
        image: "https://img.icons8.com/office/16/000000/checked.png",
      });
    });
    this.setState({ messages });
    console.log(res);
  };

  getNotifications = async (param) => {
    const eventref = firebase.database().ref("Notifications/");
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  _renderItem = ({ item }) => {
    if (item.sent === false) {
      return (
        <View style={styles.eachMsg}>
          <Image source={{ uri: item.image }} style={styles.userPic} />
          <View style={styles.msgBlock}>
            <Text style={styles.msgTxt}>{item.msg}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.rightMsg}>
          <View style={styles.rightBlock}>
            <Text style={styles.rightTxt}>{item.msg}</Text>
          </View>
          {/* <Image source={{uri: item.image}} style={styles.userPic} /> */}
        </View>
      );
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
          <FlatList
            style={styles.list}
            extraData={this.state}
            data={this.state.messages}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={this.renderItem}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width,
    height,
  },
  header: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#075e54",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
  },
  chatTitle: {
    color: "#fff",
    fontWeight: "600",
    margin: 10,
    fontSize: 15,
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  input: {
    flexDirection: "row",
    alignSelf: "flex-end",
    padding: 10,
    height: 40,
    width: width - 20,
    backgroundColor: "#fff",
    margin: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor: "#696969",
    borderWidth: 1,
  },
  eachMsg: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 5,
  },
  rightMsg: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 5,
    alignSelf: "flex-end",
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
  },
  msgBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: "#e74c3c",
    padding: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: "orange",
    padding: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  msgTxt: {
    fontSize: 15,
    color: "white",
    fontFamily:"m-bold"
  },
  rightTxt: {
    fontSize: 15,
    color: "#202020",
    fontWeight: "600",
  },
  headerText: {
    color: "black",
    fontSize: 25,
    marginBottom: 20,

    alignSelf: "center",
  },
});
