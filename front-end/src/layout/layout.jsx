import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { Outlet } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

function Layout() {
    const { isLight } = useTheme()

    return (
        <div className={`min-h-screen flex flex-col ${isLight ? 'bg-slate-50' : 'bg-[#050505]'}`}>
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout
