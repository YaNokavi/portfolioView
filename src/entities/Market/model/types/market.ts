export type MarketPrices = Record<string, number>;

export interface MarketSchema {
  prices: MarketPrices;
  isLoading: boolean;
  error?: string;
}
