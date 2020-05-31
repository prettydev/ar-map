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

          const delta =
            Math.pow(latitude - state.location.latitude, 2) +
            Math.pow(longitude - state.location.longitude, 2);

          console.log(delta, '----------------------delta');

          dispatch({
            type: 'setLocation',
            payload: {latitude, longitude},
          });

          if (delta > 0.0001) {
            axios
              .post(`${baseUrl}api2/user/location`, {
                user_id: state.user._id,
                location: {latitude, longitude},
              })
              .then(function(response) {
                if (response.data.success) {
                  console.log(response.data.user);
                  dispatch({type: 'setUser', payload: response.data.user});
                }
              })
              .catch(function(error) {
                console.log(JSON.stringify(error));
              });
          }
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
