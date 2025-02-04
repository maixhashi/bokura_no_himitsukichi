import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 初期状態
export interface AuthState {
  currentUser: null | { id: number; username: string };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

// ユーザー情報を取得する非同期処理
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // CSRF トークンの取得
      const csrfResponse = await axios.get("http://localhost:8000/api/csrf/", {
        withCredentials: true,
      });
      axios.defaults.headers.common["X-CSRFToken"] = csrfResponse.data.csrfToken;

      // ユーザー情報の取得
      const response = await axios.get("http://localhost:8000/api/current-user/", {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'エラーが発生しました');
    }
  }
);

// Slice 作成
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.currentUser = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
