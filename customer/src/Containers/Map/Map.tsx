import React, {useEffect, useRef, useState} from 'react';
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

// import Carousel, {Pagination} from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import Images from 'src/Theme/Images';

import Carousel from './Carousel';

import Events from 'react-native-simple-events';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AutoCompleteListView from './AutoCompleteListView';
import MapViewDirections from 'react-native-maps-directions';
import Colors from 'src/Theme/Colors';
import Modal from 'react-native-modal';
import {baseUrl} from 'src/config';

const {width, height} = Dimensions.get('window');

const PLACE_DETAIL_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';

const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const BUILDING_URL = baseUrl + 'api/building';
const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const DEFAULT_DELTA = {latitudeDelta: 0.015, longitudeDelta: 0.0121};

const apiKey = 'AIzaSyDOo1Y_JbCuuhs39Wt3i3iEyLgZXnqBkWo';

export default function LocationView() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const [kind, setKind] = useState(0); //address, building
  const [pointer, setPointer] = useState('start');
  const [mode, setMode] = useState('DRIVING');

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

  const [start, setStart] = useState(region);
  const [end, setEnd] = useState(region);

  const [target, setTarget] = useState({
    title: '',
    description: '',
    image: [],
    distance: 0,
  });

  const path = [start, end];

  const _input = useRef();
  const _map = useRef();

  const onLocationSelect = _ => {
    console.log('navigate...');
  };

  const _onMapRegionChange = rg => {
    // if (inFocus) {
    //   _input.current.blur();
    //   setInFocus(false);
    // }
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
        setPointer('start');

        console.log('current location is ', position);
        setReady(true);
      },
      error => console.log(error.message),
    );
  };

  const _getTargetLocation = () => {
    _setRegion(end);
    setPointer('end');
  };

  const _onPlaceSelected = placeId => {
    _input.current.blur();
    axios
      .get(`${PLACE_DETAIL_URL}?key=${apiKey}&placeid=${placeId}`)
      .then(({data}) => {
        let rg = (({lat, lng}) => ({latitude: lat, longitude: lng}))(
          data.result.geometry.location,
        );

        // {
        // "address_components": [[Object], [Object], [Object], [Object], [Object]],
        // "adr_address": "<span class=\"locality\">Washington</span>, <span class=\"region\">PA</span> <span class=\"postal-code\">15301</span>, <span class=\"country-name\">USA</span>",
        // "formatted_address": "Washington, PA 15301, USA",
        // "geometry": {"location": [Object], "viewport": [Object]},
        // "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
        // "id": "395ab72b3623a5e1fcd635aa8d141296d5eee412",
        // "name": "Washington",
        // "photos": [[Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object]],
        // "place_id": "ChIJMZYluYWtNYgRL9Pm0uxEhgQ",
        // "reference": "ChIJMZYluYWtNYgRL9Pm0uxEhgQ",
        // "scope": "GOOGLE",
        // "types": ["locality", "political"],
        // "url": "https://maps.google.com/?q=Washington,+PA+15301,+USA&ftid=0x8835ad85b9259631:0x48644ecd2e6d32f",
        // "utc_offset": -240, "vicinity": "Washington",
        // "website": "http://www.washingtonpa.us/"
        // }

        console.log('aaaaaaaaaa', data.result.photos[0], 'bbbbbbbbbbbbbb');

        //   {
        //   "height": 1224,
        //   "html_attributions": ["<a href=\"https://maps.google.com/maps/contrib/112105854871802449540\">Patrick</a>"],
        //   "photo_reference": "CmRaAAAAQjC7uZKraMWICl-pduS15TqVerM6D97Bq43pP4YYYHLLVeggqzMJggIwTJTM5W1no5AaDgYIM9LOo5NSKx96Q5zXsJhOds_IvD_J4JOMwmf6XdmmHXib7Yt1k4w6yHf3EhCIS9cqsVFxTN53-vUAQi-vGhRekXISosbA-6rjUT4OUl-93sPa6w",
        //   "width": 1632
        // }

        let image = data.result.photos.map(photo => ({
          title: '',
          subtitle: '',
          illustration:
            'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=' +
            photo.photo_reference +
            '&key=' +
            apiKey,
        }));

        setTarget({
          title: data.result.name,
          description: data.result.formatted_address,
          image,
          distance: 0,
        });

        setEnd(rg);
        // _setRegion(rg);

        console.log('search result...', rg);
      });
  };

  const _onBuildingSelected = building => {
    _input.current.blur();
    const {latitude, longitude, latitudeDelta, longitudeDelta} = building;
    setEnd({latitude, longitude, latitudeDelta, longitudeDelta});
    setTarget({
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

          // [
          //   {
          //     description: 'Big Ben, London, UK',
          //     id: '5373d9309fe9e4b25bd6746c7c2021df35ec279c',
          //     matched_substrings: [Array],
          //     place_id: 'ChIJ2dGMjMMEdkgRqVqkuXQkj7c',
          //     reference: 'ChIJ2dGMjMMEdkgRqVqkuXQkj7c',
          //     structured_formatting: [Object],
          //     terms: [Array],
          //     types: [Array],
          //   }
          // ];

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
          // [
          //   {
          //     __v: 0,
          //     _id: '5ed07d17495afa57f0fa7f0d',
          //     comments: [],
          //     createAt: '2020-05-29T03:10:15.074Z',
          //     description: 'The best supermarket in the world',
          //     description_ar: 'The best supermarket in the world',
          //     latitude: 37.015,
          //     latitudeDelta: 0.015,
          //     likes: [],
          //     longitude: -122.253,
          //     longitudeDelta: 0.021,
          //     photos: [],
          //     title: 'Big Location',
          //     title_ar: 'Big Location',
          //     updateAt: '2020-05-29T03:10:15.074Z',
          //   },
          // ];

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
    _getCurrentLocation();

    Events.listen('PlaceSelected', 'DetailID', _onPlaceSelected);
    Events.listen('BuildingSelected', 'DetailItem', _onBuildingSelected);

    return () => {
      Events.rm('PlaceSelected', 'DetailID');
      Events.rm('BuildingSelected', 'DetailItem');
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
        pinColor={i === 0 ? 'red' : 'green'}
        // title={i === 0 ? 'start' : 'end'}
        // description={'Welcome'}
        onPress={() => {
          if (i === 1) toggleModal();
        }}
      />
    ));
  };

  return (
    <>
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
        }

        {false && (
          <Entypo
            name={'location-pin'}
            size={30}
            color={'black'}
            style={{backgroundColor: 'transparent'}}
          />
        )}

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
        {true && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor:
                      mode === 'DRIVING' ? Colors.primary : Colors.primaryAlpha,
                  },
                ]}
                onPress={() => setMode('DRIVING')}>
                <MaterialIcons
                  name={'directions-car'}
                  color={'white'}
                  size={25}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor:
                      mode === 'WALKING' ? Colors.primary : Colors.primaryAlpha,
                  },
                ]}
                onPress={() => setMode('WALKING')}>
                <MaterialIcons
                  name={'directions-walk'}
                  color={'white'}
                  size={25}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor:
                      mode === 'BICYCLING'
                        ? Colors.primary
                        : Colors.primaryAlpha,
                  },
                ]}
                onPress={() => setMode('BICYCLING')}>
                <MaterialIcons
                  name={'directions-bike'}
                  color={'white'}
                  size={25}
                />
              </TouchableOpacity>
              {false && (
                <TouchableOpacity
                  style={[
                    styles.modeBtn,
                    {
                      backgroundColor:
                        mode === 'TRANSIT'
                          ? Colors.primary
                          : Colors.primaryAlpha,
                    },
                  ]}
                  onPress={() => setMode('TRANSIT')}>
                  <MaterialIcons
                    name={'directions-transit'}
                    color={'white'}
                    size={25}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor:
                      pointer === 'end' ? Colors.primary : Colors.primaryAlpha,
                  },
                ]}
                onPress={_getTargetLocation}>
                <MaterialIcons name={'my-location'} color={'green'} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor:
                      pointer === 'start'
                        ? Colors.primary
                        : Colors.primaryAlpha,
                  },
                ]}
                onPress={_getCurrentLocation}>
                <MaterialIcons name={'my-location'} color={'red'} size={25} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <Modal
        testID={'modal'}
        isVisible={isModalVisible}
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
              <View
                style={{
                  backgroundColor: Colors.primary,
                  width: 30,
                  height: 30,
                  borderColor: 'blue',
                  borderWidth: 1,
                }}
              />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  paddingLeft: 20,
                }}>
                {target.title}
              </Text>
            </View>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
              {target.distance}Km
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
              }}>
              {target.description}
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
            <Carousel entries={target.image} />
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
              <Text style={styles.dlgBtnTxt}>{'Surround'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dlgBtn}
              onPress={() => toggleModal()}>
              <Text style={styles.dlgBtnTxt}>{'Way'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dlgBtn}
              onPress={() => toggleModal()}>
              <Text style={styles.dlgBtnTxt}>{'AR Camera'}</Text>
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
  modeBtn: {
    backgroundColor: Colors.primaryAlpha,
    padding: 5,
    margin: 2,
    borderRadius: 5,
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
    flex: 1,
    alignItems: 'center',
    padding: 15,
    margin: 5,
    width: '100%',
    backgroundColor: Colors.primary,
  },
  dlgBtnTxt: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});
