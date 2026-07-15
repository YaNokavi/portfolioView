import { AssetSidebarWidget } from "@/widgets/AssetSidebarWidget/ui/AssetSidebarWidget";
import { BalanceWidget } from "@/widgets/BalanceWidget";
import { PortfolioChartWidget } from "@/widgets/PortfolioChartWidget/ui/PortfolioChartWidget";
import { TopPerformerWidget } from "@/widgets/TopPerformerWidget/ui/TopPerformerWidget";
import "./DashboardPage.scss";
import { TransactionTableWidget } from "@/widgets/TransactionTableWidget/ui/TransactionTableWidget";

export const DashboardPage = () => {
  return (
    <div className="bento-dashboard">
      <div className="bento-header">
        {/* Здесь будет Header виджет */}
        <h1>Crypto Portfolio</h1>
      </div>

      <div className="bento-grid">
        {/* Главный график (Широкий) */}
        <div className="bento-item area-chart">
          <PortfolioChartWidget />
        </div>

        {/* Текущий баланс (Квадрат) */}
        <div className="bento-item area-balance">
          <BalanceWidget />
        </div>

        {/* Лидер роста (Квадрат) */}
        <div className="bento-item area-top">
          <TopPerformerWidget />
        </div>

        {/* Сайдбар со списком монет (Высокий) */}
        <div className="bento-item area-sidebar">
          <AssetSidebarWidget />
        </div>

        {/* Таблица транзакций (На всю ширину снизу) */}
        <div className="bento-item area-table">
          <TransactionTableWidget />
        </div>
      </div>
    </div>
  );
};
