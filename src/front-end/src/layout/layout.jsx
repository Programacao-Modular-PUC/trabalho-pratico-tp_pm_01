import Navbar from "../components/navbar.jsx"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Layout