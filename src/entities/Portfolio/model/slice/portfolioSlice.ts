import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PortfolioSchema, Transaction } from "../types/portfolio";

const initialState: PortfolioSchema = {
  transactions: [
    {
      id: "1",
      type: "buy",
      asset: "Bitcoin",
      symbol: "BTC",
      amount: 0.15,
      price: 62450.0,
      date: "Oct 24, 2026 14:30",
    },
    {
      id: "2",
      type: "sell",
      asset: "Ethereum",
      symbol: "ETH",
      amount: 2.5,
      price: 3420.5,
      date: "Oct 22, 2026 09:15",
    },
    {
      id: "3",
      type: "buy",
      asset: "Solana",
      symbol: "SOL",
      amount: 45.0,
      price: 142.2,
      date: "Oct 18, 2026 18:45",
    },
    {
      id: "4",
      type: "buy",
      asset: "Bitcoin",
      symbol: "BTC",
      amount: 0.05,
      price: 59800.0,
      date: "Oct 15, 2026 11:20",
    },
    {
      id: "5",
      type: "sell",
      asset: "Bitcoin",
      symbol: "BTC",
      amount: 0.1,
      price: 65000.0,
      date: "Oct 25, 2026 11:20",
    },
  ],
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
  },
});

export const { actions: portfolioActions } = portfolioSlice;
export const { reducer: portfolioReducer } = portfolioSlice;
export const { addTransaction } = portfolioSlice.actions;
