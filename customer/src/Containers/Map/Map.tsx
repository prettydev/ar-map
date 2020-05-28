import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';
import Events from 'react-native-simple-events';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AutoCompleteListView from './AutoCompleteListView';
import MapViewDirections from 'react-native-maps-directions';
import Colors from 'src/Theme/Colors';

const {width, height} = Dimensions.get('window');

const PLACE_DETAIL_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';

const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const DEFAULT_DELTA = {latitudeDelta: 0.015, longitudeDelta: 0.0121};

const apiKey = 'AIzaSyDOo1Y_JbCuuhs39Wt3i3iEyLgZXnqBkWo';

export default function LocationView() {
  const [ready, setReady] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const [inFocus, setInFocus] = useState(false);
  const [region, setRegion] = useState({
    ...DEFAULT_DELTA,
    latitude: 37,
    longitude: -122,
  });

  const [start, setStart] = useState({latitude: 0, longitude: 0});
  const [end, setEnd] = useState({latitude: 0, longitude: 0});

  const path = [start, end];

  const _input = useRef();
  const _map = useRef();

  const onLocationSelect = _ => {
    console.log('navigate...');
  };

  const _onMapRegionChange = rg => {
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&', rg);

    if (inFocus) {
      _input.current.blur();
      setInFocus(false);
    }
  };

  const fetchAddressForLocation = location => {
    setLoading(true);
    setPredictions([]);
    let {latitude, longitude} = location;

    setEnd({latitude, longitude});
    // _setRegion({latitude, longitude}, false);

    axios
      .get(
        `${REVRSE_GEO_CODE_URL}?key=${apiKey}&latlng=${latitude},${longitude}`,
      )
      .then(({data}) => {
        console.log('*********************************', data);
        setLoading(false);
        let {results} = data;
        if (results.length > 0) {
          let {formatted_address} = results[0];
          setText(formatted_address);
        }
      })
      .catch(function(error) {
        console.log(error, 'eeeeeeeeeeeeeeeeeeeeee');
      });
  };

  const _onMapPressed = rg => {
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', rg);

    setEnd(rg);
    // _setRegion(rg, false);

    if (inFocus) {
      _input.current.blur();
      setInFocus(false);
    }
  };

  const _setRegion = (rg, animate = true) => {
    setRegion({...region, ...rg});
    // if (animate && ready) _map.current.animateToRegion(region);
    console.log('======ttttttttttttttttttttt', start);
    console.log('======ddddddddddddddddddddd', end);
  };

  const _getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;

        setStart({latitude, longitude});
        _setRegion({latitude, longitude});

        console.log('current location is ', position);
        setReady(true);
      },
      error => console.log(error.message),
    );
  };

  const _onPlaceSelected = placeId => {
    _input.current.blur();
    axios
      .get(`${PLACE_DETAIL_URL}?key=${apiKey}&placeid=${placeId}`)
      .then(({data}) => {
        let rg = (({lat, lng}) => ({latitude: lat, longitude: lng}))(
          data.result.geometry.location,
        );

        setEnd(rg);
        // _setRegion(rg);

        console.log('search result...', rg);
      });
  };

  const _request = text => {
    if (text.length >= 3) {
      axios
        .get(AUTOCOMPLETE_URL, {
          params: {
            input: text,
            key: apiKey,
            language: 'en',
            components: [],
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

  const _onFocus = () => {
    setLoading(false);
    setInFocus(true);
    Events.trigger('InputFocus');
  };

  const _onBlur = () => {
    setInFocus(false);
    Events.trigger('InputBlur');
  };

  useEffect(() => {
    _getCurrentLocation();

    Events.listen('PlaceSelected', 'DetailID', _onPlaceSelected);

    return () => {
      Events.rm('PlaceSelected', 'DetailID');
    };
  }, []);

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

  const mapMarkers = () => {
    return path.map((pt, i) => (
      <Marker
        key={i}
        coordinate={{latitude: pt.latitude, longitude: pt.longitude}}
        title={i === 0 ? 'start' : 'end'}
        pinColor={i === 0 ? 'red' : 'green'}
        description={'Welcome'}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {
        <MapView
          ref={_map}
          style={styles.mapView}
          region={region}
          showsMyLocationButton={true}
          showsUserLocation={false}
          onPress={({nativeEvent}) => _onMapPressed(nativeEvent.coordinate)}
          onRegionChange={_onMapRegionChange}
          // onRegionChangeComplete={fetchAddressForLocation}
        >
          <MapViewDirections
            origin={start}
            destination={end}
            // waypoints={coordinates.slice(1, -1)}
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
          {mapMarkers()}
        </MapView>
      }

      {false && (
        <Entypo
          name={'location-pin'}
          size={30}
          color={'black'}
          style={{backgroundColor: 'transparent'}}
        />
      )}

      <View style={styles.fullWidthContainer}>
        <View style={styles.textInputContainer} elevation={5}>
          <TextInput
            ref={_input}
            value={loading ? 'Loading...' : text}
            style={[styles.textInput, styles.input]}
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
      </View>

      {false && (
        <TouchableOpacity
          style={[styles.currentLocBtn, {backgroundColor: 'black'}]}
          onPress={_getCurrentLocation}>
          <MaterialIcons name={'my-location'} color={'white'} size={25} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.actionButton]}
        onPress={() => onLocationSelect()}>
        <View>
          <Text style={styles.actionText}>{'Navigate'}</Text>
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
    top: 0,
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
    backgroundColor: Colors.primaryAlpha,
    height: 40,
    position: 'absolute',
    bottom: 0,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 22,
  },
  ////////////////////////

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
