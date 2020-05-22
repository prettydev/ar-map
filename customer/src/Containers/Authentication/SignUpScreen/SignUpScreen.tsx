import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './SignUpScreenStyle';
import CustomTextInput from 'src/Components/CustomForm/CustomTextInput/CustomTextInput';
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
        <View style={Styles.SignUpHeader}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => props.navigation.navigate('Signin')}
          />
          <Text style={{fontSize: 20, color: '#fff'}}>Sign up</Text>
          <Text style={{flex: 1}} />
        </View>
        <View style={Styles.SignFormContainer}>
          {false && (
            <View style={Styles.FormInput}>
              <CustomPhoneInput
                CustomLabel={'Email'}
                CustomPlaceholder={'Email'}
                proc={value => setPhone(value)}
                proc2={() => {
                  sendOTP();
                }}
                init={init}
              />
            </View>
          )}
          <View style={Styles.FormInput}>
            <CustomTextInput
              CustomLabel={'Email'}
              CustomPlaceholder={'Email'}
              proc={value => {
                setEmail(value);
              }}
            />
          </View>
          <View style={Styles.FormInput}>
            <CustomTextInput
              CustomLabel={'Phone number'}
              CustomPlaceholder={'Phone number'}
              proc={value => {
                setPhone(value);
              }}
            />
          </View>
          <View style={Styles.FormInput}>
            <CustomPwdInput
              CustomPwdLabel={'Password'}
              CustomPwdPlaceholder={'Password'}
              proc={value => {
                setPassword(value);
              }}
            />
          </View>
          <View style={Styles.FormInput}>
            <CustomPwdInput
              CustomPwdLabel={'Confirm password'}
              CustomPwdPlaceholder={'Confirm password'}
              proc={value => {
                setConfirmPassword(value);
              }}
            />
          </View>
          {false && (
            <View style={Styles.FormInput}>
              <CustomTextInput
                CustomLabel={'Verification code'}
                CustomPlaceholder={'Verification code'}
                proc={value => {
                  setOtp(value);
                }}
              />
            </View>
          )}
          <View style={Styles.SignBtn}>
            <FormCommonBtn CustomBtnTitle={'Sign up'} proc={handleSubmit} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
