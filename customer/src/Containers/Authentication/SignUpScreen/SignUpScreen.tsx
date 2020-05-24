import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import Style from 'src/Style';
import Styles from './SignUpScreenStyle';
import Colors from 'src/Theme/Colors';

import CustomPwdInput from 'src/Components/CustomForm/CustomPwdInput/CustomPwdInput';
import CustomPhoneInput from 'src/Components/CustomForm/CustomPhoneInput/CustomPhoneInput';
import FormCommonBtn from 'src/Components/Buttons/FormCommonBtn/FormCommonBtn';

import {Images} from 'src/Theme';

import Toast from 'react-native-simple-toast';
import {baseUrl} from 'src/config';
const axios = require('axios');

export default function SignUpScreen(props) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [init, setInit] = useState(0);
  const [sentOtp, setSentOtp] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const sendOTP = async () => {
    await axios
      .post(baseUrl + 'auth/otp', {
        phone,
      })
      .then(response => {
        if (response.data.success) {
          setSentOtp(true);
          Toast.show(response.data.msg); //check your inbox
          console.log('success', response.data.msg);
        } else {
          Toast.show(response.data.msg);
          setInit(init + 1);
          console.log('failed', response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  async function handleSubmit() {
    if (email === '' || phone === '' || password === '') {
      Toast.show('input email!');
      return;
    }

    // if (!sentOtp) {
    //   Toast.show('sent verification code！');
    //   return;
    // }

    if (password !== confirmPassword) {
      Toast.show('input the same passwords');
      return;
    }

    console.log(phone, password);

    axios
      .post(baseUrl + 'auth/signup', {
        email,
        phone,
        password,
        otp,
      })
      .then(function(response2) {
        if (response2.data.success) {
          Toast.show(response2.data.msg);
          props.navigation.navigate('SignIn');
        } else {
          Toast.show(response2.data.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  useEffect(() => {}, [phone]);

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <View style={Styles.SignFormContainer}>
          <TextInput
            style={Style.CustomTextInput}
            placeholder={'Email'}
            onChangeText={value => {
              setEmail(value);
            }}
          />
          <TextInput
            style={Style.CustomTextInput}
            placeholder={'Phone number'}
            onChangeText={value => {
              setPhone(value);
            }}
          />

          <CustomPwdInput
            CustomPwdPlaceholder={'Password'}
            proc={value => {
              setPassword(value);
            }}
          />

          <CustomPwdInput
            CustomPwdPlaceholder={'Confirm password'}
            proc={value => {
              setConfirmPassword(value);
            }}
          />

          <FormCommonBtn CustomBtnTitle={'Create'} proc={handleSubmit} />

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('SignIn')}>
              <Text
                style={{
                  color: Colors.primary,
                  textDecorationLine: 'underline',
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
