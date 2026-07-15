import { StateSchema } from "@/app/providers/StoreProvider";

export const selectMarketPrices = (state: StateSchema) => state.market.prices;
