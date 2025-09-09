import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';

type FeedsState = {
  items: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedsState = {
  items: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feeds/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    };
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Ошибка загрузки ленты');
  }
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.items = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.isLoading = false;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки ленты';
      });
  }
});

export default feedsSlice.reducer;

export const selectFeeds = (state: any) => state.feeds;
export const selectFeedOrders = (state: any) => state.feeds.items;
export const selectFeedTotals = (state: any) => ({
  total: state.feeds.total,
  totalToday: state.feeds.totalToday
});
