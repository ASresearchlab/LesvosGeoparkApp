import {combineReducers} from 'redux';
import {MMKV} from 'react-native-mmkv';
import {persistReducer} from 'redux-persist';
import {actionTypes} from '@actions';

import authReducer from './auth';
import applicationReducer from './application';
import homeReducer from './home';
import discoveryReducer from './discovery';
import wishlistReducer from './wishlist';
import searchReducer from './search';
import listingReducer from './listing';
import reviewReducer from './review';
import bookingReducer from './booking';

const storage = new MMKV();

export const MMKVStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
  mergeItem: (key, value) => {
    alert('mergeItem');
  },
  clear: () => {
    alert('clear');
  },
  getAllKeys: key => {
    alert('getAllKeys');
  },
  multiGet: keys => {
    alert('multiGet');
  },
  multiSet: keys => {
    alert('multiSet');
  },
  multiRemove: keys => {
    alert('multiRemove');
  },
  multiMerge: keys => {
    alert('multiMerge');
  },
};

const rootPersistConfig = {
  key: 'root',
  storage: MMKVStorage,
  whitelist: ['application', 'auth'],
  timeout: 10000,
};

const appReducer = combineReducers({
  auth: authReducer,
  application: applicationReducer,
  home: homeReducer,
  discovery: discoveryReducer,
  wishlist: wishlistReducer,
  search: searchReducer,
  listing: listingReducer,
  review: reviewReducer,
  booking: bookingReducer,
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.CLEAR_REDUCER) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default persistReducer(rootPersistConfig, rootReducer);
