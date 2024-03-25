import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
