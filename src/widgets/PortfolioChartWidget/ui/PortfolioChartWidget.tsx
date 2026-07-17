import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as cls from "./PortfolioChartWidget.module.scss";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { formatCurrency } from "@/shared/lib";

const mockData = [
  { date: "Mon", value: 11200 },
  { date: "Tue", value: 11800 },
  { date: "Wed", value: 11500 },
  { date: "Thu", value: 15100 },
  { date: "Fri", value: 11900 },
  { date: "Sat", value: 12600 },
  { date: "Sun", value: 12450 },
];

export const PortfolioChartWidget = () => {
  return (
    <WidgetCard
      title="Portfolio Performance"
      action={<div>...</div>}
      className={cls.filters}
    >
      <div className={cls.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            {/* Описание градиента для заливки */}
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Сетка на заднем фоне (только горизонтальная) */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#2A2D35"
            />

            {/* Оси */}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9AA1AC", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9AA1AC", fontSize: 12 }}
              dx={-10}
              domain={["dataMin - 500", "dataMax + 500"]}
              width={60}
            />

            {/* Всплывающая подсказка при наведении */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F222A",
                borderColor: "#2A2D35",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#F5F6F8", fontWeight: 600 }}
              formatter={(value: number) => [formatCurrency(value), "Balance"]}
            />

            {/* Сама линия и заливка */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#F7931A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
};
