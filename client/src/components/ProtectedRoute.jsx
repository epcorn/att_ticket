import { Navigate, Outlet, useLocation } from "react-router-dom"

function ProtectedRoute({ user }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to={'/'} state={{ from: location }} replace />
  } else {
    return <Outlet />
  }

}

export default ProtectedRoute