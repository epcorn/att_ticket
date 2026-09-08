import { useUserStore } from "./store/useUserStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Assign from "./pages/Assign";
import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";


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