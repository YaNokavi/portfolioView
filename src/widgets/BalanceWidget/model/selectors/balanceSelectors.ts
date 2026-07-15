import { selectMarketPrices } from "@/entities/Market";
import { selectPortfolioHoldings } from "@/entities/Portfolio";
import { createSelector } from "@reduxjs/toolkit";

export const selectTotalBalanceMetrics = createSelector(
  [selectPortfolioHoldings, selectMarketPrices],
  (holdings, currentPrices) => {
    let totalValue = 0;
    let totalInvested = 0;

    Object.values(holdings).forEach((holding) => {
      const currentPrice = currentPrices[holding.symbol] || 0;

      if (holding.amount > 0) {
        totalValue += holding.amount * currentPrice;
        totalInvested += holding.amount * holding.avgBuyPrice;
      }
    });

    const pnlValue = totalValue - totalInvested;
    const pnlPercent = totalInvested > 0 ? (pnlValue / totalInvested) * 100 : 0;

    return {
      totalBalance: totalValue,
      pnlValue,
      pnlPercent: Number(pnlPercent.toFixed(2)),
      isPositive: pnlValue >= 0,
    };
  },
);
