export const ASSET_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  SOL: "#14F195",
  USDT: "#26A17B",
  BNB: "#26A17B",
  // Цвет по умолчанию, если монеты нет в списке
  DEFAULT: "#94a3b8",
};

export const getAssetColor = (symbol: string) =>
  ASSET_COLORS[symbol] || ASSET_COLORS["DEFAULT"];
