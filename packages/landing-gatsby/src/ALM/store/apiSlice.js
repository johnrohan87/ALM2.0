import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    fetchUserRoles: builder.query({
      query: () => 'userRoles',
    }),
  }),
});

const { reducer, middleware } = api;

export { api };
export { reducer as apiReducer };
export const { useFetchUserRolesQuery } = api;