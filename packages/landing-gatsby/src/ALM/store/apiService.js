import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser } from './setUser';
import { navigate } from 'gatsby'

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.GATSBY_HEROKU_BASEURL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // Set the JWT token in an HTTP only cookie
          document.cookie = `jwt=${result.data.access_token}; refresh=${result.data.refresh_token}; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}; path=/; secure; samesite=strict`;
          document.cookie = `refresh=${result.data.refresh_token}; path=/; secure; samesite=strict`;
          // Dispatch an action to update the Redux store with the user data

          console.log(document.cookie)
          console.log(result.data)
          dispatch(setUser(result.data));
          navigate('/private')
        } catch (err) {
          console.log(err, "Error within onQueryStarted")
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({ url: '/refresh', method: 'POST' }),
    }),
    protected: builder.query({
      query: () => ({ url: '/protected' }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useProtectedQuery } = api;
export const { reducer: apiReducer } = api;
export const apiSlice = api;
