import { createRoot } from "react-dom/client";
import "./app/styles/index.css";
import { StoreProvider } from "./app/providers/StoreProvider";
import { AppRouter } from "./app/providers/RouterProvider/ui/AppRouter";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root элемент не найден. Проверь index.html");
}

const root = createRoot(rootElement);

root.render(
  <StoreProvider>
    <AppRouter />
  </StoreProvider>,
);
