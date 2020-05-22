import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images, Colors} from 'src/Theme';
import Styles from './PostDetailsStyle';
import Style from 'src/Style';
import Header from 'src/Components/Header/Header';
import {store} from 'src/Store';
import moment from 'moment';
import {baseUrl} from 'src/config';
import RoundBtn from 'src/Components/Buttons/RoundBtn/RoundBtn';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import DialogInput from 'react-native-dialog-input';

import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';

export default function PostDetail(props) {
  const [state, dispatch] = useContext(store);
  const [item, setItem] = useState(props.route.params.item);
  const [dlgVisible, setDlgVisible] = useState(false);

  const sendMsg = item => {
    if (!state.user._id) {
      Toast.show('signin！');
      return;
    }
    if (item.user._id === state.user._id) {
      Toast.show('cant send to you');
      return;
    }
    props.navigation.navigate('ChatRoom', {guest: item.user});
  };

  const increaseBrowseCnt = () => {
    axios
      .post(baseUrl + 'api2/stuffpost/browse', {_id: item._id})
      .then(function(response) {
        if (response.data.item) {
          setItem(response.data.item);
        }
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  };

  const increaseLikesCnt = () => {
    if (state.user._id === undefined) {
      props.navigation.navigate('SignIn');
      return;
    }

    if (item.user._id === state.user._id) {
      Toast.show('error');
      return;
    }

    axios
      .post(baseUrl + 'api2/stuffpost/likes', {
        post_id: item._id,
        user_id: state.user._id,
      })
      .then(function(response) {
        if (response.data.item) {
          setItem(response.data.item);
        }
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  };

  const canReport = () => {
    if (state.user._id === undefined) {
      props.navigation.navigate('SignIn');
      return false;
    }
    if (!item.user || item.user._id === state.user._id) {
      Toast.show('error');
      return false;
    }

    let ret = true;

    item.reports.map(report => {
      if (report.user === state.user._id) {
        ret = false;
      }
    });

    if (!ret) Toast.show('already...');
    return ret;
  };

  const checkReport = () => {
    const couldI = canReport();
    if (couldI) setDlgVisible(true);
  };

  const reportPost = report => {
    if (state.user._id === undefined) {
      props.navigation.navigate('Signin');
      return;
    }

    axios
      .post(baseUrl + 'api2/stuffpost/report', {
        post_id: item._id,
        user_id: state.user._id,
        report,
      })
      .then(function(response) {
        if (response.data.item) {
          setItem(response.data.item);
        }
        Toast.show('success');
      })
      .catch(function(error) {
        console.log(error, 'fromthe report fasdf');
        Toast.show('error');
      })
      .finally(function() {
        // always executed
      });
  };

  useEffect(
    () =>
      props.navigation.addListener('focus', () => {
        increaseBrowseCnt();
        dispatch({type: 'setCurrentScreen', payload: 'post-detail'});
      }),
    [dispatch, increaseBrowseCnt, props.navigation, state.user._id],
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
      <ScrollView style={{backgroundColor: '#f4f6f8'}}>
        <View>
          <Header
            back={() => props.navigation.goBack()}
            label={'Product Details'}
          />

          <View style={Styles.UserInfoContainer}>
            <View style={Styles.AvatarContainer}>
              <View style={Styles.AvatarPhotoContainer}>
                <EvilIconsIcon name="user" style={{fontSize: 55}} />

                {false && (
                  <FastImage
                    style={Styles.AvatarPhoto}
                    source={{
                      uri: baseUrl + 'download/photo?path=' + item.user.photo,
                    }}
                    resizeMode="cover"
                  />
                )}
                <View style={{flex: 3}} />
              </View>
              <View style={Styles.UserNameContainer}>
                <View style={Styles.UserNameWrap}>
                  <View>
                    <Text>{item.merchant}</Text>
                  </View>
                </View>
                <View style={{paddingTop: 5}}>
                  <Text style={{color: Colors.grey, fontSize: 12}}>
                    {moment(item.createAt).format('MM/DD hh:mm')}
                  </Text>
                </View>
                {item.fee > 0 && (
                  <View style={{paddingTop: 5}}>
                    <Text style={{color: Colors.red, fontSize: 12}}>
                      {'$'}
                      {item.fee}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={Styles.StuffInfoContainer}>
            <View>
              <Text style={{color: Colors.grey}}>{item.description}</Text>
            </View>
            <View style={Styles.StuffImgContainer}>
              {item.photos.length > 0 &&
                item.photos.map((photo, i) => (
                  <FastImage
                    key={i}
                    source={{
                      uri: baseUrl + 'download/photo?path=' + photo.path,
                    }}
                    style={Styles.StuffImg}
                  />
                ))}
            </View>
            <View style={Styles.StuffReportContainer}>
              <TouchableOpacity
                onPress={() => {
                  checkReport();
                }}>
                {item.user._id !== state.user._id && (
                  <Text style={{color: Colors.grey}}>Report</Text>
                )}
              </TouchableOpacity>

              <View>
                <Text style={{color: Colors.grey}}>Browse{item.browse}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <DialogInput
        isDialogVisible={dlgVisible}
        title={'Report'}
        message={''}
        hintInput={''}
        submitInput={inputText => {
          if (inputText === '') {
            Toast.show('input error');
            return;
          }
          reportPost(inputText);
          setDlgVisible(false);
        }}
        closeDialog={() => {
          setDlgVisible(false);
        }}
        cancelText={'Cancel'}
        submitText={'Submit'}
      />
      <View style={Styles.CommentInputContainer}>
        <View style={Styles.CommentInputWrap} />
        <TouchableOpacity
          style={Styles.LikeCommentContainer}
          onPress={increaseLikesCnt}>
          <Text>{item.likes.length}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
