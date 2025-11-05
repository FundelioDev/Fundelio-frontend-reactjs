import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './campaignSlice';

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
  },
});
