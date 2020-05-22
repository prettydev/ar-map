import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, BackHandler} from 'react-native';
import Styles from './SignInScreenStyle';
import CustomTextInput from 'src/Components/CustomForm/CustomTextInput/CustomTextInput';
import CustomPwdInput from 'src/Components/CustomForm/CustomPwdInput/CustomPwdInput';
import FormCommonBtn from 'src/Components/Buttons/FormCommonBtn/FormCommonBtn';
import AsyncStorage from '@react-native-community/async-storage';

import {store} from 'src/Store';

import Toast from 'react-native-simple-toast';
import {baseUrl} from 'src/config';
import axios from 'axios';
import io from 'socket.io-client';

// import Pushy from 'pushy-react-native';

export default function SignInScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [state, dispatch] = useContext(store);

  const saveToken = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log('saveToken Exception... ... ...', e);
    }
  };

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      Toast.show('input error!');
      return;
    }

    await axios
      .post(baseUrl + 'auth/signin', {
        email,
        password,
      })
      .then(async response => {
        if (response.data.success) {
          console.log('user info...', response.data.user);

          // Register the device for push notifications
          /*
          Pushy.register()
            .then(async deviceToken => {
              axios
                .post(baseUrl + 'auth/device', {
                  user_id: response.data.user._id,
                  device: deviceToken,
                })
                .then(response => {
                  console.log(response.data.user, 'user with device token');
                })
                .catch(error => {
                  console.log(error);
                });

              await fetch(baseUrl + 'api/auth/device?token=' + deviceToken);
            })
            .catch(err => {
              // Handle registration errors
              console.log('Device registration exception.......', err);
            });
          */
          const signInfo = {
            auth_token: response.headers.auth_token,
            user: response.data.user,
            rooms: response.data.rooms,
          };

          dispatch({
            type: 'setTokenUser',
            payload: signInfo,
          });

          dispatch({
            type: 'setSocket',
            payload: io(baseUrl, {
              query: {user_id: response.data.user._id},
              ransports: ['websocket'],
              jsonp: false,
            }),
          });

          await saveToken('signInfo', JSON.stringify(signInfo));

          Toast.show('success!');
          props.navigation.navigate('PostList');
        } else {
          Toast.show(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('you clicked back button. go to the app home.');
      props.navigation.navigate('PostList');
      return true;
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={Styles.SignInHeader}>
        <Text style={{fontSize: 20}}>Returnup</Text>
      </View>
      <View style={Styles.SignFormContainer}>
        <View style={Styles.SignPhoneInput}>
          <CustomTextInput
            CustomLabel={'Email'}
            CustomPlaceholder={'Email'}
            proc={value => setEmail(value)}
          />
        </View>
        <View style={Styles.SignPwdInput}>
          <CustomPwdInput
            CustomPwdLabel={'Password'}
            CustomPwdPlaceholder={'Password'}
            proc={value => setPassword(value)}
          />
        </View>
        <View style={Styles.SignOtherFunc}>
          <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')}>
            <Text>Sign up &nbsp;</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ForgotPwd')}>
            <Text> | &nbsp; Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.SignBtn}>
          <FormCommonBtn CustomBtnTitle={'Sign in'} proc={handleSubmit} />
        </View>
      </View>
    </View>
  );
}
