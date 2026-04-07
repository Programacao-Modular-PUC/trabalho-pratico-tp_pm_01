import { useState } from "react"
import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <img src="/icons/icon.png" alt="icon"></img>
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase text-white">Maraú<span className="text-yellow-400">Reserve</span></span>
                </div>
                <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest">
                    <div className="flex gap-8 text-gray-400">
                        <a href="/" className="hover:text-amber-400 transition">Início</a>
                        <Link to='/destinos' className="hover:text-amber-400 transition">Destinos</Link>
                        <Link to='/hospedagem' className="hover:text-amber-400 transition">Hospedagem</Link>
                        <Link to='/sobre' className="hover:text-amber-400 transition">Sobre</Link>
                    </div>
                    <div className="flex items-center gap-6 border-l border-white/10 pl-10">
                        <button className="text-gray-300 hover:text-white transition tracking-widest">
                            <Link to='/login'>Entrar</Link>
                        </button>
                        <button className="bg-white text-black px-8 py-3 rounded-full font-black hover:bg-amber-400 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-white/5">
                            <Link to='/register'>Cadastrar</Link>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar