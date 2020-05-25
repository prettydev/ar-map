import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from 'src/Theme';
import CatListBtn from 'src/Components/Buttons/CatListBtn/CatListBtn';
import Styles from './FriendListStyle';
import Style from 'src/Style';
import Colors from 'src/Theme/Colors';
import Header from 'src/Components/Header/Header';
import ProductCard from 'src/Components/Card/Product/ProductCard';
import {tagJson} from 'src/config';
import {baseUrl} from 'src/config';
import {store} from 'src/Store';

import SearchBox from './SearchBox';
import Toast from 'react-native-simple-toast';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const axios = require('axios');

export default function FriendList(props) {
  const [state, dispatch] = useContext(store);

  const [tmp, setTmp] = useState('');
  const [key, setKey] = useState('');

  const handleSearch = () => {
    setKey(tmp);
  };

  const handleAccept = item => {
    axios
      .post(baseUrl + 'auth/accept', {
        item,
        user: state.user._id,
      })
      .then(function(response2) {
        Toast.show(response2.data.msg);

        dispatch({
          type: 'setUser',
          payload: response2.data.item,
        });
      })
      .catch(function(error) {
        Toast.show('error');
        console.log(JSON.stringify(error));
      });
  };

  useEffect(() => {
    console.log(state.user.friends);
  });

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={Styles.CategoryListContainer}>
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View style={{flex: 8}}>
            <SearchBox inputProc={setTmp} handleSearch={handleSearch} />
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('AddFriend');
              }}>
              <FontAwesome name="user-plus" style={{fontSize: 30}} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{padding: 10}}>
        {state.user.friends.map(
          (item, i) =>
            item.user.email.indexOf(tmp) > -1 && (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  flex: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                }}>
                <View flex={1}>
                  <EvilIconsIcon name="user" style={{fontSize: 50}} />
                </View>
                <View flex={4}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 20}}>{item.user.email}</Text>
                  </View>

                  {!item.state && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingTop: 5,
                      }}>
                      <View />
                      <TouchableOpacity onPress={() => handleAccept(item)}>
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: 18,
                          }}>
                          accept
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          Toast.show('Rejected!');
                        }}>
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: 18,
                          }}>
                          reject
                        </Text>
                      </TouchableOpacity>
                      <View />
                    </View>
                  )}
                </View>

                <View flex={1} />
              </View>
            ),
        )}
      </View>
    </ScrollView>
  );
}
