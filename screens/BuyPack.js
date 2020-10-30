import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
  TouchableHighlight,
  Modal,
} from "react-native";
import * as firebase from "firebase";

export default class BuyPack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      userSelected: [],
      carID: "",
      packs: [],
      currentPackName: "",
      currentPackWashes: "",
      currentPackPrice: "",
      currentPackDescription: "",
    };
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    const carID = this.props.route.params.carID;
    this.setState({ carID });

    let packs = [];
    const response = await this.getPackages();
    Object.keys(response).forEach((each) => {
      packs.push(response[each]);
    });
    this.setState({ packs });
  };

  getPackages = async () => {
    const eventref = firebase.database().ref("PackageDetails/");
    const snapshot = await eventref.once("value");
    const value = snapshot.val();
    return value;
  };

  setModalVisible = async (
    value,
    currentPackName,
    currentPackWashes,
    currentPackPrice,
    currentPackDescription
  ) => {
    this.setState({ currentPackName });
    this.setState({ currentPackWashes });
    this.setState({ currentPackPrice });
    this.setState({ currentPackDescription });
    this.setState({ modalVisible: value });
  };

  gotoGatWay = (packName, packID, amount) => {
    console.log(packName);
    this.props.navigation.navigate("Gatway", {
      packName: packName,
      packageID: packID,
      amount: amount,
      carID: this.state.carID,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {/* About us Stsrts here */}
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              color: "black",
              fontSize: 30,
              alignSelf: "center",
              marginBottom: 10,
              fontFamily:'m-bold'
            }}
          >
            Browse Plans
          </Text>
          <Text
            style={{
              color: "#E74C3C",
              fontSize: 45,
              alignSelf: "center",
              marginTop: -55,
            }}
          >
            _____
          </Text>
          <ScrollView horizontal={false}>
            {this.state.packs.map((each) => (
              <View
                key={each.PackageID}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 300,
                    height: 200,
                    borderColor: "#E74C3C",
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderWidth:3,
                    borderTopLeftRadius:30,
                    borderBottomRightRadius:30,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.0,

                    elevation: 24,
                  }}
                >
                  <View style={{ flex: 1, marginTop: 20 }}>
                    <Text style={styles.packName}>{each.PackName}</Text>
                    <Text style={styles.headerText4}>
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                        source={{
                          uri: "https://img.icons8.com/material/64/000000/rupee--v1.png",
                        }}
                      />{" "}
                      {each.PackAmount} / Month
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      width: 250,
                      height: 200,
                      alignSelf: "center",
                      marginBottom: 10,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.setModalVisible(
                            true,
                            each.PackName,
                            each.PackWashes,
                            each.PackAmount,
                            ""
                          )
                        }
                        style={styles.shareButton}
                      >
                        <Text style={styles.shareButtonText}>Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          this.gotoGatWay(each.PackName, each.PackageID, 1)
                        }
                        style={styles.shareButton}
                      >
                        <Text style={styles.shareButtonText}>Buy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.hearderText}>WHAT YOU GET</Text>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Image
                  style={{
                    width: 300,
                    height: 300,
                  }}
                  source={require("../assets/images/features.png")}
                />
                <View style={{ flexDirection:'row' }}>
                  <Text style={styles.modalText}>
                    {this.state.currentPackWashes} Interior and Exterior{" "}
                  </Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    source={{
                      uri:
                        "https://img.icons8.com/metro/26/000000/checked-2.png",
                    }}
                  />
                </View>
                <View style={{ flexDirection:'row' }}>
                  <Text style={styles.modalText}>Full month car clean{" "}</Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    source={{
                      uri:
                        "https://img.icons8.com/metro/26/000000/checked-2.png",
                    }}
                  />
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.modalText}>24/7 Support{" "}</Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    source={{
                      uri:
                        "https://img.icons8.com/metro/26/000000/checked-2.png",
                    }}
                  />
                </View>
              </View>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "white" }}
                onPress={() => {
                  this.setModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  shareButton: {
    marginTop: 10,
    height: 40,
    marginRight: 2,
    width: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#E74C3C",
    marginLeft: 10,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily:"m-bold"
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor: "white",
    marginTop: 5,
  },
  listContainer: {
    alignItems: "center",
  },
  /******** card **************/
  card: {
    marginHorizontal: -10,
    marginVertical: 10,
    flexBasis: "48%",
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 60,
    width: 60,
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    flex: 1,
    color: "black",

    alignSelf: "center",
  },
  subTitle: {
    fontSize: 12,
    flex: 1,
    color: "black",
    marginLeft: 25,
  },
  icon: {
    height: 20,
    width: 20,
  },
  headerText: {
    color: "black",
    fontSize: 30,

    marginTop: 40,
    alignSelf: "center",
  },
  headerText2: {
    color: "white",
    fontSize: 13,

    alignSelf: "center",
  },
  subHeading: {
    color: "black",
    fontSize: 15,

    alignSelf: "center",
  },
  headerText4: {
    color: "black",
    fontSize: 35,

    alignSelf: "center",
    marginTop: 10,
    fontFamily:'m-bold'
  },
  packName: {
    color: "black",
    fontSize: 20,

    alignSelf: "center",
    marginTop: 10,
    fontFamily: 'm-bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    height: "100%",
    margin: 20,
    backgroundColor: "white",
    borderColor:"#E74C3C",
    borderWidth:5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    width:"100%",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    borderWidth:2,
    borderColor:"#E74C3C"

  },
  textStyle: {
    color: "black",
    fontFamily:"m-bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: "center",
    color: "black",
    fontFamily:'m-bold'
  },
  hearderText: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: "center",
    color: "black",
    fontFamily: 'm-bold'
  },
});
