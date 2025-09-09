import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const meatSlice = createSlice({
  name: 'meat',
  initialState: {
    kindNames: {
      'beef': '소',
      'chicken': '닭',
      'pork': '돼지',
    },
    partNames: {
      'sirloin': '등심',
      'tenderloin': '안심',
      'rib': '갈비',
      'belly': '삼겹살',
      'neck': '목살',
      'breast': '가슴살',
      'leg': '다리살',
      'etc': '기타',
    },
  },
  reducers: {

  },
});

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/current-user', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '로그인 정보 가져오기 실패');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    totalBalance: 0,
    bidDeposit: 0,
    isLoggedIn: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.userId = null;
      state.totalBalance = 0;
      state.bidDeposit = 0;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const { id, totalBalance, bidDeposit } = action.payload;
        state.userId = id;
        state.totalBalance = totalBalance;
        state.bidDeposit = bidDeposit;
        state.isLoggedIn = !!id;
        state.status = 'succeeded';
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.userId = null;
        state.totalBalance = 0;
        state.bidDeposit = 0;
        state.isLoggedIn = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const store = configureStore({
  reducer: {
    meat: meatSlice.reducer,
    auth: authSlice.reducer
  },
})