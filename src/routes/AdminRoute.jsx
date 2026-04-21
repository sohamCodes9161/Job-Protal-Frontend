import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

const AdminRoute = () => {
  const token = getToken();
  const user = getUser();

  if (!token || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;