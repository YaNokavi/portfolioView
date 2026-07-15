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
    <div className={cls.widget}>
      <div className={cls.header}>
        <h2 className={cls.title}>Portfolio Performance</h2>
        <div className={cls.filters}>
          {/* Пока просто визуальные заглушки */}
          <span className={cls.active}>1W</span>
          <span>1M</span>
          <span>1Y</span>
        </div>
      </div>

      <div className={cls.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            {/* Описание градиента для заливки */}
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Сетка на заднем фоне (только горизонтальная) */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#334155"
            />

            {/* Оси */}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dx={-10}
              domain={["dataMin - 500", "dataMax + 500"]}
              width={60}
            />

            {/* Всплывающая подсказка при наведении */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#f8fafc", fontWeight: 600 }}
              formatter={(value: number) => [`$${value}`, "Balance"]}
            />

            {/* Сама линия и заливка */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
