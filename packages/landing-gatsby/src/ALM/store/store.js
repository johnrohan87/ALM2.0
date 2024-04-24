import { configureStore } from '@reduxjs/toolkit';
import { apiReducer } from './apiSlice';

const store = configureStore({
  reducer: {
    [apiReducer.reducerPath]: apiReducer.reducer,
  },
});

export default store;