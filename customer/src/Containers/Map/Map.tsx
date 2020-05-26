import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  UIManager,
  TouchableOpacity,
  Text,
  ViewPropTypes,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import Events from 'react-native-simple-events';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AutoCompleteInput from './AutoCompleteInput';

const PLACE_DETAIL_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';
const DEFAULT_DELTA = {latitudeDelta: 0.015, longitudeDelta: 0.0121};

const apiKey = 'AIzaSyDO-TS1el3z_uiyRXeauXl7MUAy_c_mMd4';
const displayName = 'eventS';

export default function Map() {
  let _map = useRef(null);
  let _input = useRef(null);

  const [state, setState] = useState({
    inputScale: new Animated.Value(1),
    inFocus: false,
    region: {
      ...DEFAULT_DELTA,
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    Events.listen('InputBlur', displayName, _onTextBlur);
    Events.listen('InputFocus', displayName, _onTextFocus);
    Events.listen('PlaceSelected', displayName, _onPlaceSelected);

    return () => {
      Events.rm('InputBlur', displayName);
      Events.rm('InputFocus', displayName);
      Events.rm('PlaceSelected', displayName);
    };
  }, []);

  const onLocationSelect = () => ({});

  const _animateInput = () => {
    Animated.timing(state.inputScale, {
      toValue: state.inFocus ? 1.2 : 1,
      duration: 300,
    }).start();
  };

  const _onMapRegionChange = region => {
    _setRegion(region, false);
    if (state.inFocus) {
      _input.current.blur();
    }
  };

  const _onMapRegionChangeComplete = region => {
    _input.current.fetchAddressForLocation(region);
  };

  const _onTextFocus = () => {
    state.inFocus = true;
    _animateInput();
  };

  const _onTextBlur = () => {
    state.inFocus = false;
    _animateInput();
  };

  const _setRegion = (region, animate = true) => {
    state.region = {...state.region, ...region};
    if (animate) _map.current.animateToRegion(state.region);
  };

  const _onPlaceSelected = placeId => {
    _input.current.blur();
    axios
      .get(`${PLACE_DETAIL_URL}?key=${apiKey}&placeid=${placeId}`)
      .then(({data}) => {
        let region = (({lat, lng}) => ({latitude: lat, longitude: lng}))(
          data.result.geometry.location,
        );
        _setRegion(region);
        setState({placeDetails: data.result});
      });
  };

  const _getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        _setRegion({latitude, longitude});
      },
      error => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: Infinity,
      },
    );
  };

  let {inputScale} = state;
  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        style={styles.mapView}
        region={state.region}
        showsMyLocationButton={true}
        showsUserLocation={false}
        onPress={({nativeEvent}) => _setRegion(nativeEvent.coordinate)}
        onRegionChange={_onMapRegionChange}
        onRegionChangeComplete={_onMapRegionChangeComplete}
      />
      <Entypo
        name={'location-pin'}
        size={30}
        color={'black'}
        style={{backgroundColor: 'transparent'}}
      />
      <View style={styles.fullWidthContainer}>
        <AutoCompleteInput
          ref={_input}
          apiKey={apiKey}
          style={[styles.input, {transform: [{scale: inputScale}]}]}
          debounceDuration={300}
          components={[]}
        />
      </View>
      <TouchableOpacity
        style={[styles.currentLocBtn, {backgroundColor: 'black'}]}
        onPress={_getCurrentLocation}>
        <MaterialIcons name={'my-location'} color={'white'} size={25} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() =>
          onLocationSelect({
            ...state.region,
            address: _input.current.getAddress(),
            placeDetails: state.placeDetails,
          })
        }>
        <View>
          <Text style={styles.actionText}>{'Done'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  fullWidthContainer: {
    position: 'absolute',
    width: '100%',
    top: 80,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 5,
  },
  currentLocBtn: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 70,
    right: 10,
  },
  actionButton: {
    backgroundColor: '#000',
    height: 50,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 23,
  },
});
