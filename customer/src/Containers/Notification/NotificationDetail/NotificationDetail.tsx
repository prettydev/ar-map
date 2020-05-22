import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images, Colors} from 'src/Theme';
import Styles from './NotificationDetailStyle';
import Style from 'src/Style';
import Header from 'src/Components/Header/Header';

import moment from 'moment';

export default function PostDetail(props) {
  const [item, setItem] = useState(props.route.params.item);
  useEffect(() => {}, []);

  return (
    <>
      <ScrollView style={{backgroundColor: '#f4f6f8'}}>
        <View>
          <Header
            back={() => props.navigation.goBack()}
            label={'Post Details'}
          />

          <View style={Styles.UserInfoContainer}>
            <View style={Styles.AvatarContainer}>
              <View style={Styles.AvatarPhotoContainer}>
                <View style={Styles.UserNameContainer}>
                  <View style={Styles.UserNameWrap}>
                    <View>
                      <Text>{'returnup bot'}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{color: Colors.grey}}>
                      {moment(item.createAt).format('MM/DD')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={Styles.StuffInfoContainer}>
            <View>
              <Text style={{color: Colors.grey}}>{item.content}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
