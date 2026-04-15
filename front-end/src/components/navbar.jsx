import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { to: "/", label: "Início" },
        { to: "/destinos", label: "Destinos" },
        { to: "/hospedagem", label: "Hospedagem" },
        { to: "/reservas", label: "Reservas" },
        { to: "/sobre", label: "Sobre" },
    ]

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <img src="/icons/icon.png" alt="icon" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase text-white">
                        Maraú<span className="text-yellow-400">Reserve</span>
                    </span>
                </div>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest">
                    <div className="flex gap-8 text-gray-400">
                        {links.map(({ to, label }) => (
                            <Link key={to} to={to} className="hover:text-amber-400 transition">
                                {label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-6 border-l border-white/10 pl-10">
                        <Link to="/login" className="text-gray-300 hover:text-white transition tracking-widest">
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            className="bg-white text-black px-8 py-3 rounded-full font-black hover:bg-amber-400 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
                        >
                            Cadastrar
                        </Link>
                    </div>
                </div>

                {/* Hamburger button — mobile only */}
                <button
                    className="md:hidden p-2 rounded-lg text-gray-300 hover:text-amber-400 hover:bg-white/10 transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Abrir menu"
                >
                    {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile menu — slide down */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                } bg-black/90 backdrop-blur-xl border-t border-white/5`}
            >
                <div className="px-6 py-6 flex flex-col gap-1">
                    {links.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className="py-3 px-4 rounded-xl text-gray-300 font-bold uppercase tracking-widest text-sm hover:text-amber-400 hover:bg-white/5 transition"
                        >
                            {label}
                        </Link>
                    ))}

                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="w-full py-3 px-4 rounded-xl text-center text-gray-300 font-black uppercase tracking-widest text-sm hover:text-amber-400 hover:bg-white/5 border border-white/10 transition"
                        >
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setMenuOpen(false)}
                            className="w-full py-3 px-4 rounded-full text-center bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-amber-400 transition shadow-lg"
                        >
                            Cadastrar
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar