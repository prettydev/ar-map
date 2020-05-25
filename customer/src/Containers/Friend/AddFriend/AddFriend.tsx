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

const AddFriend = props => {
  const [state, dispatch] = useContext(store);

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      email: '',
    },
  );

  async function handleSubmit() {
    if (userInput.email === '') {
      Toast.show('Input error!');
      return;
    }

    if (userInput.email === state.user.email) {
      Toast.show(`Can't add your account!`);
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
        Toast.show('error');
        console.log(JSON.stringify(error));
      });
  }

  return (
    <ScrollView style={Styles.FindStuffScreenContainer}>
      <View style={{alignItems: 'center', marginTop: 100}}>
        <Text style={Style.CustomText}>New Contact</Text>
      </View>
      <View style={Style.CustomForm}>
        <TextInput
          style={Style.CustomTextInput}
          value={userInput.email}
          onChangeText={value => setUserInput({['email']: value})}
        />
        <FormCommonBtn CustomBtnTitle={'Invite'} proc={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default AddFriend;
