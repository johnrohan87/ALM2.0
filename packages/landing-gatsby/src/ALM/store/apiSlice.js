import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    fetchRSS: builder.query({
      query: (url) => ({
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
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
      },
    }),
  }),
});

export const { useFetchRSSQuery } = apiSlice;