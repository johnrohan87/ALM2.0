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
        console.log('Importing feed with data:', arg);
        try {
          await queryFulfilled;
          console.log('Feed imported successfully');
        } catch (error) {
          console.error('Error importing feed:', error);
        }
      },
    }),
    fetchPreviewFeed: builder.query({
      query: (url) => ({
        url: `import_feed?url=${encodeURIComponent(url)}`,
        method: 'GET',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Fetching preview feed for URL:', arg);
        try {
          await queryFulfilled;
          console.log('Preview feed fetched successfully');
        } catch (error) {
          console.error('Error fetching preview feed:', error);
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
        console.log('Deleting stories with IDs:', arg.story_ids);
        try {
          await queryFulfilled;
          console.log('Stories deleted successfully');
        } catch (error) {
          console.error('Error deleting stories:', error);
        }
      },
    }),
    deleteFeed: builder.mutation({
      query: ({ feed_id }) => ({
        url: `delete_feed/${feed_id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Deleting feed with ID:', arg.feed_id);
        try {
          await queryFulfilled;
          console.log('Feed deleted successfully');
        } catch (error) {
          console.error('Error deleting feed:', error);
        }
      },
    }),
    saveStory: builder.mutation({
      query: ({ story_id }) => ({
        url: 'save_story',
        method: 'POST',
        body: { story_id },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Saving story with ID:', arg.story_id);
        try {
          await queryFulfilled;
          console.log('Story saved successfully');
        } catch (error) {
          console.error('Error saving story:', error);
        }
      },
    }),
    addToUserFeed: builder.mutation({
      query: ({ feed_id }) => ({
        url: 'add_to_user_feed',
        method: 'POST',
        body: { feed_id },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Adding feed to user feed with ID:', arg.feed_id);
        try {
          await queryFulfilled;
          console.log('Feed added to user feed successfully');
        } catch (error) {
          console.error('Error adding feed to user feed:', error);
        }
      },
    }),
    addStoryToUserFeed: builder.mutation({
      query: ({ story, feed }) => ({
        url: 'add_story_to_user_feed',
        method: 'POST',
        body: { story, feed },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Adding story to user feed with data:', arg);
        try {
          await queryFulfilled;
          console.log('Story added to user feed successfully');
        } catch (error) {
          console.error('Error adding story to user feed:', error);
        }
      },
    }),
  }),
});

export const {
  useFetchUserFeedsQuery,
  useFetchUserStoriesQuery,
  useLazyFetchUserStoriesQuery,
  useImportFeedMutation,
  useLazyFetchPreviewFeedQuery,
  useDeleteStoriesMutation,
  useDeleteFeedMutation,
  useSaveStoryMutation,
  useAddToUserFeedMutation,
  useAddStoryToUserFeedMutation,
} = api;