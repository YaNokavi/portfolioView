import { configureStore } from "@reduxjs/toolkit";
import { StateSchema } from "./StateSchema";
import { portfolioReducer } from "@/entities/Portfolio";
import { marketReducer } from "@/entities/Market";

export function createReduxStore(initialState?: StateSchema) {
  const rootReducers = {
    // Пока оставляем пустым, добавим слайсы на следующем шаге
    portfolio: portfolioReducer,
    market: marketReducer,
  };

  return configureStore<StateSchema>({
    reducer: rootReducers,
    preloadedState: initialState,
    // Здесь можно отключить devTools для продакшена
    devTools: process.env.NODE_ENV !== "production",
  });
}
