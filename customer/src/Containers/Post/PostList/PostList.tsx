import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from 'src/Theme';
import CatListBtn from 'src/Components/Buttons/CatListBtn/CatListBtn';
import Styles from './PostListStyle';
import Style from 'src/Style';
import Header from 'src/Components/Header/Header';
import ProductCard from 'src/Components/Card/Product/ProductCard';
import {tagJson} from 'src/config';
import {baseUrl} from 'src/config';
import {store} from 'src/Store';

import SearchBox from './SearchBox';

import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';

const axios = require('axios');

export default function PostList(props) {
  const [state, dispatch] = useContext(store);

  const [list, setList] = useState([]);
  const [tag, setTag] = useState('');

  const [tmp, setTmp] = useState('');
  const [key, setKey] = useState('');

  const handleSearch = () => {
    setKey(tmp);
  };

  const getList = () => {
    axios
      .get(baseUrl + 'api/stuffpost', {
        params: {
          tag,
          key,
        },
      })
      .then(function(response) {
        setList(response.data);
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  };

  useEffect(() => {
    getList();
  }, [tag, key]);

  useEffect(
    () =>
      props.navigation.addListener('focus', () => {
        getList();
        dispatch({type: 'setCurrentScreen', payload: 'post-list'});
      }),
    [],
  );

  useEffect(
    () =>
      props.navigation.addListener('blur', () =>
        console.log('Home Screen was unfocused'),
      ),
    [props.navigation],
  );

  return (
    <ScrollView style={{backgroundColor: '#f4f6f8'}}>
      <View style={Styles.CategoryListContainer}>
        <Header back={() => props.navigation.goBack()} label={'Product List'} />

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
                props.navigation.navigate('PostWrite');
              }}>
              <EvilIconsIcon name="plus" style={{fontSize: 30}} />
            </TouchableOpacity>
          </View>
        </View>
        {false && (
          <View style={Styles.CategoryListWrap}>
            <FlatList
              horizontal={false}
              numColumns={4}
              style={Styles.CategoryFlatList}
              data={tagJson}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    const currentTag = Object.values(item);
                    setTag(currentTag[0]);
                  }}>
                  <CatListBtn
                    title={Object.keys(item)}
                    imgSource={Object.values(item)}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </View>
      <View>
        {list.map((item, i) => (
          <ProductCard key={i} navigation={props.navigation} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}
