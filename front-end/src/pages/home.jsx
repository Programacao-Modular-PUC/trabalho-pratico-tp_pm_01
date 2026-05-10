import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Star, Users } from 'lucide-react'
import Searchbar from '../components/searchbar'
import { api } from '../services/api'
import { buildAccommodation } from '../services/auth'

const fallbackHighlights = [
    { id: 'villa', title: 'Villa do Pontal', name: 'Villa do Pontal', price: 1150, rating: '5.0', img: '/img/vila_pontal.jpg', location: 'Marau, Bahia' },
    { id: 'bangalo', title: 'Bangalo Tropical', name: 'Bangalo Tropical', price: 620, rating: '4.9', img: '/img/bangalo.jpg', location: 'Marau, Bahia' },
    { id: 'suite', title: 'Suite Roots', name: 'Suite Roots', price: 380, rating: '4.8', img: '/img/suite_roots.jpg', location: 'Marau, Bahia' }
]

function Home() {
    const navigate = useNavigate()
    const [highlights, setHighlights] = useState(fallbackHighlights)

    useEffect(() => {
        let mounted = true

        api.listQuartos()
            .then((rooms) => {
                if (!mounted || !rooms?.length) return
                setHighlights(rooms.slice(0, 3).map(buildAccommodation))
            })
            .catch(() => {
                if (mounted) setHighlights(fallbackHighlights)
            })

        return () => {
            mounted = false
        }
    }, [])

    const openAccommodation = (item) => {
        navigate('/hospedagem', { state: { selectedAccommodation: item } })
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-400 selection:text-black antialiased">
            <header id="hospedagem" className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="h-px w-12 bg-amber-400"></span>
                            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em]">O paraiso na Bahia</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                            Sinta o luxo da <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">natureza.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl font-medium mb-12">
                            Descubra residencias exclusivas em Marau, onde conforto, natureza e reserva online se encontram.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <Link to="/hospedagem" className="px-10 py-5 bg-amber-400 text-black font-black rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition active:scale-95">
                                Explorar Agora
                            </Link>
                            <Link to="/login" className="px-10 py-5 bg-white/5 border border-white/10 font-black rounded-2xl hover:bg-white/10 transition backdrop-blur-md">
                                Entrar
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative">
                        <div className="space-y-4 pt-12">
                            <img src="https://images.unsplash.com/photo-1721029145366-205b3b927b3d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="rounded-[2.5rem] h-80 w-full object-cover border border-white/10 shadow-2xl" alt="Marau" />
                            <img src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80" className="rounded-[2.5rem] h-56 w-full object-cover border border-white/10 shadow-2xl" alt="Bahia" />
                        </div>
                        <div className="space-y-4">
                            <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80" className="rounded-[2.5rem] h-56 w-full object-cover border border-white/10 shadow-2xl" alt="Hotel" />
                            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80" className="rounded-[2.5rem] h-80 w-full object-cover border border-white/10 shadow-2xl" alt="Resort" />
                        </div>
                    </div>
                </div>
            </header>

            <Searchbar />

            <main id="destinos" className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-lg">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter">Estadias em Destaque</h2>
                        <p className="text-gray-500 font-medium">Quartos cadastrados pelo host, prontos para reserva pelo cliente.</p>
                    </div>
                    <Link to="/hospedagem" className="text-amber-400 font-black text-xs uppercase tracking-widest border-b-2 border-amber-400 pb-1 hover:text-white hover:border-white transition">
                        Ver todas as propriedades
                    </Link>
                </div>

                <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {highlights.map((item) => (
                        <button key={item.id} onClick={() => openAccommodation(item)} className="group cursor-pointer text-left">
                            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-6">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black border border-white/10">
                                    <Star size={14} className="text-amber-400 fill-amber-400" /> {item.rating}
                                </div>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition">{item.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium">{item.location}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-white">R$ {Number(item.price || 0).toLocaleString('pt-BR')}</span>
                                    <p className="text-[10px] uppercase text-amber-400 font-black tracking-widest mt-1">por noite</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </section>

                <section id="sobre" className="mt-40 p-10 md:p-20 rounded-[4rem] bg-gradient-to-br from-[#111] to-[#080808] border border-white/5 relative overflow-hidden">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Trabalho de <br /><span className="text-amber-400">Programacao Modular</span></h3>
                            <p className="text-gray-400 leading-relaxed text-lg mb-12 font-medium">
                                Projeto pratico com React, Spring Boot, API REST, persistencia em MySQL e regras de diaria por tipo de quarto.
                            </p>

                            <div className="grid grid-cols-3 gap-10">
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Front-end</h4>
                                    <p className="text-sm font-bold text-gray-300">React & Tailwind</p>
                                </div>
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Back-end</h4>
                                    <p className="text-sm font-bold text-gray-300">Spring Boot</p>
                                </div>
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Banco</h4>
                                    <p className="text-sm font-bold text-gray-300">MySQL</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/40 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                <Users size={18} className="text-amber-400" />
                                Time de Desenvolvimento
                            </h4>
                            <div className="space-y-6">
                                {[
                                    "Guilherme Augusto Martins de Carvalho",
                                    "Italo Eduardo Carneiro da Silva",
                                    "Joao Victor Vial Leite Soares",
                                    "Luca Moreira Ribeiro Mazala de Araujo"
                                ].map((nome) => (
                                    <div key={nome} className="flex items-center gap-4 group cursor-default">
                                        <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-black text-xs group-hover:bg-amber-400 group-hover:text-black transition">
                                            {nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <span className="text-gray-300 font-bold group-hover:text-white transition">
                                            {nome}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home
