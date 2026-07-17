import { AuthPage } from "@/pages/AuthPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { AppLayout } from "@/app/layouts/AppLayout";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "categories",
        children: [
          { index: true, element: <div>TODO: CategoryPage</div> },
          {
            path: ":categoryId",
            element: <div>TODO: CategoryPage Detail</div>,
          },
        ],
      },
      {
        path: "assets",
        children: [
          { index: true, element: <div>TODO: AssetsPage</div> },
          {
            path: ":assetId",
            element: <div>TODO: AssetsPage Detail</div>,
          },
        ],
      },
      {
        path: "allocation",
        element: <div>TODO: AllocationPage</div>,
      },
      {
        path: "history",
        element: <div>TODO: HistoryPage</div>,
      },
      {
        path: "sources",
        element: <div>TODO: SourcesPage</div>,
      },
      {
        path: "settings",
        element: <div>TODO: SettingsPage</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
