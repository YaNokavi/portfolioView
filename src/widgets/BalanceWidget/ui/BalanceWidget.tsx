import { useSelector } from "react-redux";
import * as cls from "./BalanceWidget.module.scss";
import { selectTotalBalanceMetrics } from "../model/selectors/balanceSelectors";

export const BalanceWidget = () => {
  const metrics = useSelector(selectTotalBalanceMetrics);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <div className={cls.widget}>
      <div>
        <h2 className={cls.title}>Total Balance</h2>
        <div className={cls.amount}>{formatCurrency(metrics.totalBalance)}</div>
      </div>

      <div
        className={`${cls.pnl} ${metrics.isPositive ? cls.positive : cls.negative}`}
      >
        {metrics.isPositive ? "+" : "-"}{" "}
        {formatCurrency(Math.abs(metrics.pnlValue))} ({metrics.pnlPercent}%)
      </div>
    </div>
  );
};
