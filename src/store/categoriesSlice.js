import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { campaignApi } from '../api/campaignApi';

// Async thunk để fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await campaignApi.getAllCategories();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh mục');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetched: null, // Timestamp để track lần fetch cuối
    lastError: null, // Timestamp của lần lỗi cuối
    retryCount: 0, // Số lần retry
  },
  reducers: {
    clearCategories: (state) => {
      state.items = [];
      state.error = null;
      state.lastError = null;
      state.retryCount = 0;
    },
    resetRetry: (state) => {
      state.retryCount = 0;
      state.lastError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
        state.lastError = null;
        state.retryCount = 0; // Reset retry count on success
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastError = Date.now();
        state.retryCount += 1;
      });
  },
});

export const { clearCategories, resetRetry } = categoriesSlice.actions;
export default categoriesSlice.reducer;
