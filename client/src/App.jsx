import { Link, NavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useUserStore } from "./store/useUserStore"
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Assign from "./pages/Assign";
import { useQueryClient } from "@tanstack/react-query";
import { Ticket } from 'lucide-react'
import { ToastContainer } from 'react-toastify'

function Layout() {
  const logoutUser = useUserStore(state => state.logoutUser)
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("att_user_storage")
    queryClient.clear()
    navigate("/", { replace: true })
  }

  return (
    <div>
      <ToastContainer closeOnClick position="top-center" />

      <nav className="flex justify-between items-center px-5 py-4 outline bg-blue-50 shadow-md shadow-blue-500">
        <Link to={'/home'} className="uppercase italic font-semibold flex items-center gap-2"><Ticket /> ATT-TicketNest</Link>
        <ul className="flex gap-3 ">
          <li><NavLink to={'/home'} className={({ isActive }) =>
            `font-semibold ${isActive ? "text-blue-500" : "text-gray-600"}`
          }>Home</NavLink></li>
          <li><NavLink to={'/create'} className={({ isActive }) =>
            `font-semibold ${isActive ? "text-blue-500" : "text-gray-600"}`
          }>Create</NavLink></li>
          <li><NavLink to={'/assign'} className={({ isActive }) =>
            `font-semibold ${isActive ? "text-blue-500" : "text-gray-600"}`
          }>Assign</NavLink></li>
        </ul>
        <span type="button" onClick={handleLogout} className="uppercase cursor-pointer font-semibold ">Logout</span>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  const user = useUserStore(state => state.user);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute user={user} />}>
        <Route path="/" element={<Layout />} >
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/assign" element={<Assign />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App;