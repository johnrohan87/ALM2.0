import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.GATSBY_HEROKU_BASEURL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUserFeeds: builder.query({
      query: () => 'fetch_feeds',
      async onQueryStarted(arg, { getState, queryFulfilled }) {
        const token = getState().auth.token;
        if (!token) {
          console.warn('No token available, skipping query');
          return;
        }
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Error fetching feeds:', error);
        }
      },
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
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Importing feed with data:', arg); // Debugging log
        try {
          await queryFulfilled;
          console.log('Feed imported successfully'); // Success log
        } catch (error) {
          console.error('Error importing feed:', error); // Error log
        }
      },
    }),
    fetchPreviewFeed: builder.query({
      query: (url) => ({
        url: `import_feed?url=${encodeURIComponent(url)}`,
        method: 'GET',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Fetching preview feed for URL:', arg); // Debugging log
        try {
          await queryFulfilled;
          console.log('Preview feed fetched successfully'); // Success log
        } catch (error) {
          console.error('Error fetching preview feed:', error); // Error log
        }
      },
    }),
    deleteStories: builder.mutation({
      query: ({ story_ids }) => ({
        url: 'delete_stories',
        method: 'DELETE',
        body: { story_ids },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Deleting stories with IDs:', arg.story_ids); // Debugging log
        try {
          await queryFulfilled;
          console.log('Stories deleted successfully'); // Success log
        } catch (error) {
          console.error('Error deleting stories:', error); // Error log
        }
      },
    }),
    deleteFeed: builder.mutation({
      query: ({ feed_id }) => ({
        url: `delete_feed/${feed_id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Deleting feed with ID:', arg.feed_id); // Debugging log
        try {
          await queryFulfilled;
          console.log('Feed deleted successfully'); // Success log
        } catch (error) {
          console.error('Error deleting feed:', error); // Error log
        }
      },
    }),
  }),
});

export const {
  useFetchUserFeedsQuery,
  useLazyFetchUserStoriesQuery,
  useImportFeedMutation,
  useLazyFetchPreviewFeedQuery,
  useDeleteStoriesMutation,
  useDeleteFeedMutation,
} = api;