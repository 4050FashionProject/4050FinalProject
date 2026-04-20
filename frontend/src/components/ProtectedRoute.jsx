import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
  isAuthenticated,
  redirectPath = "/login",
}) {
  if (!localStorage.getItem("isLoggedIn")) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}
