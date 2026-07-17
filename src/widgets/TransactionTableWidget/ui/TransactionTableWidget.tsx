import { useSelector } from "react-redux";
import * as cls from "./TransactionTableWidget.module.scss";
import { selectTransactions } from "@/entities/Portfolio";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { formatCurrency } from "@/shared/lib";

export const TransactionTableWidget = () => {
  const transactions = useSelector(selectTransactions);

  return (
    <WidgetCard
      title="Recent Transactions"
      action={<span className={cls.viewAll}>View All</span>}
    >
      <div className={cls.tableContainer}>
        <table className={cls.table}>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Asset</th>
              <th>Amount</th>
              <th>Price</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <div className={cls.typeCell}>
                    <div
                      className={`${cls.icon} ${tx.type === "buy" ? cls.buy : cls.sell}`}
                    >
                      {tx.type === "buy" ? "↓" : "↑"}
                    </div>
                    <div className={cls.details}>
                      <span className={cls.action}>
                        {tx.type === "buy" ? "Bought" : "Sold"}
                      </span>
                      <span className={cls.date}>{tx.date}</span>
                    </div>
                  </div>
                </td>
                <td className={cls.assetCell}>
                  {tx.asset} ({tx.symbol})
                </td>
                <td className={cls.amountCell}>
                  {tx.type === "buy" ? "+" : "-"}
                  {tx.amount} {tx.symbol}
                </td>
                <td className={cls.amountCell}>{formatCurrency(tx.price)}</td>
                <td className={cls.totalCell}>
                  {formatCurrency(tx.amount * tx.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
};
