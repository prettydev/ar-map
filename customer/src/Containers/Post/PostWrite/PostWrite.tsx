import React, {useState, useEffect, useContext, useReducer} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Styles from './PostWriteStyle';
import Style from 'src/Style';
import Header from 'src/Components/Header/Header';
import CustomFormSelect from 'src/Components/CustomForm/CustomFormSelect/CustomFormSelect';
import {Colors, Images} from 'src/Theme';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import {store} from 'src/Store';
import axios from 'axios';
import {baseUrl, photoSize} from 'src/config';

import {RESULTS} from 'react-native-permissions';
import {checkCamLibPermission} from 'src/Permissions';

import {reasonArr, catArr} from 'src/config';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

const PostWrite = props => {
  const [state, dispatch] = useContext(store);

  const [reason, setReason] = useState(0);
  const [category, setCategory] = useState(0);

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      address: '',
      phone: '',
      email: '',
      purchase: '',
      tracking: '',
      merchant: '',
      description: '',
    },
  );

  const [photo, setPhoto] = useState([]);

  const handlePhoto = async () => {
    if (photo.length > 4) {
      Toast.show(`It's over the limit`);
      return;
    }

    if (Platform.OS === 'android') {
      const ret = await checkCamLibPermission();
      if (!ret) return;
    }

    ImagePicker.showImagePicker(
      // {
      //   title: 'select 1 picture',
      //   cancelButtonTitle: 'cancel',
      //   takePhotoButtonTitle: 'take',
      //   chooseFromLibraryButtonTitle: 'take a picture',
      // },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          ImageResizer.createResizedImage(
            response.uri,
            photoSize,
            photoSize,
            'JPEG',
            100,
            0,
          )
            .then(({uri, path, name, size}) => {
              console.log('uri', uri, 'path', path, 'name', name, 'size', size);
              setPhoto([...photo, {uri, name, type: 'image/jpeg'}]);
              if (photo.length > 4) Toast.show(`It's over the limit`);
            })
            .catch(err => {
              console.log('resize error... ... ...', err);
            });
        }
      },
    );
  };

  async function handleSubmit() {
    if (
      reason === 0 ||
      category === 0 ||
      userInput.email === '' ||
      userInput.address === '' ||
      userInput.description === '' ||
      userInput.purchase === '' ||
      userInput.tracking === '' ||
      userInput.merchant === ''
    ) {
      Toast.show('Input error!');
      return;
    }

    if (photo && photo.length > 0) {
      let formData = new FormData();
      photo.forEach(ph => {
        formData.append('photo', ph);
      });

      await axios
        .post(baseUrl + 'upload/photo', formData)
        .then(response => {
          const photos = response.data.photo;
          axios
            .post(baseUrl + 'api/stuffpost', {
              address: userInput.address,
              phone: userInput.phone,
              email: userInput.email,
              purchase: userInput.purchase,
              tracking: userInput.tracking,
              merchant: userInput.merchant,
              category,
              reason,
              description: userInput.description,
              photos,
              user: state.user._id,
              title: state.user.name,
            })
            .then(function(response2) {
              Toast.show(response2.data.msg);
              if (response2.data.success) {
                props.navigation.navigate('PostList');
              }
            })
            .catch(function(error) {
              Toast.show('error');
              console.log(JSON.stringify(error));
            });
        })
        .catch(error => {
          console.log(JSON.stringify(error));
        });
    } else {
      Toast.show('Select pictures!');
      return;
    }
  }

  useEffect(
    () =>
      props.navigation.addListener('focus', () => {
        if (!state.user._id) props.navigation.navigate('Signin');
        dispatch({type: 'setCurrentScreen', payload: 'lost-screen'});
      }),
    [dispatch, props.navigation, state.user._id],
  );

  useEffect(
    () =>
      props.navigation.addListener('blur', () =>
        console.log('Post Screen was unfocused'),
      ),
    [props.navigation],
  );

  return (
    <ScrollView style={Styles.FindStuffScreenContainer}>
      <Header
        back={() => props.navigation.navigate('PostList')}
        label={'Upload Product'}
      />

      <View style={Styles.StuffInfoContainer}>
        <View style={Styles.FindStuffDetailAreaContainer}>
          <View>
            <Text>Address</Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={Styles.FindStuffDetailAreaInput}
              value={userInput.address}
              onChangeText={value => setUserInput({['address']: value})}
            />
          </View>
        </View>
        <View style={Styles.FindStuffDetailAreaContainer}>
          <View>
            <Text>Phone</Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={Styles.FindStuffDetailAreaInput}
              value={userInput.phone}
              onChangeText={value => setUserInput({['phone']: value})}
              keyboardType={'numeric'}
            />
          </View>
        </View>
        <View style={Styles.FindStuffDetailAreaContainer}>
          <View>
            <Text>Email</Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={Styles.FindStuffDetailAreaInput}
              value={userInput.email}
              onChangeText={value => setUserInput({['email']: value})}
            />
          </View>
        </View>

        <View style={Styles.FindStuffDetailAreaContainer}>
          <View>
            <Text>Purchase</Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={Styles.FindStuffDetailAreaInput}
              value={userInput.purchase}
              onChangeText={value => setUserInput({['purchase']: value})}
              keyboardType={'numeric'}
            />
          </View>
        </View>
        <View style={Styles.FindStuffDetailAreaContainer}>
          <View>
            <Text>Tracking</Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={Styles.FindStuffDetailAreaInput}
              value={userInput.tracking}
              onChangeText={value => setUserInput({['tracking']: value})}
              keyboardType={'numeric'}
            />
          </View>
        </View>
        <View style={Styles.FindStuffDetailAreaContainer}>
          <View>
            <Text>Merchant</Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={Styles.FindStuffDetailAreaInput}
              value={userInput.merchant}
              onChangeText={value => setUserInput({['merchant']: value})}
            />
          </View>
        </View>
        <View>
          <CustomFormSelect
            CustomFormSelectLabel={'Category'}
            CustomFormSelectPlaceholder={'Select product category!'}
            procFunc={value => setCategory(value)}
            itemArr={catArr}
          />
        </View>
        <View>
          <CustomFormSelect
            CustomFormSelectLabel={'Reason'}
            CustomFormSelectPlaceholder={'Select return up reason!'}
            procFunc={value => setReason(value)}
            itemArr={reasonArr}
          />
        </View>
      </View>
      <View style={Styles.FindStuffFooter}>
        <View>
          <Text>Description</Text>
          <TextInput
            style={Styles.FindStuffTextArea}
            multiline={true}
            numberOfLines={4}
            value={userInput.description}
            onChangeText={value => setUserInput({['description']: value})}
          />
        </View>
        <View style={Styles.FindStuffImgUploadContainer}>
          <TouchableOpacity
            style={Styles.FindStuffImgUploadWrap}
            onPress={handlePhoto}>
            <Text style={{color: Colors.grey}}>Upload pictures</Text>
          </TouchableOpacity>
        </View>

        <View style={Styles.FindStuffImgGroupContainer}>
          {photo &&
            photo.map((ph, i) => (
              <View style={{}}>
                <FastImage
                  key={i}
                  source={ph}
                  style={{
                    width: 70,
                    height: 70,
                    marginBottom: -15,
                    marginTop: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setPhoto(photo.filter(p => p.uri != ph.uri));
                  }}
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: Colors.warmBlue,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: '#fff'}}>{'×'}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </View>
      <View style={Styles.FindStuffSubBtnContainer}>
        <TouchableOpacity style={Styles.FindStuffSubBtn} onPress={handleSubmit}>
          <Text style={Styles.FindStuffSubBtnText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PostWrite;
