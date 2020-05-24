import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Styles from './FormCommonBtnStyle';

export default function FormCommonBtn(props) {
  return (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity style={Styles.FormCommonBtn} onPress={props.proc}>
        <Text style={Styles.FormCommonBtnText}>{props.CustomBtnTitle}</Text>
      </TouchableOpacity>
    </View>
  );
}
