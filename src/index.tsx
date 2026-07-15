import { createRoot } from "react-dom/client";
import { DashboardPage } from "@/pages/DashboardPage/ui/DashboardPage";
import "./app/styles/index.css";
import { StoreProvider } from "./app/providers/StoreProvider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root элемент не найден. Проверь index.html");
}

const root = createRoot(rootElement);

root.render(
  <StoreProvider>
    <DashboardPage />
  </StoreProvider>,
);
