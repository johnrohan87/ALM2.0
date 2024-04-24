import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { api } from './api';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
});

let store;

export function getStore() {
  if (!store) {
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(api.middleware),
    });
  }
  console.log('getStore called:', store);
  return store;
}