import {
  getAllOrdersApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderExchangeApi,
  patchOrderByNumberApi
} from './../../../utils/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReqStatus, TOrderStatus } from './../../../utils/types';
import type { TNewOrder, TOrder, TOrdersData, TOrdersFilter } from './../../../utils/types';

export const getOrders = createAsyncThunk('orders', async (data: TOrdersFilter) => {return getOrdersApi(data)});

export const getAllOrders = createAsyncThunk('allOrders', async (data: TOrdersFilter) => {return getAllOrdersApi(data)});

export const getOrderByNumber = createAsyncThunk(
  'orderByNumber',
  async (number: string) => getOrderByNumberApi(number)
);

export type TPatchOrderStatus = {
  status: TOrderStatus,
  id: string
}

export const patchOrder = createAsyncThunk('patchOrder', async (data: TPatchOrderStatus)=>patchOrderByNumberApi(data.id, data.status));

export const submitOrder = createAsyncThunk(
  'submitOrder',
  async (order: TNewOrder, { rejectWithValue }) => {
    const reply = await orderExchangeApi(order);
    if (!reply.success) rejectWithValue(reply);
    return reply;
  }
);

interface IOrderSlice {
  orders: TOrdersData | undefined;
  order: TOrder | undefined;
  status: ReqStatus;
  error: string | null;
  filter: TOrdersFilter;
}

const initialAdminFilter:TOrdersFilter = {
  pageNumber: 1,
  pageSize: 10,
  status: [TOrderStatus.created]
}

const initialUserFilter:TOrdersFilter = {
  pageNumber: 1,
  pageSize: 10,
}

export const initialState: IOrderSlice = {
  orders: undefined,
  order: undefined,
  status: ReqStatus.Idle,
  error: null,
  filter: initialUserFilter,
};

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = undefined;
    },
    updateOrder: (state, action) =>{
      state.order = {
        ...state.order,
        ...action.payload
      };
    },
    updateFilter: (state, action) =>{
      state.filter = {
        ...state.filter,
        ...action.payload
      };
    },
    resetOrdersFilterAdminState: (state) => {
      state.filter = initialAdminFilter;
    },
    resetOrdersFilterUserState: (state) => {
      state.filter = initialUserFilter;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        // console.log("getOrders.pending")
        state.status = ReqStatus.Loading;
        state.orders = undefined;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        // console.log("getOrders.fulfilled")
        // console.log(JSON.stringify(action.payload))
        state.status = ReqStatus.Success;
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        // console.log("getOrders.rejected", action.error.message)
        state.status = ReqStatus.Failed;
        state.error = action.error.message || 'undefined error'; 
      })
      .addCase(getAllOrders.pending, (state) => {
        // console.log("getAllOrders.pending")
        state.status = ReqStatus.Loading;
        state.error = null;
        state.orders = undefined;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        // console.log("getAllOrders.fulfilled")
        // console.log(JSON.stringify(action.payload))
        state.status = ReqStatus.Success;
        state.error = null;
        // const {orders, ...rest} = action.payload;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        // console.log("getAllOrders.rejected", action.error.message)
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
      .addCase(patchOrder.pending, (state) => {
        state.status = ReqStatus.Loading;
        state.error = null;
      })
      .addCase(patchOrder.fulfilled, (state, action) => {
        state.status = ReqStatus.Success;
        state.error = null;
        state.order = action.payload.orders[0];
        if (state.orders && state.order) {
          state.orders.orders = state.orders.orders.map(order => 
            order.id === state.order?.id ? state.order : order
          );
        }
      })
      .addCase(patchOrder.rejected, (state, action) => {
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
    ordersFilterSelector: (state) => state.filter,
    ordersSelector: (state) => state.orders,
    ordersStatusSelector: (state) => state.status === ReqStatus.Loading
  }
});

export const { orderSelector, ordersSelector, ordersStatusSelector, ordersFilterSelector } =
  OrderSlice.selectors;
export const { clearOrder, updateOrder, 
                updateFilter, resetOrdersFilterAdminState,
                resetOrdersFilterUserState } = OrderSlice.actions;
