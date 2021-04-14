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
          title:"Terms",
          clause:`Your privacy is important to us. It is Wheelz4wash's policy to respect your privacy regarding any information we may collect from you across our website, http://wheelz4wash.com, and other sites we own and operate.
We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
We don’t share any personally identifying information publicly or with third-parties, except when required to by law.
Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
This policy is effective as of 18 June 2020`
        }
      ],
    };
  }

  render() {
    return (
      <View>
        {/* <Text
          style={{
            fontSize: 30,
            fontFamily:'m-bold',
            marginTop: 25,
            alignSelf: "center",
            color: "#e74c3c",
          }}
        >
          Privacy Policy{" "}
        </Text> */}
      
      <ScrollView>
        <View style={styles.container}>

          <View style={styles.postContent}>
            {this.state.terms.map((each) => (
              <View  key={each.id}>
              {/* <Text style={styles.tagsH}>{each.title}</Text> */}
              <Text style={styles.tags}>
                {each.clause}
              </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      </View>
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
    color: "#0d1864",
    fontWeight: "600",
  },
  postContent: {
    flex: 1,
    padding: 10,
    marginTop: 5,
  },
  postTitle: {
    fontSize: 26,
    fontWeight: "600",
  },
  postDescription: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  tags: {
    color: "black",
    marginTop: 10,
    fontFamily:'m-bold',
    fontSize:15
  },
    tagsH: {
    color: "black",
    marginTop: 10,
    fontFamily:'m-bold',
    fontSize:25
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
