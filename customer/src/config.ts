import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import en from 'src/translations/en.json';
import ar from 'src/translations/ar.json';

export const appVersion = '0.1';
export const baseUrl = 'http://10.0.2.2:8000/';
// export const baseUrl = 'http://51.38.88.155:8000/';

export const apiKey = 'AIzaSyDOo1Y_JbCuuhs39Wt3i3iEyLgZXnqBkWo';

export const translationGetters = {
  en,
  ar,
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const avatarSize = 128;
export const photoSize = 256;

export const tagJson = [
  {Cloth: 'CatWallet'},
  {Electronics: 'CatKey'},
  {Food: 'CatDigital'},
];
export const reasonArr = [
  {label: 'Wrong Color', value: 1},
  {label: 'Wrong Size', value: 2},
  {label: 'Damaged', value: 3},
  {label: 'Low quality', value: 4},
  {label: 'Other', value: 100},
];

export const catArr = [
  {label: 'Electronics', value: 1},
  {label: 'Cloth', value: 2},
  {label: 'Food', value: 3},
  {label: 'Other', value: 100},
];
