import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.GATSBY_HEROKU_BASEURL}`,
    prepareHeaders: (headers, { getState }) => {
      if (typeof window !== 'undefined') {
        const token = getState().auth.token;
        console.log("Authorization Token:", token, 'state', getState());
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        console.log("Headers being sent:", headers);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchRSS: builder.query({
        query: (url) => ({
            url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            method: 'GET',
        }),
        transformResponse: (response) => {
            if (typeof window !== 'undefined') {
                const rawXML = response.contents;
                const parser = new DOMParser();
                const xml = parser.parseFromString(rawXML, "application/xml");
                const items = Array.from(xml.querySelectorAll("item")).map(item => {
                const elements = {};
                Array.from(item.childNodes).forEach(child => {
                    if (child.nodeType === 1) {
                        elements[child.tagName.toLowerCase()] = child.textContent.trim();
                    }
                });
                return elements;
            });
            return {
                rawXML,
                feedTitle: xml.querySelector("channel > title")?.textContent,
                feedLink: xml.querySelector("channel > link")?.textContent,
                items,
            };
        } else {
                return null;
            }
        },
    }),
    importFeed: builder.mutation({
        query: (feedData) => ({
            url: 'import_feed',
            method: 'POST',
            body: feedData,
        }),
    }),
    editStory: builder.mutation({
        query: ({ storyId, storyData }) => ({
            url: `edit_story/${storyId}`,
            method: 'PUT',
            body: storyData,
        }),
    }),
    fetchUserFeed: builder.query({
        query: () => 'user_feed',
    }),
  }),
});

export const {
  useFetchUserFeedQuery,
  useImportFeedMutation,
  useEditStoryMutation,
} = api;