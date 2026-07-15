import { StateSchema } from "@/app/providers/StoreProvider";
import { createSelector } from "@reduxjs/toolkit";
import { Transaction } from "../types/portfolio";

export const selectTransactions = (state: StateSchema) =>
  state.portfolio.transactions;

export interface AssetHolding {
  symbol: string;
  name: string;
  amount: number;
  totalInvested: number;
  avgBuyPrice: number;
}

export const selectPortfolioHoldings = createSelector(
  [selectTransactions],
  (transactions: Transaction[]): Record<string, AssetHolding> => {
    const holdings: Record<string, AssetHolding> = {};

    transactions.forEach((tx) => {
      if (!holdings[tx.symbol]) {
        holdings[tx.symbol] = {
          symbol: tx.symbol,
          name: tx.asset,
          amount: 0,
          totalInvested: 0,
          avgBuyPrice: 0,
        };
      }

      const holding = holdings[tx.symbol];

      if (tx.type === "buy") {
        holding.amount += tx.amount;
        holding.totalInvested += tx.amount * tx.price;
      } else if (tx.type === "sell") {
        holding.amount -= tx.amount;
      }
    });

    Object.values(holdings).forEach((holding) => {
      if (holding.amount > 0 && holding.totalInvested > 0) {
        holding.avgBuyPrice = holding.totalInvested / holding.amount;
      }
    });

    return holdings;
  },
);
