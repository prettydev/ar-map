import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  Button,
  Image,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';

import Carousel from './Carousel';

import Events from 'react-native-simple-events';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AutoCompleteListView from './AutoCompleteListView';
import MapViewDirections from 'react-native-maps-directions';
import Colors from 'src/Theme/Colors';
import Modal from 'react-native-modal';
import {baseUrl, apiKey} from 'src/config';
import Geocoder from 'react-native-geocoding';
import Toast from 'react-native-simple-toast';
import CtlBtn from './CtlBtn';

import {store} from 'src/Store';

const {width, height} = Dimensions.get('window');

const PLACE_DETAIL_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';

const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const BUILDING_URL = baseUrl + 'api/building';
const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const DEFAULT_DELTA = {latitudeDelta: 0.015, longitudeDelta: 0.0121};

Geocoder.init(apiKey);

// Geocoder.init(apiKey, {language : "en"}); // set the language

export default function LocationView() {
  const [state, dispatch] = useContext(store);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const [kind, setKind] = useState(0); //address, building for button effect
  const [pointer, setPointer] = useState('route'); // current, target location flag for button effect
  const [mode, setMode] = useState('DRIVING'); //  car, walk flag for button effect
  const [saved, setSaved] = useState(false); // saved state of the car location

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const [inFocus, setInFocus] = useState(false);

  //  current viewpoint of the map
  const [region, setRegion] = useState({
    ...DEFAULT_DELTA,
    latitude: 37,
    longitude: -122,
  });

  //  current location
  //  const [current, setCurrent] = useState(region);
  //  target location
  const [target, setTarget] = useState(region);
  //  car location
  const [car, setCar] = useState();

  const [targetInfo, setTargetInfo] = useState({
    title: '',
    description: '',
    image: [],
    distance: 0, //km
    duration: 0, //min
  });

  // const path = [current, target];
  const path = [state.location, target];

  const _input = useRef();
  const _map = useRef();

  const _onMapRegionChange = rg => {
    // if (inFocus) {
    //   _input.current.blur();
    //   setInFocus(false);
    // }
  };

  const fetchAddressForLocation = location => {
    /**
    setLoading(true);
    setPredictions([]);
    let {latitude, longitude} = location;

    setTarget({latitude, longitude});
    // _setRegion({latitude, longitude}, false);

    axios
      .get(
        `${REVRSE_GEO_CODE_URL}?key=${apiKey}&latlng=${latitude},${longitude}`,
      )
      .then(({data}) => {
        setLoading(false);
        let {results} = data;
        if (results.length > 0) {
          let {formatted_address} = results[0];
          setText(formatted_address);
        }
      })
      .catch(function(error) {
        console.log(error);
      });

       */
  };

  const _onMapPressed = rg => {
    console.log('map pressed...', rg);
  };

  /**
   * update current view area of the map
   * @param rg
   * @param animate
   */
  const _setRegion = (rg, animate = true) => {
    setRegion({...region, ...rg});
    if (animate) _map.current.animateToRegion(region);
  };

  /**
   * get current device location, just get data, don't move the view area of the map   *
   
  const _getCurrentLocation = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrent({latitude, longitude});
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  */

  /**
   * update view area of the map as current area, and set button flag as 'current'
   */
  const viewCurrentLocation = () => {
    // _setRegion(current);
    _setRegion(state.location);
    setPointer('current');
  };

  /**
   * update view area of the map as target area, and set button flag as 'target'
   */
  const viewTargetLocation = () => {
    _setRegion(target);
    setPointer('target');
  };

  /**
   * update view area of the map as target area, and set button flag as 'target'
   */
  const viewCarLocation = () => {
    if (!car) {
      Toast.show('Not saved car location!');
      return;
    }
    _setRegion(car);
    setPointer('car');
  };

  /**
   * update view area of the map as target area, and set button flag as 'target'
   */
  const viewFriendLocation = () => {
    if (!state.friend) {
      Toast.show('Not selected friend!');
      return;
    }
    _setRegion(state.friend);
    setPointer('friend');
  };

  /**
   * save car location when user click save button, actually save the current location to the car variable
   */
  const saveCarLocation = () => {
    setCar(state.location);
    setSaved(true);
    Toast.show('Saved the car location!');
  };

  const _onPlaceSelected = placeId => {
    _input.current.blur();
    axios
      .get(`${PLACE_DETAIL_URL}?key=${apiKey}&placeid=${placeId}`)
      .then(({data}) => {
        let rg = (({lat, lng}) => ({latitude: lat, longitude: lng}))(
          data.result.geometry.location,
        );

        let image = [];
        if (data.result.photos) {
          image = data.result.photos.map(photo => ({
            title: '',
            subtitle: '',
            illustration:
              'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=' +
              photo.photo_reference +
              '&key=' +
              apiKey,
          }));
        } else {
          console.log('no images.....................', data.result);
        }

        setTargetInfo({
          ...targetInfo,
          title: data.result.name,
          description: data.result.formatted_address,
          image,
        });

        setTarget(rg);
      });
  };

  const _onBuildingSelected = building => {
    _input.current.blur();
    const {latitude, longitude, latitudeDelta, longitudeDelta} = building;
    setTarget({latitude, longitude, latitudeDelta, longitudeDelta});
    setTargetInfo({
      title: building.title,
      description: building.description,
      distance: 0,
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
          console.log(data);
          let {predictions} = data;
          setPredictions(predictions);
        });
    } else {
      setPredictions([]);
    }
  };

  const _request2 = text => {
    if (text.length >= 3) {
      axios
        .get(BUILDING_URL, {
          params: {
            key: text,
          },
        })
        .then(({data}) => {
          console.log(data);
          setPredictions(data);
        });
    } else {
      setPredictions([]);
    }
  };

  const _onChangeText = text => {
    if (kind === 0) _request(text);
    else _request2(text);
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
    console.log(state.user);

    Events.listen('PlaceSelected', 'DetailID', _onPlaceSelected);
    Events.listen('BuildingSelected', 'DetailItem', _onBuildingSelected);

    return () => {
      Events.rm('PlaceSelected', 'DetailID');
      Events.rm('BuildingSelected', 'DetailItem');
    };
  }, [state.location]);

  const onReady = result => {
    // const {distance, duration} = result;
    // setTarget({...target, distance, duration}); //don't work scaling

    if (targetInfo.title === '') {
      const {latitude, longitude} = target;
      Geocoder.from({latitude, longitude})
        .then(json => {
          const target_place_id = json.results[0].access_points[0].place_id;
          _onPlaceSelected(target_place_id); // set target details
        })
        .catch(error => console.warn(error));
    }

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
    return (
      <>
        {path.map(
          (pt, i) =>
            pt.latitude &&
            (i === 0 ||
              (i === 1 && target !== car && target != state.friend)) && (
              <Marker
                key={i}
                coordinate={{latitude: pt.latitude, longitude: pt.longitude}}
                pinColor={i === 0 ? 'red' : 'green'}
                // title={i === 0 ? 'current' : 'target'}
                // description={'Welcome'}
                onPress={() => {
                  if (i === 1) toggleModal();
                }}
              />
            ),
        )}
        {car && (
          <Marker
            coordinate={{latitude: car.latitude, longitude: car.longitude}}
            onPress={() => {
              setTarget(car);
            }}>
            <MaterialCommunityIcons name={'car-side'} size={45} color="green" />
          </Marker>
        )}
        {state.friend && (
          <Marker
            coordinate={{
              latitude: state.friend.latitude,
              longitude: state.friend.longitude,
            }}
            onPress={() => {
              setTarget(state.friend);
            }}>
            <MaterialCommunityIcons name={'face'} size={45} color="green" />
          </Marker>
        )}
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          ref={_map}
          style={styles.mapView}
          region={region}
          showsMyLocationButton={true}
          showsUserLocation={false}
          onPress={({nativeEvent}) => _onMapPressed(nativeEvent.coordinate)}
          onRegionChange={_onMapRegionChange}
          onRegionChangeComplete={fetchAddressForLocation}>
          <MapViewDirections
            // origin={current}
            origin={state.location}
            destination={target}
            // waypoints={coordinates.slice(1, -1)}
            mode={mode}
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

        <View
          style={{
            flexDirection: 'row',
            top: 0,
            position: 'absolute',
            // alignItems: 'flex-start',
            // justifyContent: 'flex-start',
          }}>
          <TouchableOpacity
            style={[
              styles.topButton,
              {
                backgroundColor:
                  kind === 0 ? Colors.primary : Colors.primaryAlpha,
              },
            ]}
            onPress={() => setKind(0)}>
            <View>
              <Text style={styles.actionText}>{'Address'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.topButton,
              {
                backgroundColor:
                  kind === 1 ? Colors.primary : Colors.primaryAlpha,
              },
            ]}
            onPress={() => setKind(1)}>
            <View>
              <Text style={styles.actionText}>{'Building'}</Text>
            </View>
          </TouchableOpacity>
        </View>

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
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            {
              <CtlBtn
                icon={'add-location'}
                color={'blue'}
                alpha={saved}
                proc={saveCarLocation}
              />
            }
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
            {false && (
              <CtlBtn
                icon={'directions-car'}
                alpha={mode === 'DRIVING'}
                proc={() => setMode('DRIVING')}
              />
            )}
            {false && (
              <CtlBtn
                icon={'directions-walk'}
                alpha={mode === 'WALKING'}
                proc={() => setMode('WALKING')}
              />
            )}
            <CtlBtn
              icon={'car-side'}
              alpha={pointer === 'car'}
              color="green"
              community={true}
              proc={viewCarLocation}
            />
            <CtlBtn
              icon={'face'}
              alpha={pointer === 'face'}
              color="green"
              community={true}
              proc={viewFriendLocation}
            />
            <CtlBtn
              icon={'my-location'}
              color={'green'}
              alpha={pointer === 'target'}
              proc={viewTargetLocation}
            />
            <CtlBtn
              icon={'my-location'}
              color={'red'}
              alpha={pointer === 'current'}
              proc={viewCurrentLocation}
            />
          </View>
        </View>
      </View>

      <Modal
        testID={'modal'}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        // onSwipeComplete={toggleModal}
        // swipeDirection={['up', 'left', 'right', 'down']}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            flex: 0.5,
            flexDirection: 'column',
            padding: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: 15,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  paddingLeft: 10,
                }}>
                {targetInfo.title}
              </Text>
            </View>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: 'red'}}>
              {targetInfo.distance}Km
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
                paddingBottom: 15,
              }}>
              {targetInfo.description}
            </Text>
          </View>
          <View>
            {
              // <FastImage
              //   style={{
              //     width: 160,
              //     height: 120,
              //     borderColor: 'blue',
              //     borderWidth: 1,
              //     borderRadius: 20,
              //   }}
              //   source={{uri: target.image}}
              //   resizeMode={FastImage.resizeMode.cover}
              // />
            }
            <Carousel entries={targetInfo.image} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 0,
            }}>
            <TouchableOpacity
              style={styles.dlgBtn}
              onPress={() => toggleModal()}>
              <Text style={styles.dlgBtnTxt}>{'Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  topButton: {
    height: 40,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  ////////////////////////

  textInputContainer: {
    flexDirection: 'row',
    height: 40,
    zIndex: 99,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    position: 'absolute',
    top: 40,
    width: '100%',
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
  dlgBtn: {
    // flex: 1,
    alignItems: 'center',
    padding: 10,
    margin: 5,
    width: '60%',
    backgroundColor: Colors.primary,
  },
  dlgBtnTxt: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});
