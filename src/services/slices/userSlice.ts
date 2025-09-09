import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import { stat } from 'fs';

type UserState = {
  user: TUser | null;
  isAuth: boolean;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuth: false,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Ошибка авторизации');
  }
});

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch {
      return rejectWithValue('Не удалось получить данные пользователя');
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async () => {
    try {
      await logoutApi();
    } finally {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
    },
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
      state.isAuth = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuth = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка регистрации';
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка авторизации';
      })

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка получения пользователя';
        state.isAuth = false;
        state.isAuthChecked = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.isAuthChecked = true;
      });
  }
});

export const { loginSuccess, logout, setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuth = (state: { user: UserState }) => state.user.isAuth;
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectIsAuthChecked = (state: { user: UserState }) =>
  state.user.isAuthChecked;
