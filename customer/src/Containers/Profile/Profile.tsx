import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TextInput,
  Button,
  Image,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import {Images} from 'src/Theme';
import Style from './ProfileStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {store} from 'src/Store';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import Modal from 'react-native-modal';
import {baseUrl, appVersion, avatarSize} from 'src/config';
import {RESULTS} from 'react-native-permissions';

import {checkCamLibPermission} from 'src/Permissions';

const Profile = props => {
  const [state, dispatch] = useContext(store);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [photo, setPhoto] = useState({uri: ''});
  const [name, setName] = useState(state.user.name ? state.user.name : '');
  const [service, setService] = useState('aaaaaaaa');
  const [current, setCurrent] = useState('');

  const handleModal = idx => {
    setCurrent(idx);
    updateProfile(idx);
    setIsModalVisible(!isModalVisible);
  };

  const updateProfile = idx => {
    if (idx === 'service') setService(state.profile.service);
    else if (idx === 'about') setService(state.profile.about);
    else if (idx === 'share') setService(state.profile.share);
    else if (idx === 'phone') setService(state.profile.phone);
    else if (idx === 'upgrade') {
      let versionDescription = '';
      if (appVersion === state.profile.version) {
        versionDescription =
          '您的应用是最新版本(' + state.profile.version + ').';
      } else {
        versionDescription =
          '您的应用是旧版本(' +
          appVersion +
          ').' +
          (state.profile.version
            ? '最新版本是' + state.profile.version + '.'
            : '');
      }
      setService(versionDescription);
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const handleSignout = async () => {
    // state.socket.disconnect({user_id: state.user._id});
    // state.socket.on('disconnect', reason => {
    props.navigation.navigate('PostList');
    dispatch({
      type: 'setTokenUser',
      payload: {user: {}, token: '', socket: null},
    });
    AsyncStorage.clear();
    // });
  };

  const handlePhoto = async () => {
    if (Platform.OS === 'android') {
      const ret = await checkCamLibPermission();
      console.log('111111111111111', ret);
      if (!ret) return;
    }

    ImagePicker.showImagePicker(
      {
        title: '选择一张照片',
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照',
        chooseFromLibraryButtonTitle: '从照片中选择',
      },
      response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          ImageResizer.createResizedImage(
            response.uri,
            avatarSize,
            avatarSize,
            'JPEG',
            100,
            0,
          )
            .then(({uri, path, name, size}) => {
              console.log('uri', uri, 'path', path, 'name', name, 'size', size);

              setPhoto({uri});
              let formData = new FormData();
              const file = {
                uri,
                name,
                type: 'image/jpeg',
              };
              formData.append('file', file);

              changePhoto(formData);
            })
            .catch(err => {
              console.log('resize error... ... ...', err);
            });
        }
      },
    );
  };

  async function changePhoto(formData) {
    await axios
      .post(baseUrl + 'upload/file', formData)
      .then(response => {
        axios
          .put(
            baseUrl + 'api2/user/' + state.user._id,
            {
              photo: response.data.file.path,
            },
            {
              headers: {auth_token: state.auth_token},
            },
          )
          .then(function(response) {
            Toast.show('成功!');
          })
          .catch(function(error) {
            console.log('eeeeeerrrrrrrrr', error);
            // Toast.show('错误');
          });
      })
      .catch(error => {
        console.log(error);
        Toast.show('失败了!');
      });
  }

  async function handleSubmit() {
    if (name === '') {
      Toast.show('正确输入值!');
      return;
    }

    axios
      .put(
        baseUrl + 'api2/user/' + state.user._id,
        {
          name,
        },
        {
          headers: {auth_token: state.auth_token},
        },
      )
      .then(function(response) {
        if (response.data.success) {
          dispatch({type: 'setUser', payload: response.data.user});
          Toast.show('success!');
          setIsEdit(false);
        } else {
          Toast.show('error!');
        }
      })
      .catch(function(error) {
        console.log('eeeeeerrrrrrrrr', error);
        // Toast.show('error');
      });
  }

  useEffect(() => {
    (async () => {
      await axios
        .post(baseUrl + 'api/profile/last')
        .then(function(response) {
          if (response.data.item) {
            dispatch({type: 'setProfile', payload: response.data.item});
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          // always executed
        });

      console.log('refreshing...........................');
    })();
  }, [dispatch]);

  useEffect(() => {
    console.log('refreshing...');
    updateProfile(current);
  }, [current, photo, state.profile, updateProfile]);

  useEffect(
    () =>
      props.navigation.addListener('focus', () => {
        if (!state.user._id) props.navigation.navigate('Signin');
        else dispatch({type: 'setCurrentScreen', payload: 'profile'});
      }),
    [dispatch, props.navigation, state.user._id],
  );

  useEffect(
    () =>
      props.navigation.addListener('blur', () =>
        console.log('Profile Screen was unfocused'),
      ),
    [props.navigation],
  );

  return (
    <ScrollView style={Style.ProfileContainer}>
      <ImageBackground
        source={Images.Slide1}
        style={Style.ProfileHeaderContainer}>
        <View style={Style.ProfileHeaderTitleContainer}>
          <Text style={Style.ProfileHeaderTitleText}>我的</Text>
        </View>
        <View style={Style.ProfileHeaderAvatarContainer}>
          <TouchableOpacity
            onPress={handlePhoto}
            style={{
              marginRight: 15,
              // resizeMode: 'cover',
              borderRadius: 30,
            }}>
            <Image
              source={
                photo.uri
                  ? photo
                  : {
                      uri: baseUrl + 'download/photo?path=' + state.user.photo,
                    }
              }
              style={Style.ProfileHeaderAvatarImg}
              // resizeMode="cover"
            />
          </TouchableOpacity>
          <View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  setIsEdit(!isEdit);
                }}
              />
            </View>
            <Text style={{color: Colors.white, fontSize: 12}}>
              {state.user.name}
            </Text>
            <Text style={{color: Colors.white, fontSize: 12}}>
              {state.user.phone}
            </Text>

            {isEdit && (
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    width: '50%',
                    padding: 0,
                  }}
                  onChangeText={value => setName(value)}
                />
                <TouchableOpacity onPress={handleSubmit}>
                  <Text
                    style={{
                      color: 'white',
                      marginTop: 3,
                    }}>
                    save
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
      <View style={Style.ProfileBtnGroupContainer}>
        <View style={Style.ProfileBtnGroupWrap}>
          <TouchableOpacity
            style={Style.ProfileBtnPublishedContainer}
            onPress={() => {
              handleModal('service');
            }}>
            <Text>service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Style.ProfileLikeContainer}
            onPress={() => {
              handleModal('phone');
            }}>
            <Text>contact us</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={Style.ProfileFunctionContainer}>
        <TouchableOpacity
          style={Style.ProfileUpdateContainer}
          onPress={() => {
            handleModal('upgrade');
          }}>
          <View style={Style.ProfileUpdateWrap}>
            <View style={Style.ProfileUpdateLeft}>
              <Text>check update</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.ProfileContactUsContainer}
          onPress={() => {
            handleModal('about');
          }}>
          <View style={Style.ProfileContactUsWrap}>
            <View style={Style.ProfileContactUsLeft}>
              <Text>About us</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.ProfileIntroContainer}
          onPress={() => {
            handleModal('share');
          }}>
          <View style={Style.ProfileContactUsWrap}>
            <View style={Style.ProfileContactUsLeft}>
              <Text>share</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={Style.BottomContainer} onPress={handleSignout}>
        <View style={Style.BottomBtnWrap}>
          <Text style={Style.BottomBtnText}>sign out</Text>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        style={{
          backgroundColor: '#fff',
          marginTop: 100,
          marginBottom: 100,
          marginLeft: 30,
          marginRight: 30,
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              flex: 5,
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            {current === 'share' && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <QRCode value={state.profile.share} size={200} />
              </View>
            )}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 25,
              }}>
              <Text>{service}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View style={{flex: 1}} />
            <View style={{width: '50%'}}>
              <Button
                title="close"
                onPress={() => {
                  setIsModalVisible(!isModalVisible);
                }}
              />
            </View>
            <View style={{flex: 1}} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
export default Profile;
