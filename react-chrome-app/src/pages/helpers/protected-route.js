import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ session }) => {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
