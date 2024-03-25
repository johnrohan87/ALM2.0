import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { apiSlice } from './apiService';

const store = configureStore({
  reducer: {
    // Add the generated RTK Query reducer to the store
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Add other reducers if needed
    // Add a loading state if using RTK Query's `isLoading` property
    // loading: (state) => state.loading,
  },
  // Add the api middleware to the store's middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Setup RTK Query listeners to enable cache updates and automatic refetching
setupListeners(store.dispatch);

export default store;
