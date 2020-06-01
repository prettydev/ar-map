import React from 'react';
import {Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import Styles from './FormCommonBtnStyle';

export default function FormCommonBtn({loading = false, CustomBtnTitle, proc}) {
  return (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity style={Styles.FormCommonBtn} onPress={proc}>
        {!loading && (
          <Text style={Styles.FormCommonBtnText}>{CustomBtnTitle}</Text>
        )}
        {loading && <ActivityIndicator size="large" color="#fff" />}
      </TouchableOpacity>
    </View>
  );
}
