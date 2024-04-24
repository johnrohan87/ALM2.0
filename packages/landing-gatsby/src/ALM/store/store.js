import { createStore, combineReducers } from 'redux';
import { api } from './api';

const rootReducer = combineReducers({
  api: api.reducer,
});

const store = createStore(rootReducer);

export default { store };