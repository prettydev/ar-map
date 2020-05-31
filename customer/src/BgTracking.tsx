import React, {useState, useEffect, useContext} from 'react';
import {baseUrl, apiKey} from 'src/config';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {store} from 'src/Store';

function BgTracking() {
  const [state, dispatch] = useContext(store);
  useEffect(() => {
    if (state.user._id)
      Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;

          console.log('current location....', latitude, longitude);

          dispatch({
            type: 'setLocation',
            payload: {latitude, longitude},
          });

          axios.post(`${baseUrl}api2/user/location`, {
            user_id: state.user._id,
            location: {latitude, longitude},
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    return () => {};
  }, [state.user._id]);
  return <></>;
}

export default BgTracking;
