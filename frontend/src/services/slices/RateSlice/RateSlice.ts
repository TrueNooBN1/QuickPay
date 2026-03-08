import {
  getRateApi
} from './../../../utils/api';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ReqStatus } from './../../../utils/types';
import type { TRate } from './../../../utils/types';

export const getRates = createAsyncThunk('rate', async () => getRateApi());

interface IRateSlice {
  rate: TRate | undefined;
  status: ReqStatus;
  error: string | null;
}


export const initialState: IRateSlice = {
  rate: undefined,
  // rate: {rateIn: 82, rateOut: 80},
  status: ReqStatus.Idle,
  error: null
};

export const RateSlice = createSlice({
  name: 'rate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRates.pending, (state) => {
        state.status = ReqStatus.Loading;
        state.error = null;
      })
      .addCase(getRates.fulfilled, (state, action) => {
        state.status = ReqStatus.Success;
        state.error = null;
        state.rate = action.payload.rates;
      })
      .addCase(getRates.rejected, (state, action) => {
        state.status = ReqStatus.Failed;
        state.error = action.error.message || 'undefined error';
      })
  },
  selectors: {
    rateSelector: (state) => state.rate,
    rateStatusSelector: (state) => state.status === ReqStatus.Loading
  }
});

export const { rateSelector, rateStatusSelector } =
  RateSlice.selectors;
