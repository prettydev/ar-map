import 'react-native-gesture-handler';
import * as React from 'react';

import {Image, Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SignInScreen from 'src/Containers/Authentication/SignInScreen';
import SignUpScreen from 'src/Containers/Authentication/SignUpScreen/SignUpScreen';
import ForgotPwdScreen from 'src/Containers/Authentication/ForgotPwdScreen/ForgotPwdScreen';

import FriendList from 'src/Containers/Friend/FriendList/FriendList';
import AddFriend from 'src/Containers/Friend/AddFriend/AddFriend';

import {StateProvider} from 'src/Store';

import Style from 'src/Style';
import Colors from './Theme/Colors.ts';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPwd"
        component={ForgotPwdScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="FriendList"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'FriendList') {
            iconName = focused ? 'ios-list-box' : 'ios-list';
          } else if (route.name === 'AddFriend') {
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // tabBarLabel: '',
      })}
      tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: 'gray',
        showLabel: false,
      }}>
      <Tab.Screen
        name="FriendList"
        component={FriendList}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="AddFriend"
        component={AddFriend}
        options={{headerShown: false}}
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
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}>
            <Stack.Screen
              name="Auth"
              component={AuthStack}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Main"
              component={MainStack}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </StateProvider>
  );
}
