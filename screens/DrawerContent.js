import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
    IconButton,
    Badge
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import{ AuthContext } from '../components/context';
import * as firebase from "firebase";
import { TouchableHighlight } from 'react-native';



export function DrawerContent(props) {

    const paperTheme = useTheme();
    const [userName, setUserName] = useState("");
    const [location, setlocation] = useState("");

    const { signOut, toggleTheme } = React.useContext(AuthContext);
    
    useEffect(() => {
        async function getUser(){
            let owner = firebase.auth().currentUser.uid;
            const eventref = firebase.database().ref("Users/" + owner +"/UserDetails");
            const snapshot = await eventref.once("value");
            const value = snapshot.val();
            console.log(value);
            setUserName(value.Name);
            setlocation(value.AppartmentName);
        }
        try{
            getUser();
            
        } catch(e){
            console.log(e);
        }
        
    }, []);

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Badge size={50}>{userName.slice(0,2)}</Badge>
                            {/* <Avatar.Image 
                                source={require('../assets/logo4.png')}
                                size={50}
                                color="white"
                            /> */}
                            
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{userName}</Title>    
                                <Caption style={styles.caption}>{location}</Caption>
                            </View>
                        </View>

                        {/* <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Followers</Caption>
                            </View>
                        </View> */}
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <View style={{ width: "100%", backgroundColor:"black"}}>
                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { props.navigation.navigate('Home') }}>
                            <IconButton
                                icon="home-outline"
                                color="white"
                                size={30}   
                            />
                                <Title style={styles.sideItem}>Home</Title> 
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "100%", backgroundColor: "black" }}>
                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { props.navigation.navigate('PrivacyPolicy') }}>
                                <IconButton
                                    icon="file-document"
                                    color="white"
                                    size={30}
                                />
                                <Title style={styles.sideItem}>Privacy Policy</Title>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: "100%", backgroundColor: "black" }}>
                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { props.navigation.navigate('TermsConditions') }}>
                                <IconButton
                                    icon="file-document"
                                    color="white"
                                    size={30}
                                />
                                <Title style={styles.sideItem}>Terms & Conditions</Title>
                            </TouchableOpacity>
                        </View>

                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color="white"
                                size={size}
                                />
                            )}
                            style={{ backgroundColor: "#E74C3C"}}
                            label="Home"
                            onPress={() => {props.navigation.navigate('Home')}}
                        /> */}
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="file-document" 
                                color="white"
                                size={size}
                                />
                            )}
                            label="Privacy Policy"
                            onPress={() => { props.navigation.navigate('PrivacyPolicy')}}
                        /> */}
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="file-document" 
                                color="white"
                                size={size}
                                />
                            )}
                            label="Terms & Conditions"
                            onPress={() => { props.navigation.navigate('TermsConditions')}}
                        /> */}
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="settings-outline" 
                                color="white"
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('SettingScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-check-outline" 
                                color="white"
                                size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => {props.navigation.navigate('SupportScreen')}}
                        /> */}
                    </Drawer.Section>
                    {/* <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                    {/* <Drawer.Section title="Preferences">
                        <View style={{ width: "100%", backgroundColor: "black" }}>
                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { props.navigation.navigate('TermsConditions') }}>
                                <IconButton
                                    icon="car"
                                    color="white"
                                    size={30}
                                />
                                <Title style={styles.sideItem}>Add Car</Title>
                            </TouchableOpacity>
                        </View>
                    </Drawer.Section> */}
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                {/* <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {signOut()}}
                /> */}
                <View style={{ width: "100%", backgroundColor: "black" }}>
                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { signOut() }}>
                        <IconButton
                            icon="exit-to-app"
                            color="white"
                            size={30}
                        />
                        <Title style={styles.sideItem}>Sign Out</Title>
                    </TouchableOpacity>
                </View>
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 18,
      marginTop: 3,
      fontFamily:"m-bold",
      color:"white"
    },
    sideItem: {
        fontSize: 18,
        marginTop: 12,
        fontFamily: "m-light",
        color: "white"
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      color:"white"
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontFamily:"m-bold",
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
      fontFamily:"m-bold"
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });