import { configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux'

import { UserSlice } from '../slices/UserSlice/UserSlice';
import { OrderSlice } from '../slices/OrderSlice/OrderSlice';
import { RateSlice } from '../slices/RateSlice/RateSlice';

const rootReducer = {
  [UserSlice.name]: UserSlice.reducer,
  [OrderSlice.name]: OrderSlice.reducer,
  [RateSlice.name]: RateSlice.reducer,
};

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
