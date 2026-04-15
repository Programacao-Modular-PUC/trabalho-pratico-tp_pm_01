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
import GuestReservations from "./pages/guest-reservations.jsx"
import ResidenceRegistration from "./pages/residence-registration.jsx"

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
          <Route path="/reservas" element={<GuestReservations />} />
        </Route>

        {/* Rotas sem navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/residence-registration" element={<ResidenceRegistration />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App