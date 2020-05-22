import React from 'react';
import {View, Text} from 'react-native';
import Styles from './CustomFormSelectStyle';
import RNPickerSelect from 'react-native-picker-select';
import {Colors} from 'src/Theme';

export default function CustomFormSelect(props) {
  const {
    CustomFormSelectPlaceholder,
    CustomFormSelectLabel,
    procFunc,
    itemArr,
  } = props;
  const placeholder = {
    label: CustomFormSelectPlaceholder,
    value: null,
    color: Colors.grey,
  };
  return (
    <View style={Styles.CustomFormSelectContainer}>
      <View style={Styles.CustomFormSelectTextContainer}>
        <Text>{CustomFormSelectLabel}</Text>
      </View>
      <View style={Styles.CustomFormSelectPickerContainer}>
        <RNPickerSelect
          placeholder={placeholder}
          onValueChange={procFunc}
          items={itemArr}
          doneText={'Select'}
        />
      </View>
    </View>
  );
}
