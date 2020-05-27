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

const apiKey = 'AIzaSyDOo1Y_JbCuuhs39Wt3i3iEyLgZXnqBkWo'; //unlimited key
const displayName = 'eventS';

const DEFAULT_DELTA = {latitudeDelta: 0.015, longitudeDelta: 0.0121};

export default function Map() {
  let _map = useRef(null);
  let _input = useRef(null);

  const inputScale = new Animated.Value(1);
  const [inFocus, setInFocus] = useState(false);

  const [loading, setLoading] = useState(true);
  const [routing, setRouting] = useState(false);

  const [origin, setOrigin] = useState({
    ...DEFAULT_DELTA,
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const [destination, setDestination] = useState(origin);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    _getCurrentLocation();

    Events.listen('InputBlur', displayName, _onTextBlur);
    Events.listen('InputFocus', displayName, _onTextFocus);
    Events.listen('PlaceSelected', displayName, _onPlaceSelected);

    return () => {
      Events.rm('InputBlur', displayName);
      Events.rm('InputFocus', displayName);
      Events.rm('PlaceSelected', displayName);
    };
  }, []);

  const drawRoute = () => {
    console.log('called drawRoute function...');
  };

  const goARNav = () => {
    console.log('called ar nav function...');
  };

  const _animateInput = () => {
    Animated.timing(inputScale, {
      toValue: inFocus ? 1.2 : 1,
      duration: 300,
    }).start();
  };

  const movoToRegion = (region, animate = true) => {
    setOrigin({...DEFAULT_DELTA, ...region});
    if (animate) _map.current.animateToRegion(region);
  };

  const _onMapRegionChange = region => {
    movoToRegion(region, false);
    if (inFocus) {
      _input.current.blur();
    }
  };

  const _onMapRegionChangeComplete = region => {
    if (_input.current) _input.current.fetchAddressForLocation(region);
  };

  const _onTextFocus = () => {
    setInFocus(true);
    _animateInput();
  };

  const _onTextBlur = () => {
    setInFocus(false);
    _animateInput();
  };

  const _onPlaceSelected = placeId => {
    _input.current.blur();
    axios
      .get(`${PLACE_DETAIL_URL}?key=${apiKey}&placeid=${placeId}`)
      .then(({data}) => {
        let region = (({lat, lng}) => ({latitude: lat, longitude: lng}))(
          data.result.geometry.location,
        );
        movoToRegion(region);
        console.log('placeDetails', data.result);
      });
  };

  const _getCurrentLocation = async () => {
    console.log('before getting the current location');
    await Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        movoToRegion({latitude, longitude});
        setLoading(false);
        console.log(
          '-------------------after getting the current location with success',
          position,
        );
      },
      error => {
        setLoading(false);
        console.log(
          '------------------after getting the current location with error',
          error.message,
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
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

  return (
    <View style={styles.container}>
      {
        <MapView
          ref={_map}
          style={styles.mapView}
          region={{
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          showsMyLocationButton={true}
          showsUserLocation={false}
          onPress={({nativeEvent}) => movoToRegion(nativeEvent.coordinate)}
          onRegionChange={_onMapRegionChange}
          onRegionChangeComplete={_onMapRegionChangeComplete}>
          {
            //   routing && (
            //   <MapViewDirections
            //     origin={region}
            //     destination={region2}
            //     // waypoints={coordinates.slice(1, -1)}
            //     mode="DRIVING"
            //     apikey={apiKey}
            //     language="en"
            //     strokeWidth={4}
            //     strokeColor="red"
            //     onStart={params => {
            //       console.log(
            //         `Started routing between "${params.origin}" and "${
            //           params.destination
            //         }"${
            //           params.waypoints.length
            //             ? ' using waypoints: ' + params.waypoints.join(', ')
            //             : ''
            //         }`,
            //       );
            //     }}
            //     onReady={onReady}
            //     onError={onError}
            //     resetOnChange={false}
            //   />
            // )
          }
        </MapView>
      }
      <Entypo
        name={'location-pin'}
        size={30}
        color={'black'}
        style={{backgroundColor: 'transparent'}}
      />
      <View style={styles.fullWidthContainer}>
        {
          <AutoCompleteInput
            ref={_input}
            apiKey={apiKey}
            style={[styles.input, {transform: [{scale: inputScale}]}]}
            debounceDuration={300}
            components={[]}
          />
        }
      </View>
      <TouchableOpacity
        style={styles.currentLocBtn}
        onPress={_getCurrentLocation}>
        <MaterialIcons name={'my-location'} color={'white'} size={25} />
      </TouchableOpacity>
      <View style={styles.actionView}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => drawRoute()}>
          <View>
            <Text style={styles.actionText}>{'Route'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => goARNav()}>
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
