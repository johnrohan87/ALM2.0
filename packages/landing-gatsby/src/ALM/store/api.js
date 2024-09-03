import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.GATSBY_HEROKU_BASEURL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log('Authorization header set:', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUserFeeds: builder.query({
      query: () => 'fetch_feeds',
    }),
    fetchUserStories: builder.query({
      query: ({ feedId }) => `fetch_stories?feed_id=${feedId}`,
    }),
    importFeed: builder.mutation({
      query: (feedData) => ({
        url: 'import_feed',
        method: 'POST',
        body: feedData,
      }),
    }),
    deleteStories: builder.mutation({
      query: (storyIds) => ({
        url: 'delete_stories',
        method: 'DELETE',
        body: { story_ids: storyIds },
      }),
    }),
    deleteFeed: builder.mutation({
      query: (feedId) => ({
        url: `delete_feed/${feedId}`,
        method: 'DELETE',
      }),
    }),
  }),
  extractRejection: (response) => {
    if (response.error && response.error.status === 401) {
      // Handle 401 error, possibly dispatch an action to logout or refresh token
      console.error('401 Unauthorized - Token might be invalid or expired');
      // Example: dispatch(logout()) or refresh token logic here
    }
  },
});

export const {
  useFetchUserFeedsQuery,
  useLazyFetchUserStoriesQuery,
  useImportFeedMutation,
  useDeleteStoriesMutation,
  useDeleteFeedMutation,
} = api;
