import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./layout/layout.jsx"

import Home from "./pages/home"
import Destinos from "./pages/destination"
import Hospedagem from "./pages/acommodations"
import Sobre from "./pages/about"
import Login from "./pages/login"
import Register from "./pages/register"
import SaibaMais from "./pages/learn-more.jsx"
import Gallery from "./pages/gallery.jsx"
import HostDashboard from "./modules/host/HostLayout.jsx"
import Guest from "./modules/guest/GuestLayout.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rotas com navbar e footer*/}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/destinos" element={<Destinos />} />
          <Route path="/hospedagem" element={<Hospedagem />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/saiba-mais" element={<SaibaMais />} />
          <Route path="/galeria" element={<Gallery />} />
        </Route>

        {/* Rotas sem navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/host" element={<HostDashboard />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="*" element={<h1 className="text-center mt-20 text-3xl font-bold">404 - Página Não Encontrada</h1>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App