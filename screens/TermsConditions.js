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
          clause:`By accessing the website at http://wheelz4wash.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.`
        },
        {
          id: 2,
          title:"Use License",
          clause:`Permission is granted to temporarily download one copy of the materials (information or software) on Wheelz4wash's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

modify or copy the materials;
use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
attempt to decompile or reverse engineer any software contained on Wheelz4wash's website; remove any copyright or other proprietary notations from the materials; or
transfer the materials to another person or "mirror" the materials on any other server.

This license shall automatically terminate if you violate any of these restrictions and may be terminated by Wheelz4wash at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
`      
          },
                  {
          id: 3,
          title:"Disclaimer",
          clause:`The materials on Wheelz4wash's website are provided on an 'as is' basis. Wheelz4wash makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
Further, Wheelz4wash does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
`      
          },
                  {
          id: 4,
          title:"Limitations",
          clause:`In no event shall Wheelz4wash or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Wheelz4wash's website, even if Wheelz4wash or a Wheelz4wash authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.`      
          },
                  {
          id: 5,
          title:"Accuracy of materials",
          clause:`The materials appearing on Wheelz4wash's website could include technical, typographical, or photographic errors. Wheelz4wash does not warrant that any of the materials on its website are accurate, complete or current. Wheelz4wash may make changes to the materials contained on

its website at any time without notice. However Wheelz4wash does not make any commitment to update the materials.
`      
          },
                  {
          id: 6,
          title:"Links",
          clause:`Wheelz4wash has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Wheelz4wash of the site. Use of any such linked website is at the user's own risk.`      
          },
                  {
          id: 7,
          title:"Modifications",
          clause:`Wheelz4wash may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.`      
          },
                  {
          id: 8,
          title:"Governing Law",
          clause:`These terms and conditions are governed by and construed in accordance with the laws of Telangana and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.`      
          },
                  {
          id: 9,
          title:"Modification to the prices",
          clause:`Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service. The billing is scheduled on monthly basis and no refund will be provided to the customer if subscription is cancelled from the user end.`      
          },
            {
          id: 10,
          title:"*IMPORTANT NOTE",
          clause:`Please take care of your belongings before giving keys to our executive, as we are not responsible for any loss.`      
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
               <View  key={each.id}>
              <Text style={styles.tagsH}>{each.title}</Text>
              <Text style={styles.tags}>
                {each.clause}
              </Text>
              </View>
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
