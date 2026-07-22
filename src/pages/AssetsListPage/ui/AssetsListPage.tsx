import { selectPortfolioHoldings } from "@/entities/Portfolio";
import { formatCurrency } from "@/shared/lib";
import { getAssetColor } from "@/shared/config/assetColors";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import * as styles from "./AssetsListPage.module.scss";

export const AssetListPage = () => {
  const holdings = useSelector(selectPortfolioHoldings);
  const prices = useSelector((state) => state.market.prices);

  const rows = useMemo(() => {
    return Object.values(holdings).map((holding) => {
      const currentPrice = prices[holding.symbol] ?? 0;
      const totalValue = holding.amount * currentPrice;
      const pnlValue = totalValue - holding.totalInvested;
      const pnlPercent =
        holding.totalInvested > 0
          ? (pnlValue / holding.totalInvested) * 100
          : 0;

      return {
        symbol: holding.symbol,
        name: holding.name,
        amount: holding.amount,
        avgBuyPrice: holding.avgBuyPrice,
        currentPrice,
        totalValue,
        pnlValue,
        pnlPercent,
        pnlAvailable: !["USD", "RUB", "USDT"].includes(holding.symbol),
      };
    });
  }, [holdings, prices]);

  return (
    <section className={styles.assetListPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Assets</h1>
        <p className={styles.subtitle}>Overview of your current positions</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Portfolio assets</h2>
            <p className={styles.cardSubtitle}>{rows.length} positions</p>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Amount</th>
                <th>Avg buy</th>
                <th>Current</th>
                <th>Value</th>
                <th>PnL</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No assets in portfolio
                  </td>
                </tr>
              )}

              {rows.map((row) => (
                <tr key={row.symbol}>
                  <td>
                    <div className={styles.assetCell}>
                      <span
                        className={styles.dot}
                        style={{ backgroundColor: getAssetColor(row.symbol) }}
                      />
                      <div>
                        <div className={styles.assetName}>{row.name}</div>
                        <div className={styles.assetSymbol}>{row.symbol}</div>
                      </div>
                    </div>
                  </td>

                  <td>{row.amount}</td>
                  <td>{formatCurrency(row.avgBuyPrice)}</td>
                  <td>{formatCurrency(row.currentPrice)}</td>
                  <td>{formatCurrency(row.totalValue)}</td>
                  <td>
                    {row.pnlAvailable ? (
                      <span
                        className={styles.pnl}
                        data-positive={row.pnlValue >= 0}
                      >
                        {row.pnlValue >= 0 ? "+" : ""}
                        {formatCurrency(row.pnlValue)} (
                        {row.pnlPercent.toFixed(2)}%)
                      </span>
                    ) : (
                      <span className={styles.pnlDisabled}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
