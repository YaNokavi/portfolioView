import { useSelector } from "react-redux";
import * as cls from "./TransactionTableWidget.module.scss";
import { selectTransactions } from "@/entities/Portfolio";

export const TransactionTableWidget = () => {
  const transactions = useSelector(selectTransactions);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <div className={cls.widget}>
      <div className={cls.header}>
        <h2 className={cls.title}>Recent Transactions</h2>
        <span className={cls.viewAll}>View All</span>
      </div>

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
                {/* 1. Колонка: Иконка покупки/продажи и дата */}
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

                {/* 2. Колонка: Актив */}
                <td className={cls.assetCell}>
                  {tx.asset} ({tx.symbol})
                </td>

                {/* 3. Колонка: Количество монет */}
                <td className={cls.amountCell}>
                  {tx.type === "buy" ? "+" : "-"}
                  {tx.amount} {tx.symbol}
                </td>

                {/* 4. Колонка: Цена за монету */}
                <td className={cls.amountCell}>{formatCurrency(tx.price)}</td>

                {/* 5. Колонка: Итоговая сумма сделки */}
                <td className={cls.totalCell}>
                  {formatCurrency(parseFloat(tx.amount) * tx.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
