import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polygon,
  Circle,
} from "react-native-maps";
import { request, PERMISSIONS } from "react-native-permissions";
import Geolocation from "@react-native-community/geolocation";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import RNGooglePlaces from "react-native-google-places";

export default function Map() {
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [initialPosition, setInitialPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log("iPhone: " + response);

      if (response === "granted") {
        locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log("Android: " + response);

      if (response === "granted") {
        locateCurrentPosition();
      }
    }
  };

  const homePlace = {
    description: "Home",
    geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
  };
  const workPlace = {
    description: "Work",
    geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
  };

  const locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("current location is ", JSON.stringify(position));

        setInitialPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        });
        setLoading(false);
      },
      (error) => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
    );
  };

  const openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        console.log(place);
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch((error) => console.log(error.message)); // error is a Javascript Error object
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      {!loading && <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        style={styles.map}
        initialRegion={initialPosition}
      />}
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log("data-------------", data, "-----------------", details);
        }}
        query={{
          key: "AIzaSyDO-TS1el3z_uiyRXeauXl7MUAy_c_mMd4",
          language: "en",
        }}
        currentLocation={true}
        currentLocationLabel="Current location"
        styles={{
          predefinedPlacesDescription: {
            color: "red",
          },
          listView: {
            // backgroundColor: "#FFFFFFCC",
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
