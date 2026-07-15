import { selectMarketPrices } from "@/entities/Market";
import { selectPortfolioHoldings } from "@/entities/Portfolio";
import { getAssetColor } from "@/shared/config/assetColors";
import { createSelector } from "@reduxjs/toolkit";

export const selectAssetAllocation = createSelector(
  [selectPortfolioHoldings, selectMarketPrices],
  (holdings, currentPrices) => {
    let totalValue = 0;

    const assetsRaw = Object.values(holdings)
      .filter((h) => h.amount > 0)
      .map((holding) => {
        const price = currentPrices[holding.symbol] || 0;
        const value = holding.amount * price;
        totalValue += value;
        return { ...holding, value };
      });

    const allocation = assetsRaw
      .map((asset) => ({
        name: asset.name,
        symbol: asset.symbol,
        value: asset.value,
        amount: asset.amount,
        // Считаем процент от всего портфеля
        percent:
          totalValue > 0
            ? Number(((asset.value / totalValue) * 100).toFixed(1))
            : 0,
        color: getAssetColor(asset.symbol),
      }))
      .sort((a, b) => b.value - a.value);

    return {
      allocation,
      totalValue,
    };
  },
);
