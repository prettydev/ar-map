import 'react-native-gesture-handler';
import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from 'src/Containers/Authentication/SignInScreen/SignInScreen';
import SignUpScreen from 'src/Containers/Authentication/SignUpScreen/SignUpScreen';
import ForgotPwdScreen from 'src/Containers/Authentication/ForgotPwdScreen/ForgotPwdScreen';

import PostList from 'src/Containers/Post/PostList/PostList';
import PostDetails from 'src/Containers/Post/PostDetails/PostDetails';
import PostWrite from 'src/Containers/Post/PostWrite/PostWrite';

import {StateProvider} from 'src/Store';

const Stack = createStackNavigator();

export default function App() {
  return (
    <StateProvider>
      <NavigationContainer>
        <Stack.Navigator>
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
          <Stack.Screen
            name="PostList"
            component={PostList}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PostDetails"
            component={PostDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PostWrite"
            component={PostWrite}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </StateProvider>
  );
}
