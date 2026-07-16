import React from "react";
import { useSelector } from "react-redux";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { selectTopPerformer } from "../model/selectors/topPerformerSelectors";
import { getAssetColor } from "@/shared/config/assetColors";
import * as cls from "./TopPerformerWidget.module.scss";
import { WidgetCard } from "@/shared/ui/WidgetCard";

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
      <WidgetCard title="Top Performer">
        <div className={cls.subtext}>No assets in portfolio</div>
      </WidgetCard>
    );
  }

  const isPositive = topAsset.isPositive;
  const colorClass = isPositive ? "#34d399" : "#f87171";
  const assetColor = getAssetColor(topAsset.symbol);

  return (
    <WidgetCard title="Top Performer">
      <div className={cls.coinHeader}>
        <div
          className={cls.coinIcon}
          style={{ background: assetColor, color: "#0B0D10" }}
        >
          {topAsset.symbol}
        </div>
        <div>
          <div className={cls.coinName}>{topAsset.name}</div>
          <div className={cls.coinSub}>
            Текущая: {formatCurrency(topAsset.currentPrice)}
          </div>
        </div>
      </div>

      <div className={cls.stats}>
        <div className={cls.percentage} style={{ color: colorClass }}>
          {isPositive ? "+" : ""}
          {topAsset.profitPercent}%
        </div>
        <div className={cls.subtext}>
          Avg. buy: {formatCurrency(topAsset.avgBuyPrice)}
        </div>
      </div>

      {/* Фоновый спарклайн */}
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
    </WidgetCard>
  );
};
