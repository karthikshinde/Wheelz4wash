import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { DataTable } from 'react-native-paper';

import { Icon } from "expo";
import * as firebase from "firebase";

export default class Gatway extends React.Component {
  state = {
    showModal: false,
    ack: "",
    ORDER_ID: "",
    TXN_AMOUNT: "",
    CUST_ID: "ChickenDinner",
    availableBalance: "",
    camFromJoin: false,
    Owner: firebase.auth().currentUser.uid,
    CAR_ID: "",
    packName: "****",
    packageID: "",
  };

  componentDidMount() {
    const TXN_AMOUNT = this.props.route.params.amount;
    const CAR_ID = this.props.route.params.carID;
    const packName = this.props.route.params.packName;
    const packageID = this.props.route.params.packageID;
    this.setState({ TXN_AMOUNT });
    this.setState({ CAR_ID });
    this.setState({ packName });
    this.setState({ packageID });
    this.setOrderID();
  }

  setOrderID = () => {
    const uuidv1 = require("uuid/v1");
    let TransactionId = uuidv1();
    this.setState({ ORDER_ID: TransactionId });
  };

  updateUserWallet = async () => {
    let currentDateandTime = new Date();
    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/UserWallet/Transactions/Debit/" +
          this.state.ORDER_ID
      )
      .update({
        TID: this.state.ORDER_ID,
        PaymentMODE: "Paytm",
        TTime: currentDateandTime,
        TAmount: this.state.TXN_AMOUNT,
        Action: "minus",
        TReason: "Buying a pack for his/her car",
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  updateSubscriptionDetails = async () => {
    let expiryDate = await this.getExpiryDate();
    let currentDateandTime = new Date();
    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/SubsriptionDetails/" +
          this.state.CAR_ID
      )
      .update({
        CarWashDone: 0,
        PackageID: this.state.packageID,
        expiry: expiryDate
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  getExpiryDate = async()=> {
    let calender = new Date();
    let nextMonthEndDate = new Date(calender.getFullYear(),calender.getMonth()+2,0);
    let nextMonth = calender.getMonth() === 11 ? 1 : calender.getMonth()+2;
    let expiry = new Date(calender.getFullYear() + "-" +nextMonth+"-"+calender.getDate());
    if(expiry > nextMonthEndDate) return nextMonthEndDate;
    return expiry;
  }

  handleResponse = async (title) => {
    if (title === "true") {
      this.setState({ IstransactionSuccessfull: true });
      this.setState({ showModal: false });
      await this.updateUserWallet();
      await this.updateSubscriptionDetails();
      this.props.navigation.navigate("Booked", {
        title: "Payment Successful",
        description: "Please check the slots accordingly and book your slot for car wash.",
      });
    } else if (title === "false") {
      this.setState({ showModal: false });
      this.props.navigation.navigate("Booked", {
        status: false,
        title: "Transaction Failed",
        description: "Oops, something fishy please try after some time",
      });
    } else {
      return;
    }
  };

  render() {
    let { showModal, ack, ORDER_ID, TXN_AMOUNT, CUST_ID } = this.state;
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 30,
            color: "#E74C3C",
            fontFamily:"m-bold",
            marginTop:50,
            alignSelf:"center"
          }}
        >
          BILL SUMMARY{" "}
        </Text>
        <DataTable>
          <DataTable.Row>
            <DataTable.Cell>Item</DataTable.Cell>
            <DataTable.Cell>"{this.state.packName}" Pack</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Order Id</DataTable.Cell>
            <DataTable.Cell>{ORDER_ID.substr(0, 7)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Car no</DataTable.Cell>
            <DataTable.Cell>{this.state.CAR_ID.toUpperCase()}</DataTable.Cell>
          </DataTable.Row>


          <DataTable.Row>
            <DataTable.Cell>Pack Amount</DataTable.Cell>
            <DataTable.Cell>
              <Image
                style={{ width: 20, height: 20 }}
                source={{ uri: "https://img.icons8.com/material/64/000000/rupee--v1.png" }}
              />
              {this.state.TXN_AMOUNT}
            </DataTable.Cell>
          </DataTable.Row>


          <DataTable.Row>
            <DataTable.Cell>(-) Balance Amount</DataTable.Cell>
            <DataTable.Cell>
              <Image
                style={{ width: 20, height: 20 }}
                source={{ uri: "https://img.icons8.com/material/64/000000/rupee--v1.png" }}
              />
                 0
              </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>(+) Taxes</DataTable.Cell>
            <DataTable.Cell>
              <Image
                style={{ width: 20, height: 20 }}
                source={{ uri: "https://img.icons8.com/material/64/000000/rupee--v1.png" }}
              />
                 0
              </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Header>
            <DataTable.Title>Total</DataTable.Title>
            <DataTable.Title>
              <Image
                style={{ width: 20, height: 20 }}
                source={{ uri: "https://img.icons8.com/material/64/000000/rupee--v1.png" }}
              />
              {this.state.TXN_AMOUNT}
            </DataTable.Title>
         
          </DataTable.Header>

        </DataTable>
        <Text
          style={{
            fontSize: 15,
            color: "black",
            fontFamily: 'm-bold',
            alignSelf:"center",
            marginTop:10
          }}
        >
          Currently we only support paytm gatway{" "}
        </Text>
        <Image
          style={{ width: 150, height: 50, alignSelf:"center", marginTop:20 }}
          source={{ uri: "https://img.icons8.com/color/256/paytm.png" }}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.setState({ showModal: true })}
        >
          <Text
            style={{
              fontSize: 15,
              color: "black",
              fontFamily:'m-bold'
            }}
          >
            Proceed to buy{" "}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={showModal}
          onRequestClose={() =>
            this.setState({ showModal: false, backClick: true })
          }
        >
          <WebView
            source={{
              uri: "https://dry-bastion-88099.herokuapp.com/api/paytm/request",
            }}
            injectedJavaScript={`document.getElementById('ORDER_ID').value="${ORDER_ID}";document.getElementById('TXN_AMOUNT').value="${TXN_AMOUNT}";document.getElementById('CUST_ID').value="${CUST_ID}";document.f1.submit()`}
            onNavigationStateChange={async (data) => {
              await this.handleResponse(data.title);
            }}
            renderLoading={() => {
              return (
                <ActivityIndicator
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  size="large"
                  color="#e89d09"
                />
              );
            }}
            startInLoadingState
          />
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "flex-start",
    paddingLeft: 10,
    paddingTop: 20,
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf:"center",
    marginBottom: 20,
    width: "80%",
    borderRadius: 1,
    borderWidth:2,
    borderColor:"#E74C3C",
    backgroundColor: "white",
  },
  description: {
    fontSize: 25,
    color: "#052e6f",
    fontWeight: "400",
    margin: 10,
    textAlign: "center",
  },
  shortNote: {
    fontSize: 17,
    color: "#052e6f",
    textAlign: "center",
  },
  shortNotes: {
    fontSize: 15,
    color: "grey",
    textAlign: "center",
  },
  icontab: {
    width: 60,
    height: 60,
  },
});
