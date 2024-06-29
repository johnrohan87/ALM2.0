import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from './authSlice';

let store
try {
  store = configureStore({
      reducer: {
          auth: authReducer,
          [api.reducerPath]: api.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
      devTools: process.env.NODE_ENV !== 'production',
  });


  console.log("Redux Store initialized in store.js", store.getState());
} catch (error) {
  console.error("Error initializing Redux store:", error);
}

export default store;