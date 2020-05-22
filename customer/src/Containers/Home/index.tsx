// React
import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ProductCard from 'src/Components/Card/Product/ProductCard';
import HomeCarousel from 'src/Components/HomeCarousel/HomeCarousel';
import styles from './HomeViewStyle';
import {Images} from 'src/Theme';

import axios from 'axios';
import {baseUrl} from 'src/config';

import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible-accordion';
import {store} from 'src/Store';
import io from 'socket.io-client';

import {Location, ReGeocode} from './types';
import {checkPermissions, requestLocationPermission} from 'src/Permissions';

import AsyncStorage from '@react-native-community/async-storage';
import {RESULTS} from 'react-native-permissions';

const AMapGeolocation = NativeModules.AMapGeolocation;
const eventEmitter = new NativeEventEmitter(AMapGeolocation);

function HomeView(props) {
  const [state, dispatch] = useContext(store);

  const [isGpsDlgVisible, setIsGpsDlgVisible] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const [list, setList] = useState([]);
  const [key, setKey] = useState('');
  const [keyTmp, setKeyTmp] = useState('');

  const getList = () => {
    axios
      .get(baseUrl + 'api/stuffpost', {
        params: {
          sort: 0,
          key,
        },
      })
      .then(function(response) {
        setList(response.data);
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {});
  };

  const getLastNote = () => {
    axios
      .get(baseUrl + 'api/notification', {
        params: {limit: 1},
      })
      .then(function(response) {
        if (response.data.item === 0) {
          dispatch({type: 'setLastNote', payload: {content: ''}});
        } else {
          dispatch({type: 'setLastNote', payload: response.data});
        }
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {});
  };

  useEffect(() => {}, [list]);

  const getsignInfo = async () => {
    try {
      if (state.user._id) return;

      const rawSignInfo = await AsyncStorage.getItem('signInfo');

      if (!rawSignInfo) return;
      const signInfo = JSON.parse(rawSignInfo);
      dispatch({
        type: 'setTokenUser',
        payload: signInfo,
      });
      dispatch({
        type: 'setSocket',
        payload: io(baseUrl, {
          query: {user_id: signInfo.user._id},
          ransports: ['websocket'],
          jsonp: false,
        }),
      });
    } catch (error) {
      console.log('getSignInfo exception... ... ...', error);
    }
    return {};
  };

  useEffect(() => {
    getsignInfo();
  }, []);

  const ListArea = () => (
    <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
      {list.map((item, i) => (
        <ProductCard key={i} navigation={props.navigation} item={item} />
      ))}
    </ScrollView>
  );

  useEffect(
    () =>
      props.navigation.addListener('focus', () => {
        getLastNote();
        getList();
        dispatch({type: 'setCurrentScreen', payload: 'home'});
      }),
    [dispatch, getLastNote, getList, props.navigation, state.user._id],
  );

  useEffect(
    () =>
      props.navigation.addListener('blur', () =>
        console.log('Home Screen was unfocused'),
      ),
    [props.navigation],
  );

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <View style={styles.homeScrollView}>
          <View
            style={{
              width: Dimensions.get('window').width,
              height: Platform.OS === 'android' ? 25 : 40,
              paddingBottom: 3,
              backgroundColor: '#0084da',
              alignItems: 'flex-end',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setIsGpsDlgVisible(true);
              }}
            />
          </View>
          <View style={styles.HomeBannerContainer}>
            <HomeCarousel />
          </View>

          <View style={styles.HomeSearchContainer}>
            <View style={styles.HomeSearchArea}>
              <View style={styles.HomeSearchInputContainer}>
                <TextInput
                  placeholder={'keyword'}
                  style={styles.HomeSearchInput}
                  onChangeText={value => {
                    setKeyTmp(value);
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setKey(keyTmp);
                }}
                style={styles.HomeSearchBtn}>
                <Text>Search</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.HomeMainBtnGroup}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() =>
                  props.navigation.navigate('PostView', {kind: 'lost'})
                }>
                <Text style={{fontSize: 12}}>Posts</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() =>
              props.navigation.navigate('NewsView', {kind: 'found'})
            }>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style={{fontSize: 12}}>News</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.HomeCategoryContainer}>
          <View style={styles.HomeNotificationArea}>
            <Text style={styles.HomeNotificationText} numberOfLines={2}>
              {state.last_note.content ? state.last_note.content : ''}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default HomeView;
