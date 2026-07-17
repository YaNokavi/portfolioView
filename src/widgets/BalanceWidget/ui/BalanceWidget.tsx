import { useSelector } from "react-redux";
import * as cls from "./BalanceWidget.module.scss";
import { selectTotalBalanceMetrics } from "../model/selectors/balanceSelectors";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { formatCurrency } from "@/shared/lib";

export const BalanceWidget = () => {
  const metrics = useSelector(selectTotalBalanceMetrics);

  return (
    <WidgetCard title="Total Balance">
      <div className={cls.amount}>{formatCurrency(metrics.totalBalance)}</div>
      <div
        className={`${cls.pnl} ${metrics.isPositive ? cls.positive : cls.negative}`}
      >
        {metrics.isPositive ? "+" : "-"}
        {formatCurrency(Math.abs(metrics.pnlValue))} ({metrics.pnlPercent}%)
      </div>
    </WidgetCard>
  );
};
