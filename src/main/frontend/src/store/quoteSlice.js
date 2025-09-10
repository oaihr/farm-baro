import { createSlice } from '@reduxjs/toolkit';

const quoteSlice = createSlice({
  name: 'quote',
  initialState: {
    quotes: [],
    loading: false,
    error: null
  },
  reducers: {
    // quote 관련 액션들
  }
});

export default quoteSlice.reducer;
