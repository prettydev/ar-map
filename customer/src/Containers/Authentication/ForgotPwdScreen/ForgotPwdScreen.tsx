import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './ForgotPwdScreenStyle';
import CustomTextInput from 'src/Components/CustomForm/CustomTextInput/CustomTextInput';
import CustomPwdInput from 'src/Components/CustomForm/CustomPwdInput/CustomPwdInput';
import CustomPhoneInput from 'src/Components/CustomForm/CustomPhoneInput/CustomPhoneInput';
import FormCommonBtn from 'src/Components/Buttons/FormCommonBtn/FormCommonBtn';
import {Images} from 'src/Theme';

import Toast from 'react-native-simple-toast';
import {baseUrl} from 'src/config';
const axios = require('axios');

export default function ForgotPWScreen(props) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [init, setInit] = useState(0);
  const [sentOtp, setSentOtp] = useState(false);
  const [password, setPassword] = useState('');

  const sendOTP = async () => {
    await axios
      .post(baseUrl + 'auth/otp', {
        phone,
        kind: 'forgot',
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
    if (otp === '' || phone === '' || password === '') {
      Toast.show('input error！');
      return;
    }

    if (!sentOtp) {
      Toast.show('sent verification code！');
      return;
    }

    axios
      .post(baseUrl + 'auth/resetpwd', {
        phone,
        password,
        otp,
      })

      .then(function(response2) {
        if (response2.data.success) {
          Toast.show(response2.data.msg);
          props.navigation.navigate('Signin');
        } else {
          Toast.show(response2.data.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
        // Toast.show('错误');
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
          <Text style={{fontSize: 20, color: '#fff'}}>Forgot password</Text>
          <Text style={{flex: 1}} />
        </View>
        <View style={Styles.SignFormContainer}>
          <View style={Styles.FormInput}>
            <CustomPhoneInput
              CustomLabel={'phone'}
              CustomPlaceholder={'input phone number'}
              proc={value => setPhone(value)}
              proc2={() => {
                sendOTP();
              }}
              init={init}
            />
          </View>
          <View style={Styles.FormInput}>
            <CustomTextInput
              CustomLabel={'verification code'}
              CustomPlaceholder={'verification code'}
              proc={value => {
                setOtp(value);
              }}
            />
          </View>
          <View style={Styles.FormInput}>
            <CustomPwdInput
              CustomPwdLabel={'password'}
              CustomPwdPlaceholder={'password'}
              proc={value => {
                setPassword(value);
              }}
            />
          </View>

          <View style={Styles.SignBtn}>
            <FormCommonBtn CustomBtnTitle={'complete'} proc={handleSubmit} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
