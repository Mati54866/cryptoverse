import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const exchangeApi = createApi({
  reducerPath: 'exchangeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3' }),
  endpoints: (builder) => ({
    getExchanges: builder.query({
      query: () => '/exchanges',
    }),
  }),
});

export const { useGetExchangesQuery } = exchangeApi;
