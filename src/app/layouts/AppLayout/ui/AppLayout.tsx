import { AppSidebar } from "@/widgets/AppSidebar";
import { Navigate, Outlet } from "react-router-dom";

export const AppLayout = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: "flex" }}>
      {/* TODO: add header component */}
      <AppSidebar />
      <Outlet />
    </div>
  );
};
