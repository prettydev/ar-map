import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Styles from './FriendListStyle';

import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';

const SearchBox = props => {
  return (
    <View style={Styles.HomeSearchArea}>
      <View style={Styles.HomeSearchInputContainer}>
        <TextInput
          placeholder={'User ID/Phone Number'}
          placeholderTextColor={'white'}
          style={Styles.HomeSearchInput}
          onChangeText={props.inputProc}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={props.handleSearch}
          style={Styles.HomeSearchBtn}>
          <EvilIconsIcon name="search" style={{fontSize: 30, color: 'white'}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBox;
