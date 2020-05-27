import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import FastImage from 'react-native-fast-image';

import Style from 'src/Style';
import CustomPwdInput from 'src/Components/CustomForm/CustomPwdInput/CustomPwdInput';
import FormCommonBtn from 'src/Components/Buttons/FormCommonBtn/FormCommonBtn';
import AsyncStorage from '@react-native-community/async-storage';

import {baseUrl, translationGetters} from 'src/config';
import {store} from 'src/Store';

import Toast from 'react-native-simple-toast';
import axios from 'axios';
import io from 'socket.io-client';

import Images from 'src/Theme/Images';
import Colors from 'src/Theme/Colors';

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
      setEmail('test@a.com'); //  test code
      setPassword('123123'); //  test code
      // Toast.show("input error!");
      // return;
    }

    await axios
      .post(baseUrl + 'auth/signin', {
        email,
        password,
      })
      .then(async response => {
        if (response.data.success) {
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
          props.navigation.navigate('Main');
        } else {
          Toast.show(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={{flex: 12, flexDirection: 'column', backgroundColor: 'white'}}>
      <View flex={1} flexDirection="row" style={{marginBottom: -20}}>
        <View flex={5} />
        <View flex={2}>
          <RNPickerSelect
            onValueChange={value => {
              dispatch({
                type: 'setLang',
                payload: value,
              });
            }}
            items={[
              {label: 'English', value: 'en', color: Colors.primary},
              {label: 'Arabic', value: 'ar', Color: Colors.primary},
            ]}
            value="en"
          />
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <FastImage
          style={{width: 180, height: 150}}
          source={Images.Logo}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={Style.CustomText}>KP MASTER PLAN</Text>
      </View>
      <View style={Style.CustomForm}>
        <TextInput
          style={Style.CustomTextInput}
          placeholder={'Email'}
          onChangeText={value => setEmail(value)}
        />

        <CustomPwdInput
          CustomPwdPlaceholder={'Password'}
          proc={value => setPassword(value)}
        />

        <FormCommonBtn CustomBtnTitle={'Login'} proc={handleSubmit} />

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text>Don't have account?</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')}>
            <Text
              style={{color: Colors.primary, textDecorationLine: 'underline'}}>
              Create a new account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
