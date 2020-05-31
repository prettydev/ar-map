import "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";

import { Image, Text, View } from "react-native";

import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import SignInScreen from "src/Containers/Authentication/SignInScreen";
import SignUpScreen from "src/Containers/Authentication/SignUpScreen/SignUpScreen";
import ForgotPwdScreen from "src/Containers/Authentication/ForgotPwdScreen/ForgotPwdScreen";

import FriendList from "src/Containers/Friend/FriendList/FriendList";
import AddFriend from "src/Containers/Friend/AddFriend/AddFriend";

import Map from "src/Containers/Map/Map";
import AR from "src/Containers/AR/AR";

import { StateProvider } from "src/Store";

import Style from "src/Style";
import Colors from "./Theme/Colors.ts";

import BgTracking from "src/BgTracking";

import { en, ar } from "src/trans";

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (cb) => cb("ar"),
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ar",
    debug: true,
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },
  });

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPwd"
        component={ForgotPwdScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const FriendStack = () => {
  return (
    <Stack.Navigator initialRouteName="FriendList">
      <Stack.Screen
        name="FriendList"
        component={FriendList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MapStack = () => {
  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen
        name="Map"
        component={Map}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ARStack = () => {
  return (
    <Stack.Navigator initialRouteName="AR">
      <Stack.Screen name="AR" component={AR} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Friend"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Friend") {
            iconName = "ios-contacts";
          } else if (route.name === "Map") {
            iconName = "ios-pin";
          } else if (route.name === "AR") {
            iconName = "ios-navigate";
          }
          color = focused ? Colors.primary : Colors.black;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // tabBarLabel: '',
      })}
      tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: "gray",
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Friend"
        component={FriendStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AR"
        component={ARStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

function CustomDrawerContent(props) {
  return <DrawerContentScrollView {...props} style={Style.drawer} />;
}

export default function App() {
  return (
    <StateProvider>
      <BgTracking />
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Stack.Screen
              name="Auth"
              component={AuthStack}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              component={MainStack}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </StateProvider>
  );
}
