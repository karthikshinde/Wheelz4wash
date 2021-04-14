import React, { useEffect } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from "@react-navigation/stack";


import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';

import { DrawerContent } from './screens/DrawerContent';

import MainTabScreen from './screens/MainTabScreen';
import SupportScreen from './screens/SupportScreen';
import SettingsScreen from './screens/SettingsScreen';
import BookmarkScreen from './screens/BookmarkScreen';

import SplashScreen from "./screens/SplashScreen";
import Welcome from "./screens/Welcome";
import Home from "./screens/Home";
import firebase from "./keys/ApiKeys";
import Profile from "./screens/Profile";
import CarDetails from "./screens/CarDetails";
import Notifications from "./screens/Notifications";
import AddCar from "./screens/AddCar";
import Booked from "./screens/Booked";
import ContactUs from "./screens/ContactUs";
import SelectCar from "./screens/SelectCar";
import VehicleDetails from "./screens/VehicleDetails";
import SpotBooking from "./services/SpotBooking";
import MapViews from "./screens/MapViews";
import BuyPack from "./screens/BuyPack";
import Progress from "./screens/Progress";
import Book from "./screens/Book";
import Gatway from "./screens/Gatway";
import EditProfile from "./screens/EditProfile";
import TermsConditions from "./screens/TermsConditions";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import GlobalAddCar from "./screens/GlobalAddCar.js";
import MyBookings from "./screens/MyBookings.js";
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import { AuthContext } from './components/context';

import RootStackScreen from './screens/RootStackScreen';

import AsyncStorage from '@react-native-community/async-storage';
import FireBaseServices from './services/FireBaseServices';

const HomeStack = createStackNavigator();
const privacyStack = createStackNavigator();
const termsStack = createStackNavigator();
const Drawer = createDrawerNavigator(); 

const App = () => {

  const [isDarkTheme, setIsDarkTheme] = React.useState(true);
  const [dataLoaded, setDataLoaded] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  //We are not supporting dark theme as of now, uncomment this to get dark theme.
  // const CustomDarkTheme = {
  //   ...NavigationDefaultTheme,
  //   ...PaperDefaultTheme,
  //   colors: {
  //     ...NavigationDefaultTheme.colors,
  //     ...PaperDefaultTheme.colors,
  //     background: '#ffffff',
  //     text: '#333333'
  //   }
  // }

  const theme = isDarkTheme ? CustomDefaultTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (uid) => {
      // setUserToken('fgkj');
      // setIsLoading(false);
      const userToken = String(uid);
      try {
        FireBaseServices.log("Received UID for SignIn:"+userToken);
        await FireBaseServices.setAuthToken(AsyncStorage, userToken);
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', token: userToken });
    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    }
  }), []);

  const fetchFonts = async () => {
    return Font.loadAsync({
      'm-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'm-light': require('./assets/fonts/Montserrat-Light.ttf'),
      'm-medium': require('./assets/fonts/Montserrat-Medium.ttf')
    });
  };


  // const _loadAssetsAsync = async() =>{
  //   const imageAssets = cacheImages([
  //     'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  //     require('./assets/images/circle.jpg'),
  //   ]);

  //   const fontAssets = cacheFonts([FontAwesome.font]);

  //   await Promise.all([...imageAssets, ...fontAssets]);
  // }


  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      try {
        firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            console.log(user);
            let isLive = await FireBaseServices.isUserAvailable();
            if( isLive ) {
              userToken = await FireBaseServices.getAuthToken();
              dispatch({ type: "LOGIN", token: userToken });
            } else {
              dispatch({ type: 'LOGOUT' });
            }
          } else {
            dispatch({ type: 'LOGOUT' });
          }
        });
      } catch (e) {
        // Restoring token failed
      } 
    }, 1000);
  }, []);

  if (loginState && loginState.isLoading) {
    if (!dataLoaded) {
      return (
        <AppLoading
          startAsync={fetchFonts}
          onFinish={() => setDataLoaded(true)}
          onError={console.warn}
        />
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#E74C3C"}}>
        {/* <ActivityIndicator size="large" /> */}
        <Image
          style={{
            width: 300,
            height: 300,
          }}
          source={require("./assets/images/loading.gif")}
        />
      </View>
    );
  }

  const termsStackScreen = ({ navigation }) => (
    <termsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          shadowRadius: 0,
          elevation: 0,
        },
        headerTitleStyle: {
          fontFamily: 'm-bold'
        },
      }}
    >
      <termsStack.Screen
        name="TermsConditions"
        component={TermsConditions}
        options={{
          title: "Terms & Conditions",
          headerTitleStyle: {
            fontFamily: 'm-bold'
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              <Image
                style={{ width: 30, height: 30, marginLeft: 10 }}
                source={require("./assets/images/menu.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </termsStack.Navigator>
  );

  const privacyStackScreen = ({navigation}) => (
    <privacyStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          shadowRadius: 0,
          elevation: 0,
        },
        headerTitleStyle: {
          fontFamily: 'm-bold'
        },
      }}
    >
      <privacyStack.Screen
        name="Privacy"
        component={PrivacyPolicy}
        options={{
          title: "Privacy Policy",
          headerTitleStyle: {
            fontFamily: 'm-bold'
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              <Image
                style={{ width: 30, height: 30, marginLeft: 10 }}
                source={require("./assets/images/menu.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </privacyStack.Navigator>
  );

  const HomeStackScreen = ({ navigation }) => (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          shadowRadius: 0,
          elevation: 0,
        },
        headerTintColor: "#000000",
        headerTitleStyle: {
          fontFamily:'m-bold'
        },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Wheelz4wash",
          headerTitleStyle: {
            fontFamily:'m-bold'
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              <Image
                style={{ width: 30, height: 30, marginLeft: 10 }}
                source={require("./assets/images/menu.png")}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              <Image
                style={{ width: 30, height: 30, marginRight: 10 }}
                source={require("./assets/images/logout.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <HomeStack.Screen name="Profile" component={Profile} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen
        name="CarDetails"
        component={CarDetails}
       options={{ title: "Car Details"}}
      />
      <HomeStack.Screen name="Notifications" component={Notifications} />
      <HomeStack.Screen
        name="AddCar"
        component={AddCar}
        options={{ title: "Add Car"}}
      />
      <HomeStack.Screen name="Booked" component={Booked} />
      <HomeStack.Screen name="ContactUs" component={ContactUs}  options={{ title: "Contact Us"}} />
      <HomeStack.Screen
        name="SelectCar"
        component={SelectCar}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="VehicleDetails"
        component={VehicleDetails}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="MapViews"
        component={MapViews}
        options={{ title: "Location"}}
      />
      <HomeStack.Screen
        name="SpotBooking"
        component={SpotBooking}
        options={{ title: "Book here"}}
      />
      <HomeStack.Screen
        name="GAddCar"
        component={GlobalAddCar}
        options={{
          title: "Add Your Vehicle",}}
       // options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Progress"
        component={Progress}
       // options={{ headerShown: false }}
                options={{
          title: "Bookings",}}
      />
      <HomeStack.Screen
        name="BuyPack"
        component={BuyPack}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Book"
        component={Book}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Gatway"
        component={Gatway}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="MyBookings"
        component={MyBookings}
               options={{
          title: "My bookings"}}
      />
    </HomeStack.Navigator>
  );

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>
          {loginState && loginState.userToken !== null ? (
            <Drawer.Navigator drawerStyle={{
              backgroundColor: "#000000",
            }}
             drawerContent={props => <DrawerContent {...props} />}>
              {/* <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
              <Drawer.Screen name="SupportScreen" component={SupportScreen} />
              <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
              <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} /> */}
              <Drawer.Screen
                name="Home"
                component={HomeStackScreen}
                options={{ headerShown: false }}
              />
              <Drawer.Screen
                name="TermsConditions"
                options={{ title: "Terms & Conditions" }}
                component={termsStackScreen}
              />
              <Drawer.Screen
                name="PrivacyPolicy"
                options={{
                  title: "Privacy Policy",
                }}
                component={privacyStackScreen}
              />
              <Drawer.Screen name="Profile" component={HomeStackScreen} />
              <Drawer.Screen
                name="CarDetails"
                component={CarDetails}
                options={{ headerShown: false }}
              />
            </Drawer.Navigator>
          )
            :
            <RootStackScreen />
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;
