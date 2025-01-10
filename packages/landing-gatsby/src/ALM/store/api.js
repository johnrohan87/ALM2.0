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
    // Feeds Endpoints
    fetchUserFeeds: builder.query({
      query: (filter) => {
        const query = filter ? `?public=${filter}` : '';
        return `feeds${query}`;
      },
    }),
    previewFeed: builder.mutation({
      query: (feedData) => ({
        url: 'feeds/preview',
        method: 'POST',
        body: feedData,
      }),
    }),
    importFeed: builder.mutation({
      query: (feedData) => ({
        url: 'feeds',
        method: 'POST',
        body: feedData,
      }),
    }),
    deleteFeed: builder.mutation({
      query: ({ feed_id }) => ({
        url: `feeds`,
        method: 'DELETE',
        body: { feed_id },
      }),
    }),

    // Stories Endpoints
    fetchUserStories: builder.query({
      query: ({ feedId }) => `stories${feedId ? `?feed_id=${feedId}` : ''}`,
    }),
    fetchLazyUserStories: builder.query({
      query: (feedId) => `stories?feed_id=${feedId}`,
    }),
    addStory: builder.mutation({
      query: (storyData) => ({
        url: 'stories',
        method: 'POST',
        body: storyData,
      }),
    }),
    deleteStories: builder.mutation({
      query: ({ story_ids }) => ({
        url: 'stories',
        method: 'DELETE',
        body: { story_ids },
      }),
    }),
    updateStory: builder.mutation({
      query: ({ storyId, data }) => ({
        url: `stories/${storyId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    

    // Public Feed Endpoints
    fetchPublicFeed: builder.query({
      query: (token) => `feeds/public/${token}`,
    }),

    // Token Endpoints
    requestFeedToken: builder.mutation({
      query: ({ feed_id }) => ({
        url: 'generate_feed_token',
        method: 'POST',
        body: { feed_id },
      }),
    }),
    getAllFeedTokens: builder.query({
      query: () => ({
        url: 'get_all_feed_tokens',
        method: 'GET',
      }),
    }),

    // Feed Update Endpoint
    updateFeed: builder.mutation({
      query: (feedData) => ({
        url: 'feeds',
        method: 'PUT',
        body: feedData,
      }),
    }),
  }),
});

export const {
  // Feeds
  useFetchUserFeedsQuery,
  usePreviewFeedMutation,
  useImportFeedMutation,
  useDeleteFeedMutation,

  // Stories
  useFetchUserStoriesQuery,
  useLazyFetchUserStoriesQuery,
  useAddStoryMutation,
  useDeleteStoriesMutation,
  useUpdateStoryMutation,

  // Public Feeds
  useFetchPublicFeedQuery,

  // Tokens
  useRequestFeedTokenMutation,
  useGetAllFeedTokensQuery,

  // Update
  useUpdateFeedMutation,
} = api;