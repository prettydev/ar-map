import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput, Text, Image} from 'react-native';
import Style from 'src/Style';
import Styles from './CustomPwdInputStyle';
import {Images} from 'src/Theme';
import Colors from 'src/Theme/Colors';

export default function CustomPwdInput(props) {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          borderColor: Colors.border,
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 30,
        }}>
        <TextInput
          secureTextEntry={hidePassword}
          placeholder={props.CustomPwdPlaceholder}
          onChangeText={props.proc}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={Styles.touachableButton}
          onPress={() => setHidePassword(!hidePassword)}>
          {
            // <Image
            //   resizeMode="contain"
            //   style={{width: 25}}
            //   source={hidePassword ? Images.HideIcon : Images.ShowIcon}
            // />
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}
