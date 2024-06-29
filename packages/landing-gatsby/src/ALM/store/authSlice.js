import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null
    },
    reducers: {
        setCredentials: (state, action) => {
          console.log("setCredentials action triggered", action.payload);
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = !!action.payload.token;
          state.isAdmin = action.payload.isAdmin;
          state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.isLoading = false;
        },
        startLoading: (state) => {
            state.isLoading = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

export const { setCredentials, logout, startLoading, setError } = authSlice.actions;

export default authSlice.reducer;
