import { createStore, combineReducers } from 'redux';
import { api } from './api';

const rootReducer = combineReducers({
  api: api.reducer,
});

let store;

export function getStore() {
  if (!store) {
    store = createStore(rootReducer);
  }
  console.log('getStore called:', store);
  return store;
}