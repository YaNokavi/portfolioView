import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarketSchema } from "../types/market";

const initialState: MarketSchema = {
  prices: {
    BTC: 65000.0,
    ETH: 3550.0,
    SOL: 148.5,
    USDT: 1.0,
  },
  isLoading: false,
};

export const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    updatePrice: (
      state,
      action: PayloadAction<{ symbol: string; price: number }>,
    ) => {
      state.prices[action.payload.symbol] = action.payload.price;
    },
  },
});

export const { actions: marketActions } = marketSlice;
export const { reducer: marketReducer } = marketSlice;
