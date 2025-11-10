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
  },
  reducers: {
    clearCategories: (state) => {
      state.items = [];
      state.error = null;
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
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
