import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    access_token: null,
    refresh_token: null,
  },
  reducers: {
    setUser(state, action) {
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
      },
      logout() {
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict';
        return {
          access_token: null,
          refresh_token: null,
        };
      },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;