import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import Create from "./pages/Create";
// import Assign from "./pages/Assign";
import Layout from "./components/Layout";
import { useUserStore } from "./store/useUserStore";
import Users from "./pages/Users";

const Create = lazy(() => import("./pages/Create"))
const Assign = lazy(() => import("./pages/Assign"))

function App() {
  const user = useUserStore((state) => state.user);

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute user={user} />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="create" element={<Suspense fallback={"loading"}><Create /></Suspense>} />
          <Route path="assign" element={<Suspense fallback={"loading"}><Assign /></Suspense>} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default App;