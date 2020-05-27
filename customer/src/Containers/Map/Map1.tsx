import React, {useEffect, useRef, forwardRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  UIManager,
  TouchableOpacity,
  Text,
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

const apiKey = 'AIzaSyDOo1Y_JbCuuhs39Wt3i3iEyLgZXnqBkWo';

const displayName = 'eventS';

export default function LocationView() {
  const inputScale = new Animated.Value(1);
  const [inFocus, setInFocus] = useState(false);
  const [region, setRegion] = useState({
    ...DEFAULT_DELTA,
    latitude: 37,
    longitude: -122,
  });

  const _input = useRef();
  const _map = useRef();

  const onLocationSelect = addr => {
    console.log(addr);
  };

  const _animateInput = () => {
    Animated.timing(inputScale, {
      toValue: inFocus ? 1.2 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const _onMapRegionChange = rg => {
    _setRegion(rg, false);
    if (inFocus) {
      _input.current.blur();
    }
  };

  const _onMapRegionChangeComplete = rg => {
    _input.current.fetchAddressForLocation(rg);
  };

  const _onTextFocus = () => {
    setInFocus(true);
    _animateInput();
  };

  const _onTextBlur = () => {
    setInFocus(false);
    _animateInput();
  };

  const _setRegion = (rg, animate = true) => {
    setRegion({...region, ...rg});
    if (animate) _map.current.animateToRegion(region);
  };

  const _onPlaceSelected = placeId => {
    _input.current.blur();
    axios
      .get(`${PLACE_DETAIL_URL}?key=${apiKey}&placeid=${placeId}`)
      .then(({data}) => {
        let rg = (({lat, lng}) => ({latitude: lat, longitude: lng}))(
          data.result.geometry.location,
        );
        _setRegion(rg);
        console.log('placeDetails...', data.result);
      });
  };

  const _getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({latitude, longitude});
      },
      error => console.log(error.message),
    );
  };

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

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        style={styles.mapView}
        // region={region}
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
        style={[styles.actionButton]}
        onPress={() => onLocationSelect(_input.current.getAddress())}>
        <View>
          <Text style={[styles.actionText]}>{'Done'}</Text>
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
