import { Navigate, Outlet } from "react-router-dom";

export const AppLayout = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      {/* TODO: add header component */}
      <Outlet />
    </>
  );
};
