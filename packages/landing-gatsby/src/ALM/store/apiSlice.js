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

export const { useFetchUserRolesQuery } = api;
export const { reducer, middleware } = api;
export default api;