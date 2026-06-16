import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Using a different RSS converter (more reliable)
export const rssNewsApi = createApi({
  reducerPath: 'rssNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.allorigins.win/raw?url=' }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: () => encodeURIComponent('https://cointelegraph.com/rss'),
      transformResponse: (response) => {
        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        const newsItems = Array.from(items).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          author: item.querySelector('dc:creator')?.textContent || 'CoinTelegraph',
          thumbnail: item.querySelector('media:content')?.getAttribute('url') || '',
          description: item.querySelector('description')?.textContent || '',
        })); 
        return { items: newsItems };
      },
    }),
  }),
});

export const { useGetCryptoNewsQuery } = rssNewsApi;