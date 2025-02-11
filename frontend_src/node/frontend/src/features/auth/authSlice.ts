import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// 初期状態
export interface AuthState {
  currentUser: null | { id: number; username: string };
  isGuestUser: boolean;  // 追加
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  isGuestUser: false,  // 初期値を false に設定
  status: 'idle',
  error: null,
};

// ユーザー情報を取得する非同期処理
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // CSRFトークンの取得（axiosInstanceで自動適用される）
      await axiosInstance.get("/csrf");

      // ユーザー情報の取得
      const response = await axiosInstance.get("/current-user/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'エラーが発生しました');
    }
  }
);

// ゲストユーザーかどうかを取得する処理
export const fetchIsGuestUser = createAsyncThunk(
  'auth/fetchIsGuestUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/is-guest-user/");
      return response.data.is_guest; // APIのレスポンスに合わせる
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
      state.isGuestUser = false; // ログアウト時にリセット
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
      })
      .addCase(fetchIsGuestUser.fulfilled, (state, action) => {
        state.isGuestUser = action.payload; // ゲストユーザー状態を更新
      })
      .addCase(fetchIsGuestUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
