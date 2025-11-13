import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './campaignSlice';
import categoriesReducer from './categoriesSlice';

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    categories: categoriesReducer,
  },
});
