import React, {useState, useEffect, useContext, useReducer} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';

import Styles from './AddFriendStyle';
import Style from 'src/Style';
import Toast from 'react-native-simple-toast';

import {store} from 'src/Store';
import axios from 'axios';
import {baseUrl, photoSize} from 'src/config';

import FormCommonBtn from 'src/Components/Buttons/FormCommonBtn/FormCommonBtn';

import {useTranslation} from 'react-i18next';

const AddFriend = props => {
  const {t} = useTranslation();

  const [state, dispatch] = useContext(store);

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      email: '',
    },
  );

  async function handleSubmit() {
    if (userInput.email === '') {
      Toast.show(t('invalid'));
      return;
    }

    if (userInput.email === state.user.email) {
      Toast.show(t('self_email'));
      return;
    }

    axios
      .post(baseUrl + 'auth/invite', {
        email: userInput.email,
        user: state.user._id,
      })
      .then(function(response2) {
        Toast.show(response2.data.msg);
        if (response2.data.success)
          dispatch({
            type: 'setUser',
            payload: response2.data.item,
          });
      })
      .catch(function(error) {
        Toast.show(t('error'));
        console.log(JSON.stringify(error));
      });
  }

  return (
    <ScrollView style={Styles.FindStuffScreenContainer}>
      <View style={{alignItems: 'center', marginTop: 100}}>
        <Text style={Style.CustomText}>{t('new_contact')}</Text>
      </View>
      <View style={Style.CustomForm}>
        <TextInput
          style={Style.CustomTextInput}
          value={userInput.email}
          onChangeText={value => setUserInput({['email']: value})}
        />
        <FormCommonBtn CustomBtnTitle={t('invite')} proc={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default AddFriend;
