import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from 'src/Theme';
import Style from './ProductCardStyle';
import RoundBtn from 'src/Components/Buttons/RoundBtn/RoundBtn';
import RectBtn from 'src/Components/Buttons/RectBtn/RectBtn';
import {Card} from 'react-native-shadow-cards';
import moment from 'moment';
import {baseUrl} from 'src/config';
import Toast from 'react-native-simple-toast';
import {store} from 'src/Store';

import {dotedTitle} from 'src/utils';

import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';

export default function ProductCard({item, navigation}) {
  const [state, dispatch] = useContext(store);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PostDetails', {item});
      }}
      style={Style.CardWrap}>
      <Card style={{padding: 12, flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={Style.ImageSection}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UserInfo', {item: item.user});
              }}
            />
          </View>

          <View
            style={{
              flex: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flex: 2}}>
              <EvilIconsIcon name="user" style={{fontSize: 40}} />
            </View>
            <View style={{flex: 6}}>
              <Text>{item.merchant}</Text>
            </View>
            <View style={{flex: 4}}>
              <Text style={Style.Userdate}>
                {moment(item.createAt).format('MM/DD hh:mm')}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View style={Style.CardDesAndImgContainer}>
            <View style={Style.CardDescription}>
              <Text numberOfLines={3} style={Style.CardDescriptionText}>
                {item.description}
              </Text>
            </View>
            <View style={Style.CardImageSection}>
              {item.photos.length > 0 && (
                <FastImage
                  source={{
                    uri: baseUrl + 'download/photo?path=' + item.photos[0].path,
                  }}
                  style={Style.CardImage}
                />
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
