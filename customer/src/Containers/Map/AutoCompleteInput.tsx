import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AutoCompleteListView from './AutoCompleteListView';
import axios, {CancelToken} from 'axios';
import Events from 'react-native-simple-events';

const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export default forwardRef((props, ref) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inFocus, setInFocus] = useState(false);
  const [text, setText] = useState('');

  useImperativeHandle(ref, () => ({
    fetchAddressForLocation: location => {
      // console.log(location, '333333333333333333333333333333');
      // setLoading(true);
      // setPredictions([]);
      // let {latitude, longitude} = location;
      // axios
      //   .get(
      //     `${REVRSE_GEO_CODE_URL}?key=${
      //       props.apiKey
      //     }&latlng=${latitude},${longitude}`,
      //   )
      //   .then(({data}) => {
      //     console.log(data, '00000000000000000000000000000000');
      //     // setLoading(false);
      //     // let {results} = data;
      //     // if (results.length > 0) {
      //     //   let {formatted_address} = results[0];
      //     //   setText(formatted_address);
      //     // }
      //   })
      //   .catch(function(error) {
      //     console.log(error, 'eeeeeeeeeeeeeeeeeeeeee');
      //   })
      //   .finally(function() {
      //     console.log('final5555555555555555555555');
      //   });
    },
    blur: () => {
      ref.current.blur();
    },
  }));

  const _request = text => {
    if (text.length >= 3) {
      axios
        .get(AUTOCOMPLETE_URL, {
          params: {
            input: text,
            key: props.apiKey,
            language: props.language,
            components: props.components.join('|'),
          },
        })
        .then(({data}) => {
          let {predictions} = data;
          setPredictions(predictions);
        });
    } else {
      setPredictions([]);
    }
  };

  const _onChangeText = text => {
    _request(text);
    setText(text);
  };

  const _onFocus = () => {
    setLoading(false);
    setInFocus(true);
    Events.trigger('InputFocus');
  };

  const _onBlur = () => {
    setInFocus(false);
    Events.trigger('InputBlur');
  };

  const _onPressClear = () => {
    setText('');
    setPredictions([]);
  };

  const _getClearButton = () =>
    inFocus ? (
      <TouchableOpacity style={styles.btn} onPress={_onPressClear}>
        <MaterialIcons name={'clear'} size={20} />
      </TouchableOpacity>
    ) : null;

  const getAddress = () => (loading ? '' : text);

  return (
    <>
      <View style={styles.textInputContainer} elevation={5}>
        <TextInput
          ref={ref}
          value={loading ? 'Loading...' : text}
          style={styles.textInput}
          underlineColorAndroid={'transparent'}
          placeholder={'Search'}
          onFocus={_onFocus}
          onBlur={_onBlur}
          onChangeText={_onChangeText}
          outlineProvider="bounds"
          autoCorrect={false}
          spellCheck={false}
        />
        {_getClearButton()}
      </View>
      <View style={styles.listViewContainer}>
        <AutoCompleteListView predictions={predictions} />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    height: 40,
    zIndex: 99,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.24,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    color: '#404752',
  },
  btn: {
    width: 30,
    height: 30,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listViewContainer: {
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 3,
  },
});
