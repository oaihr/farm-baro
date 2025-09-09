import { configureStore, createSlice, createAsyncThunk, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { http } from '../api/http';

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
  async (_, { rejectWithValue, getState }) => {
    try {
      // 중복 호출 방지
      const state = getState();
      if (state.auth.status === 'loading' || (state.auth.status === 'succeeded' && state.auth.user)) {
        return state.auth.user;
      }

      console.log('fetchCurrentUser 호출 시작 - /api/auth/me');
      console.log('현재 쿠키:', document.cookie);
      console.log('localStorage 세션 ID:', localStorage.getItem('JSESSIONID'));
      
      const sessionId = localStorage.getItem('JSESSIONID');
      const url = sessionId ? `/api/auth/me?sessionId=${sessionId}` : '/api/auth/me';
      console.log('요청 URL:', url);
      
      const response = await http.get(url);
      console.log('fetchCurrentUser 응답:', response.data);
      console.log('응답 헤더:', response.headers);
      
      // 응답이 성공적이면 세션 ID를 localStorage에 저장
      if (response.data && response.data.id) {
        console.log('사용자 정보 조회 성공, 세션 유지');
        return response.data;
      } else {
        console.log('사용자 정보 없음, 로그아웃 처리');
        localStorage.removeItem('JSESSIONID');
        return rejectWithValue('사용자 정보 없음');
      }
    } catch (error) {
      console.error('fetchCurrentUser 에러:', error);
      console.error('에러 응답:', error.response);
      console.error('에러 상태:', error.response?.status);
      console.error('에러 데이터:', error.response?.data);
      
      // 401 Unauthorized 에러인 경우 세션 ID 제거
      if (error.response?.status === 401) {
        console.log('인증 실패, 세션 ID 제거');
        localStorage.removeItem('JSESSIONID');
      }
      
      return rejectWithValue(error.response?.data || '로그인 정보 가져오기 실패');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    userId: null,
    totalBalance: 0,
    bidDeposit: 0,
    isLoggedIn: false,
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.userId = null;
      state.totalBalance = 0;
      state.bidDeposit = 0;
      state.isLoggedIn = false;
      state.status = 'idle';
      state.error = null;
      // localStorage에서 세션 ID 제거
      localStorage.removeItem('JSESSIONID');
    },
    clearAuth(state) {
      state.user = null;
      state.userId = null;
      state.totalBalance = 0;
      state.bidDeposit = 0;
      state.isLoggedIn = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userId = action.payload?.id || null;
        state.isLoggedIn = !!action.payload; // user 객체가 있으면 로그인 상태
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.userId = null;
        state.isLoggedIn = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuth } = authSlice.actions;

// Redux Persist 설정
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // auth 상태만 persist
};

const rootReducer = combineReducers({
  meat: meatSlice.reducer,
  auth: authSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;