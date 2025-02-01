import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: false,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = !!payload.token;
      state.isAdmin = payload.isAdmin || false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
