import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import * as cls from "./AssetSidebarWidget.module.scss";
import { useSelector } from "react-redux";
import { selectAssetAllocation } from "../model/selectors/sidebarSelectors";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { formatCurrency } from "@/shared/lib";

export const AssetSidebarWidget = () => {
  const { allocation, totalValue } = useSelector(selectAssetAllocation);

  return (
    <WidgetCard title="Allocation">
      <div className={cls.chartContainer}>
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
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              stroke="none"
            >
              {allocation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F222A",
                borderColor: "#2A2D35",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#F5F6F8", fontWeight: 600 }}
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
    </WidgetCard>
  );
};
