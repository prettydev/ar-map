import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Styles from './PostListStyle';

import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';

const SearchBox = props => {
  return (
    <View style={Styles.HomeSearchArea}>
      <View style={Styles.HomeSearchInputContainer}>
        <TextInput
          placeholder={'Keyword'}
          style={Styles.HomeSearchInput}
          onChangeText={props.inputProc}
        />
      </View>
      <TouchableOpacity
        onPress={props.handleSearch}
        style={Styles.HomeSearchBtn}>
        <EvilIconsIcon name="search" style={{fontSize: 30}} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBox;
