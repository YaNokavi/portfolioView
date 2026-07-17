import { AppSidebar } from "@/widgets/AppSidebar";
import { Navigate, Outlet } from "react-router-dom";
import * as styles from "./AppLayout.module.scss";

export const AppLayout = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className={styles.layout}>
      {/* TODO: add header component */}
      <AppSidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};
