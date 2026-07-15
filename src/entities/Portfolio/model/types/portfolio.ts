export type TransactionType = "buy" | "sell";

export interface Transaction {
  id: string;
  type: TransactionType;
  asset: string;
  symbol: string;
  amount: number;
  price: number;
  date: string;
}
export interface PortfolioSchema {
  transactions: Transaction[];
}
