import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./layout/layout.jsx"

import Home from "./pages/home"
import Destinos from "./pages/destination"
import Hospedagem from "./pages/acommodations"
import Sobre from "./pages/about"
import Login from "./pages/login"
import Register from "./pages/register"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rotas com navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/destinos" element={<Destinos />} />
          <Route path="/hospedagem" element={<Hospedagem />} />
          <Route path="/sobre" element={<Sobre />} />
        </Route>

        {/* Rotas sem navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App