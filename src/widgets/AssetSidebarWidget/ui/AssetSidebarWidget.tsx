import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import * as cls from "./AssetSidebarWidget.module.scss";
import { useSelector } from "react-redux";
import { selectAssetAllocation } from "../model/selectors/sidebarSelectors";

// Моковые данные (позже заменим на селектор Redux)

export const AssetSidebarWidget = () => {
  // Считаем общую сумму для центральной надписи

  const { allocation, totalValue } = useSelector(selectAssetAllocation);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <div className={cls.widget}>
      <h2 className={cls.title}>Allocation</h2>

      <div className={cls.chartContainer}>
        {/* Центральный текст */}
        <div className={cls.centerLabel}>
          <span>Total</span>
          <strong>{formatCurrency(totalValue)}</strong>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocation}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70} // Делает из обычного пирога пончик
              outerRadius={90}
              paddingAngle={5} // Зазоры между кусками
              stroke="none" // Убирает белую обводку
            >
              {allocation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#f8fafc", fontWeight: 600 }}
              formatter={(value: number) => [formatCurrency(value), "Value"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={cls.assetsList}>
        {allocation.map((asset) => (
          <div key={asset.symbol} className={cls.assetItem}>
            <div className={cls.assetInfo}>
              <div
                className={cls.dot}
                style={{ backgroundColor: asset.color }}
              />
              <span className={cls.name}>{asset.name}</span>
            </div>
            <div className={cls.assetValue}>
              <span className={cls.fiat}>{formatCurrency(asset.value)}</span>
              <span className={cls.percent}>{asset.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
