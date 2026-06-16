import { configureStore } from '@reduxjs/toolkit';

import { cryptoApi } from '../services/cryptoApi';
import { exchangeApi } from '../services/exchangeApi';

export default configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [exchangeApi.reducerPath]: exchangeApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
      cryptoApi.middleware,
      exchangeApi.middleware,
    ),
});
