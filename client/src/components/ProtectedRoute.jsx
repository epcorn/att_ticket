import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user }) => {
  // If user is not authenticated, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render child routes
  return <Outlet />;
};

export default ProtectedRoute;