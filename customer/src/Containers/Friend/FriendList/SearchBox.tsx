import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Styles from './FriendListStyle';

import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';

import {useTranslation} from 'react-i18next';

const SearchBox = props => {
  const {t} = useTranslation();
  return (
    <View style={Styles.HomeSearchArea}>
      <View style={Styles.HomeSearchInputContainer}>
        <TextInput
          placeholder={t('search_friend')}
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
