import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { usePublicTheme } from "../hooks/usePublicTheme"

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const t = usePublicTheme()

    const links = [
        { to: "/", label: "Inicio" },
        { to: "/destinos", label: "Destinos" },
        { to: "/hospedagem", label: "Hospedagem" },
        { to: "/sobre", label: "Sobre" },
    ]

    return (
        <nav className={`fixed top-0 w-full z-50 ${t.nav}`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <img src="/icons/icon.png" alt="icon" />
                    </div>
                    <span className={`text-2xl font-black tracking-tighter uppercase ${t.navBrand}`}>
                        Marau<span className="text-yellow-400">Reserve</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest">
                    <div className="flex gap-8">
                        {links.map(({ to, label }) => (
                            <Link key={to} to={to} className={`transition ${t.navText}`}>
                                {label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 border-l border-slate-200/20 pl-8">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
                                theme === 'light'
                                    ? 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
                                    : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                            aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
                        >
                            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                            {theme === 'light' ? 'Escuro' : 'Claro'}
                        </button>
                        <Link to="/login" className={`transition tracking-widest ${t.navLogin}`}>
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            className="bg-amber-400 text-black px-8 py-3 rounded-full font-black hover:bg-amber-300 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
                        >
                            Cadastrar
                        </Link>
                    </div>
                </div>

                <div className="md:hidden flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg transition ${
                            theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-gray-300 hover:bg-white/10'
                        }`}
                        aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
                    >
                        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                    </button>
                    <button
                        className={`p-2 rounded-lg transition ${
                            theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-gray-300 hover:text-amber-400 hover:bg-white/10'
                        }`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Abrir menu"
                    >
                        {menuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                } ${t.navMobile} backdrop-blur-xl border-t`}
            >
                <div className="px-6 py-6 flex flex-col gap-1">
                    {links.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className={`py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-sm transition ${t.navMobileLink}`}
                        >
                            {label}
                        </Link>
                    ))}

                    <div className={`mt-4 pt-4 border-t flex flex-col gap-3 ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className={`w-full py-3 px-4 rounded-xl text-center font-black uppercase tracking-widest text-sm border transition ${t.navMobileLink} ${
                                theme === 'light' ? 'border-slate-200' : 'border-white/10'
                            }`}
                        >
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setMenuOpen(false)}
                            className="w-full py-3 px-4 rounded-full text-center bg-amber-400 text-black font-black uppercase tracking-widest text-sm hover:bg-amber-300 transition shadow-lg"
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
