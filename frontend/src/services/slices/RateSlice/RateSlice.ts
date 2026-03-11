import {
  getAdminDataApi,
  getRateApi,
  patchAdminDataApi
} from './../../../utils/api';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ReqStatus } from './../../../utils/types';
import type { TAdminData, TRate } from './../../../utils/types';

export const getRates = createAsyncThunk('rate', async () => getRateApi());
export const getAdminData = createAsyncThunk('getAdminData', async () => getAdminDataApi());
export const patchAdminData = createAsyncThunk('patchAdminData', async (newAdminData:TAdminData) => patchAdminDataApi(newAdminData));

interface IRateSlice {
  rate: TRate | undefined;
  adminData: TAdminData | undefined;
  status: ReqStatus;
  error: string | null;
}


export const initialState: IRateSlice = {
  rate: undefined,
  // rate: {rateIn: 82, rateOut: 80},
  adminData: undefined, 
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
      .addCase(getAdminData.pending, (state) => {
        state.status = ReqStatus.Loading;
        state.error = null;
      })
      .addCase(getAdminData.fulfilled, (state, action) => {
        // console.log("getAdminData.fulfilled", JSON.stringify(action.payload.data))
        state.status = ReqStatus.Success;
        state.error = null;
        state.adminData = action.payload.data;
      })
      .addCase(getAdminData.rejected, (state, action) => {
        state.status = ReqStatus.Failed;
        state.error = action.error.message || 'undefined error';
      })
      .addCase(patchAdminData.pending, (state) => {
        state.status = ReqStatus.Loading;
        state.error = null;
      })
      .addCase(patchAdminData.fulfilled, (state, action) => {
        state.status = ReqStatus.Success;
        state.error = null;
        state.adminData = action.payload.data;
      })
      .addCase(patchAdminData.rejected, (state, action) => {
        state.status = ReqStatus.Failed;
        state.error = action.error.message || 'undefined error';
      })
  },
  selectors: {
    rateSelector: (state) => state.rate,
    adminDataSelector: (state) => state.adminData,
    rateStatusSelector: (state) => state.status === ReqStatus.Loading
  }
});

export const { rateSelector, rateStatusSelector, adminDataSelector } =
  RateSlice.selectors;
