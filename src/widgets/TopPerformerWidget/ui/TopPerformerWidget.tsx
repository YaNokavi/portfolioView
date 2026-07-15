import React from "react";
import { useSelector } from "react-redux";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { selectTopPerformer } from "../model/selectors/topPerformerSelectors";
import { getAssetColor } from "@/shared/config/assetColors";
import * as cls from "./TopPerformerWidget.module.scss";

const mockSparklineData = [
  { value: 120 },
  { value: 125 },
  { value: 118 },
  { value: 130 },
  { value: 135 },
  { value: 142 },
  { value: 155 },
];

export const TopPerformerWidget = () => {
  const topAsset = useSelector(selectTopPerformer);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  // Если портфель пуст, показываем заглушку
  if (!topAsset) {
    return (
      <div className={cls.widget}>
        <div className={cls.content}>
          <h2 className={cls.title}>Top Performer</h2>
          <div className={cls.stats}>
            <div className={cls.subtext}>No assets in portfolio</div>
          </div>
        </div>
      </div>
    );
  }

  // Динамический цвет (зеленый для плюса, красный для минуса)
  const isPositive = topAsset.isPositive;
  const colorClass = isPositive ? "#34d399" : "#f87171";
  const assetColor = getAssetColor(topAsset.symbol);

  return (
    <div className={cls.widget}>
      <div className={cls.content}>
        <h2 className={cls.title}>Top Performer</h2>

        <div className={cls.coinHeader}>
          <div
            className={cls.coinIcon}
            style={{ background: assetColor, color: "#0f172a" }}
          >
            {topAsset.symbol}
          </div>
          <div>
            <div className={cls.coinName}>{topAsset.name}</div>
            <div className={cls.coinSymbol}>
              Текущая: {formatCurrency(topAsset.currentPrice)}
            </div>
          </div>
        </div>

        <div className={cls.stats}>
          {/* Стилизуем цвет цифры прямо в инлайне для гибкости */}
          <div className={cls.percentage} style={{ color: colorClass }}>
            {isPositive ? "+" : ""}
            {topAsset.profitPercent}%
          </div>
          <div className={cls.subtext}>
            Avg. buy: {formatCurrency(topAsset.avgBuyPrice)}
          </div>
        </div>
      </div>

      {/* Фоновый мини-график */}
      <div className={cls.sparklineContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockSparklineData}>
            <defs>
              <linearGradient id="colorSpark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorClass} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colorClass} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={colorClass}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSpark)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
