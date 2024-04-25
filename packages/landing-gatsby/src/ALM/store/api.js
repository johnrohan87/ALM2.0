import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.GATSBY_AUTH0_DOMAIN+'/api/v2/users' }),
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => '/roles',
    }),
  }),
});

export const { useGetRolesQuery } = api;