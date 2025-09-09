import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type OrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderDetailsState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orderDetails/fetchByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Ошибка загрузки заказа');
  }
});

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderDetails(state) {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.order = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderDetails } = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;

export const selectOrderDetails = (state: any) => state.orderDetails.order;
export const selectOrderDetailsLoading = (state: any) =>
  state.orderDetails.isLoading;
export const selectOrderDetailsError = (state: any) => state.orderDetails.error;
