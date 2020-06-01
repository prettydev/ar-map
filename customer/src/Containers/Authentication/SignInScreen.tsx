import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import {Picker} from '@react-native-community/picker';
import FastImage from 'react-native-fast-image';

import Style from 'src/Style';
import CustomPwdInput from 'src/Components/CustomForm/CustomPwdInput/CustomPwdInput';
import FormCommonBtn from 'src/Components/Buttons/FormCommonBtn/FormCommonBtn';
import AsyncStorage from '@react-native-community/async-storage';

import {baseUrl} from 'src/config';
import {store} from 'src/Store';

import Toast from 'react-native-simple-toast';
import axios from 'axios';
import io from 'socket.io-client';

import Images from 'src/Theme/Images';
import Colors from 'src/Theme/Colors';

import {useTranslation} from 'react-i18next';

export default function SignInScreen(props) {
  const {t, i18n} = useTranslation();

  const [loading, setLoading] = useState(false);

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
      setEmail('test@test.com');
      setPassword('123123');
      // Toast.show("input error!");
      // return;
    }

    setLoading(true);

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

          Toast.show(t('success'));
          props.navigation.navigate('Main');
        } else {
          setLoading(false);
          Toast.show(response.data.msg);
        }
      })
      .catch(error => {
        setLoading(false);
        Toast.show(t('network_error'));
        console.log(error);
      });
  };

  return (
    <ScrollView
      style={{flex: 12, flexDirection: 'column', backgroundColor: 'white'}}>
      <View flex={1} flexDirection="row" style={{marginBottom: -20}}>
        <View flex={5} />
        <View flex={2}>
          <Picker
            selectedValue={i18n.language}
            style={{height: 50, width: 120}}
            onValueChange={(value, idx) => {
              i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
            }}>
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Arabic" value="ar" />
          </Picker>
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <FastImage
          style={{width: 180, height: 150}}
          source={Images.Logo}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={Style.CustomText}>{t('app')}</Text>
      </View>
      <View style={Style.CustomForm}>
        <TextInput
          style={Style.CustomTextInput}
          placeholder={t('email')}
          onChangeText={value => setEmail(value)}
        />

        <CustomPwdInput
          CustomPwdPlaceholder={t('password')}
          proc={value => setPassword(value)}
        />

        <FormCommonBtn
          CustomBtnTitle={t('signin')}
          proc={handleSubmit}
          loading={loading}
        />

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text>{t('no_acc')}</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')}>
            <Text
              style={{
                color: Colors.primary,
                textDecorationLine: 'underline',
              }}>
              {t('create_new_acc')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
