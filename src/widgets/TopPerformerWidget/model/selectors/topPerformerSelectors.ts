import { createSelector } from "@reduxjs/toolkit";
import { selectPortfolioHoldings } from "@/entities/Portfolio";
import { selectMarketPrices } from "@/entities/Market";

export const selectTopPerformer = createSelector(
  [selectPortfolioHoldings, selectMarketPrices],
  (holdings, currentPrices) => {
    // Преобразуем объект holdings в массив, чтобы можно было сортировать
    const performanceList = Object.values(holdings)
      .filter((holding) => holding.amount > 0 && holding.avgBuyPrice > 0)
      .map((holding) => {
        const currentPrice = currentPrices[holding.symbol] || 0;

        // Считаем процентную прибыль: ((Текущая цена - Средняя цена покупки) / Средняя цена покупки) * 100
        const profitPercent =
          ((currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;
        const profitValue =
          (currentPrice - holding.avgBuyPrice) * holding.amount;

        return {
          ...holding,
          currentPrice,
          profitPercent,
          profitValue,
        };
      });

    // Если нет монет (или все проданы)
    if (performanceList.length === 0) {
      return null;
    }

    // Ищем монету с самым высоким процентом прибыли
    const topPerformer = performanceList.reduce((prev, current) =>
      current.profitPercent > prev.profitPercent ? current : prev,
    );

    return {
      symbol: topPerformer.symbol,
      name: topPerformer.name,
      avgBuyPrice: topPerformer.avgBuyPrice,
      currentPrice: topPerformer.currentPrice,
      profitPercent: Number(topPerformer.profitPercent.toFixed(2)),
      profitValue: topPerformer.profitValue,
      isPositive: topPerformer.profitPercent >= 0,
    };
  },
);
