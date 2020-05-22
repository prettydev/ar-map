import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from 'src/Theme';
import Styles from './UserInfoStyle';
import Style from 'src/Style';
import Header from 'src/Components/Header/Header';
import Toast from 'react-native-simple-toast';
import {baseUrl} from 'src/config';
import {store} from 'src/Store';

export default function Profile(props) {
  const [state, dispatch] = useContext(store);
  const [item, setItem] = useState(props.route.params.item);
  return (
    <ScrollView style={Styles.ProfileContainer}>
      <ImageBackground
        source={Images.Slide1}
        style={Styles.ProfileHeaderContainer}>
        <Header back={props.navigation.goBack()} label={'profile'} />

        <View style={Styles.ProfileHeaderAvatarContainer}>
          <View style={Styles.ProfileHeaderAvatarWrap}>
            <FastImage
              source={{
                uri: baseUrl + 'download/photo?path=' + item.photo,
              }}
              style={Styles.ProfileHeaderAvatarImg}
              resizeMode="cover"
            />
            <Text style={Styles.ProfileHeaderAvatarText}>take a picture</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={Styles.ProfileFunctionContainer}>
        <TouchableOpacity style={Styles.ProfileUpdateContainer}>
          <View style={Styles.ProfileUpdateWrap}>
            <View style={Styles.ProfileUpdateLeft}>
              <Text>
                {item.location && item.location.city ? item.location.city : ''}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.ProfileContactUsContainer}>
          <View style={Styles.ProfileContactUsWrap}>
            <View style={Styles.ProfileContactUsLeft}>
              <Text>phone: {item.phone}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {state.user._id && item._id !== state.user._id && (
          <TouchableOpacity
            style={Styles.ProfileMessageContainer}
            onPress={() => {
              if (item._id === state.user._id) {
                Toast.show('error');
                return;
              }
              props.navigation.navigate('ChatRoom', {guest: item});
            }}>
            <View style={Styles.ProfileMessageWrap}>
              <View style={Styles.ProfileMessageLeft}>
                <Text>message</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
