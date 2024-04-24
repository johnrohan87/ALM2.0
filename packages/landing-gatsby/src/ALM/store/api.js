import { createApi, fetchBaseQuery } from '@rtk-incubator/rtk-query';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-auth0-domain.com/api/v2/' }),
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => '/roles',
    }),
  }),
});

export const { useGetRolesQuery } = api;