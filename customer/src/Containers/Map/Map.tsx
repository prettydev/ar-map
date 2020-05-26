import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
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
import MapViewDirections from 'react-native-maps-directions';
import AutoCompleteInput from './AutoCompleteInput';

const {width, height} = Dimensions.get('window');

const PLACE_DETAIL_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';
const DEFAULT_DELTA = {latitudeDelta: 0.015, longitudeDelta: 0.0121};

const apiKey = 'AIzaSyDOo1Y_JbCuuhs39Wt3i3iEyLgZXnqBkWo'; //unlimited key
const displayName = 'eventS';

const coordinates = [
  {latitude: 37.79879, longitude: -122.442753},
  {latitude: 37.790651, longitude: -122.422497},
];

export default function Map() {
  let _map = useRef(null);
  let _input = useRef(null);

  const [state, setState] = useState({
    inputScale: new Animated.Value(1),
    inFocus: false,
    region: {
      ...DEFAULT_DELTA,

      latitude: 37.771707,
      longitude: -122.4053769,
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

  const onLocationSelect = params => {
    // {
    // address: "1 Rue Joseph Gay Lussac, 26100 Romans-sur-Isère, France",
    // latitude: 45.05234371964782,
    // latitudeDelta: 0.015001959785394092,
    // longitude: 5.078941639512777,
    // longitudeDelta: 0.014334060251711911,
    // }

    console.log(params);
  };

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

  const onReady = result => {
    _map.current.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: width / 10,
        bottom: height / 10,
        left: width / 10,
        top: height / 10,
      },
    });
  };

  const onError = errorMessage => {
    console.log(errorMessage); // eslint-disable-line no-console
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
        onRegionChangeComplete={_onMapRegionChangeComplete}>
        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[coordinates.length - 1]}
          waypoints={coordinates.slice(1, -1)}
          mode="DRIVING"
          apikey={apiKey}
          language="en"
          strokeWidth={4}
          strokeColor="red"
          onStart={params => {
            console.log(
              `Started routing between "${params.origin}" and "${
                params.destination
              }"${
                params.waypoints.length
                  ? ' using waypoints: ' + params.waypoints.join(', ')
                  : ''
              }`,
            );
          }}
          onReady={onReady}
          onError={onError}
          resetOnChange={false}
        />
      </MapView>
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

      <MapViewDirections
        origin={coordinates[0]}
        destination={coordinates[coordinates.length - 1]}
        waypoints={coordinates.slice(1, -1)}
        mode="DRIVING"
        apikey={apiKey}
        language="en"
        strokeWidth={4}
        strokeColor="red"
        onStart={params => {
          console.log(
            `Started routing between "${params.origin}" and "${
              params.destination
            }"${
              params.waypoints.length
                ? ' using waypoints: ' + params.waypoints.join(', ')
                : ''
            }`,
          );
        }}
        onReady={onReady}
        onError={onError}
        resetOnChange={false}
      />
      <TouchableOpacity
        style={[styles.currentLocBtn, {backgroundColor: 'black'}]}
        onPress={_getCurrentLocation}>
        <MaterialIcons name={'my-location'} color={'white'} size={25} />
      </TouchableOpacity>
      <View style={styles.actionView}>
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
            <Text style={styles.actionText}>{'Route'}</Text>
          </View>
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
            <Text style={styles.actionText}>{'Navigate'}</Text>
          </View>
        </TouchableOpacity>
      </View>
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
  actionView: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 5,
    flex: 3,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'gray',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    margin: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 23,
  },
});
