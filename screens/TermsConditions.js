import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default class TermsConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: [
        {
          id: 1,
          clause:
            "This website is operated by CleanseCar Washing and Repair Services Private Limited.. Throughout the site, the terms “we”, “us” and “our” refer to CleanseCar Washing and Repair Services Private Limited..CleanseCar Washing and Repair Services Private Limited offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here. By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content. Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service. Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.",
        },
        {
          id: 2,
          clause:
            "We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us. The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.",
        },
      ],
    };
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {/* <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginTop: 25,
              alignSelf: "center",
              color: "#e74c3c",
            }}
          >
            Terms & conditions{" "}
          </Text> */}
          <View style={styles.postContent}>
            {this.state.terms.map((each) => (
              <Text style={styles.tags} key={each.id}>
                {each.clause}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#0d1864",
  },
  headerTitle: {
    fontSize: 30,
    color: "#FFFFFF",
    marginTop: 10,
  },
  name: {
    fontSize: 22,
    color: "black",
  },
  postContent: {
    flex: 1,
    padding: 10,
    marginTop: 5,
  },
  postTitle: {
    fontSize: 26,
    fontFamily:"m-bold"
  },
  postDescription: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  tags: {
    color: "black",
    marginTop: 10,
    fontFamily:"m-bold"
  },
  date: {
    color: "#696969",
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#00BFFF",
  },
  profile: {
    flexDirection: "row",
    marginTop: 20,
  },
  name: {
    fontSize: 22,
    color: "#0d1864",
    fontWeight: "600",
    marginLeft: 10,
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#0d1864",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
});
