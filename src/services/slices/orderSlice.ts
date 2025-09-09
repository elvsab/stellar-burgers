import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.order = action.payload;
          state.orderRequest = false;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка при создании заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const selectOrder = (state: RootState) => state.order.order;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderError = (state: RootState) => state.order.error;

export default orderSlice.reducer;
