import React, {createContext, useReducer, useEffect, useContext} from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import io from 'socket.io-client';
import {baseUrl, appVersion} from 'src/config';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

import {localNotifTitle} from './Notif';

const initialState = {
  socket: io(baseUrl, {ransports: ['websocket'], jsonp: false}),
  token: '',
  user: {},
  location: {},
  car: {}, //car location
  friend: null, //friend location
  news: [],
  last_note: {},
  notifications: [],
  rooms: [],
  messages: [],
  profile: {
    version: appVersion,
    service: 'OurCompany....',
    share: 'https:///',
    about: 'We are the whole...',
    phone: '11111',
  },
  current_screen: 'home',
};
const store = createContext(initialState);
const {Provider} = store;

const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'setCurrentScreen': {
        return {...state, current_screen: action.payload};
      }
      case 'setLocation': {
        return {...state, location: action.payload};
      }
      case 'setCar': {
        //only location
        return {...state, car: action.payload};
      }
      case 'setFriend': {
        //only location
        return {...state, friend: action.payload};
      }
      case 'setSocket': {
        return {...state, socket: action.payload};
      }
      case 'setUser': {
        return {...state, user: action.payload};
      }
      case 'setToken': {
        return {...state, auth_token: action.payload};
      }
      case 'setTokenUser': {
        return {
          ...state,
          ...action.payload,
        };
      }
      case 'setLastNote': {
        return {...state, last_note: action.payload};
      }
      case 'setNews': {
        return {...state, news: action.payload, current_screen: 'news'};
      }
      case 'addNews': {
        return {
          ...state,
          news: Array.from(
            new Set(
              [action.payload, ...state.news].map(x => JSON.stringify(x)),
            ),
          ).map(x => JSON.parse(x)),
        };
      }
      case 'setNotifications': {
        return {...state, notifications: action.payload};
      }
      case 'addNotification': {
        return {
          ...state,
          notifications: Array.from(
            new Set(
              [action.payload, ...state.notifications].map(x =>
                JSON.stringify(x),
              ),
            ),
          ).map(x => JSON.parse(x)),
        };
      }
      case 'setRooms': {
        return {...state, rooms: action.payload};
      }
      case 'updateRoom': {
        return {
          ...state,
          rooms: state.rooms.map((r, i) =>
            r._id === action.payload.room
              ? {
                  ...r,
                  label: action.payload.content,
                  updateAt: action.payload.createAt,
                  missed: parseInt(r.missed) + 1,
                }
              : r,
          ),
        };
      }
      case 'addRoom': {
        return {
          ...state,
          rooms: Array.from(
            new Set(
              [action.payload, ...state.rooms].map(x => JSON.stringify(x)),
            ),
          ).map(x => JSON.parse(x)),
        };
      }
      case 'setMessages': {
        return {
          ...state,
          messages: action.payload,
          current_screen: 'chat-room',
        };
      }
      case 'addMessage': {
        return {
          ...state,
          messages: Array.from(
            new Set(
              [...state.messages, action.payload].map(x => JSON.stringify(x)),
            ),
          ).map(x => JSON.parse(x)),
        };
      }
      case 'setProfile': {
        return {...state, profile: action.payload};
      }
      default:
        throw new Error();
    }
  }, initialState);

  const socketInit = () => {
    if (!state.socket) {
      console.log('~~~~~~~~~~~~~no sockect~~~~~~~~~~~~~', state.socket);
      return;
    }

    state.socket.on('data_news', value => {
      dispatch({type: 'addNews', payload: value});
      localNotifTitle('News！', value.content);
    });

    if (state.user._id) {
      state.socket.on('data_profile', value => {
        dispatch({type: 'setProfile', payload: value});
      });

      state.socket.on('banned_' + state.user._id, value => {
        dispatch({
          type: 'setTokenUser',
          payload: {user: {}, token: '', socket: null},
        });
        AsyncStorage.clear();
        Toast.show('Your account blocked!');
      });

      state.socket.on(state.user._id, value => {
        dispatch({type: 'addMessage', payload: value});

        if (state.current_screen === 'chat-room') {
          // axios
          //   .put(baseUrl + 'api/message/' + value._id)
          //   .then(function(response) {
          //     console.log('the msg checked++++', response.data.item._id);
          //   })
          //   .catch(function(error) {
          //     console.log('checked setting...', error);
          //   })
          //   .finally(function() {
          //     console.log('anyway finished, checked setting.');
          //   });
        } else {
          dispatch({type: 'updateRoom', payload: value});
          localNotifTitle('New message！', value.content);
        }
      });
    }
  };

  useEffect(() => {
    socketInit();
  }, [state.socket]);

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export {store, StateProvider};
