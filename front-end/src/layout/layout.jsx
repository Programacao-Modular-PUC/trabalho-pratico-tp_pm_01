import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { Outlet } from "react-router-dom"

function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout