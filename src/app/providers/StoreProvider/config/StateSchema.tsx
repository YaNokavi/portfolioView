import { PortfolioSchema } from "@/entities/Portfolio";
import { MarketSchema } from "@/entities/Market";
import { createReduxStore } from "./store";

export interface StateSchema {
  portfolio: PortfolioSchema;
  market: MarketSchema;
}
export type AppStore = ReturnType<typeof createReduxStore>;
export type AppDispatch = AppStore["dispatch"];
