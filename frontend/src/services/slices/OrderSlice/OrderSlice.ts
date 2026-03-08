import {
  getOrderByNumberApi,
  getOrdersApi,
  orderExchangeApi
} from './../../../utils/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReqStatus } from './../../../utils/types';
import type { TNewOrder, TOrder } from './../../../utils/types';

export const getOrders = createAsyncThunk('order', async () => getOrdersApi());

export const getOrderByNumber = createAsyncThunk(
  'orderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const submitOrder = createAsyncThunk(
  'submitOrder',
  async (order: TNewOrder, { rejectWithValue }) => {
    const reply = await orderExchangeApi(order);
    if (!reply.success) rejectWithValue(reply);
    return reply;
  }
);

interface IOrderSlice {
  orders: TOrder[];
  order: TOrder | null;
  status: ReqStatus;
  error: string | null;
}

export const initialState: IOrderSlice = {
  orders: [],
  order: null,
  status: ReqStatus.Idle,
  error: null
};

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = ReqStatus.Loading;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = ReqStatus.Success;
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.status = ReqStatus.Failed;
        state.error = action.error.message || 'undefined error';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.status = ReqStatus.Loading;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.status = ReqStatus.Success;
        state.error = null;
        state.order = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.status = ReqStatus.Failed;
        state.error = action.error.message || 'undefined error';
      })

      .addCase(submitOrder.pending, (state) => {
        state.status = ReqStatus.Loading;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status = ReqStatus.Success;
        state.error = null;
        state.order = action.payload.order;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = ReqStatus.Failed;
        state.error = action.error.message || 'undefined error';
      });
  },
  selectors: {
    orderSelector: (state) => state.order,
    ordersSelector: (state) => state.orders,
    ordersStatusSelector: (state) => state.status === ReqStatus.Loading
  }
});

export const { orderSelector, ordersSelector, ordersStatusSelector } =
  OrderSlice.selectors;
export const { clearOrder } = OrderSlice.actions;
