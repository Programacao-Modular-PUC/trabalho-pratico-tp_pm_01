import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home.jsx'
import Destinations from './pages/destination.jsx'
import Acommodations from './pages/acommodations.jsx'
import About from './pages/about.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinos" element={<Destinations />} />
        <Route path="/hospedagem" element={<Acommodations />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;