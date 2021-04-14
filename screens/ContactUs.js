import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Linking,
} from "react-native";

export default class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calls: [
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
        }
      ],
    };
  }

  clickEventListener(item) {
    if (item.dataType === "num") {
      this.dialCall(item.date);
    } else {
      this.sendEmail();
    }
    //
    // Alert.alert("Please Contact customer care for any change in your Data")
  }

  sendEmail = () => {
    let url = "mailto:wheelz4wash@gmail.com?subject=SendMail&body=Description";
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  dialCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = "tel:${" + number + "}";
    } else {
      phoneNumber = "telprompt:${" + number + "}";
    }
    Linking.openURL(phoneNumber);
  };

  renderItem = ({ item }) => {
    var callIcon = "https://img.icons8.com/color/48/000000/phone.png";
    if (item.video == true) {
      callIcon = "https://img.icons8.com/color/48/000000/video-call.png";
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#170051" }}>
        <TouchableOpacity
          style={{ backgroundColor: "white" }}
          onPress={() => {
            this.clickEventListener(item);
          }}
        >
          <View style={styles.row}>
            {/* <Image source={{ uri: item.image }} style={styles.pic} /> */}
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameTxt}>{item.name}</Text>
              </View>
              <View style={styles.end}>
                {/* <Image
                  style={[
                    styles.icon,
                    { marginLeft: 15, marginRight: 5, width: 14, height: 14 },
                  ]}
                  source={{ uri: item.image }}
                /> */}
                <Text style={styles.time}>{item.date}</Text>
              </View>
            </View>
            {/* <Image style={[styles.icon, { marginRight: 50 }]} source={{uri: callIcon}}/> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <FlatList
          extraData={this.state}
          data={this.state.calls}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 270,
  },
  nameTxt: {
    marginLeft: 15,
    fontFamily:"m-bold",
    color: "#e74c3c",
    fontSize: 20,
  },
  mblTxt: {
    fontWeight: "200",
    color: "black",
    fontSize: 15,
  },
  end: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    color: "black",
    fontFamily:"m-bold",
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    height: 28,
    width: 28,
  },
});
