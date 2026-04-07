import React, { useState, forwardRef } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import {
    MapPin,
    Calendar as CalendarIcon,
    Users,
    Star,
    CheckCircle,
    ChevronDown,
    Search,
    Palmtree
} from 'lucide-react';
import { Link } from 'react-router-dom';


registerLocale('pt-BR', ptBR);

function Home() {
    // Estados para as datas e hóspedes
    const [location] = useState("Península de Maraú, Bahia")
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [guests, setGuests] = useState("1");

    // Input customizado para o DatePicker
    const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
        <div
            className="flex items-center gap-3 w-full text-left cursor-pointer group"
            onClick={onClick}
            ref={ref}
        >
            <CalendarIcon size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="flex-grow">
                <span className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-0.5">
                    Estadia
                </span>
                <span className={`text-sm font-medium ${value ? 'text-white' : 'text-gray-500'}`}>
                    {value || placeholder}
                </span>
            </div>
            <ChevronDown size={14} className="text-gray-600" />
        </div>
    ));

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-400 selection:text-black antialiased">


            {/* NAVBAR */}
            

            {/* HERO SECTION */}
            <header id="hospedagem" className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="h-px w-12 bg-amber-400"></span>
                            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em]">O paraíso na Bahia</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                            Sinta o luxo da <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">natureza.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl font-medium mb-12">
                            Descubra residências exclusivas em Maraú, onde o conforto encontra a preservação ambiental. Sua jornada inesquecível começa aqui.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <button className="px-10 py-5 bg-amber-400 text-black font-black rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition active:scale-95">EXPLORAR AGORA</button>
                            <button className="px-10 py-5 bg-white/5 border border-white/10 font-black rounded-2xl hover:bg-white/10 transition backdrop-blur-md">VER GALERIA</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative">
                        <div className="space-y-4 pt-12">
                            <img src="https://images.unsplash.com/photo-1721029145366-205b3b927b3d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="rounded-[2.5rem] h-80 w-full object-cover border border-white/10 shadow-2xl" alt="Maraú" />
                            <img src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80" className="rounded-[2.5rem] h-56 w-full object-cover border border-white/10 shadow-2xl" alt="Bahia" />
                        </div>
                        <div className="space-y-4">
                            <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80" className="rounded-[2.5rem] h-56 w-full object-cover border border-white/10 shadow-2xl" alt="Hotel" />
                            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80" className="rounded-[2.5rem] h-80 w-full object-cover border border-white/10 shadow-2xl" alt="Resort" />
                        </div>
                    </div>
                </div>
            </header>

            {/* SEARCH BAR */}
            <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-40">
                <div className="bg-[#111] border border-white/10 p-4 md:p-6 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center">

                        {/* Localização */}
                        <div className="p-4 md:px-8 border-b md:border-b-0 md:border-r border-white/5 group">
                            <label className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Onde</label>
                            <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-amber-400" />
                                <input
                                    value={location}
                                    type="text"
                                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-white placeholder:text-gray-600 w-full outline-none"
                                />
                            </div>
                        </div>

                        {/* Check-in / Out com DatePicker */}
                        <div className="p-4 md:px-8 border-b md:border-b-0 md:border-r border-white/5">
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setStartDate(update[0]);
                                    setEndDate(update[1]);
                                }}
                                locale="pt-BR"
                                minDate={new Date()}
                                placeholderText="Entrada — Saída"
                                customInput={<CustomDateInput placeholder="Entrada — Saída" />}
                            />
                        </div>

                        {/* Hóspedes */}
                        <div className="p-4 md:px-8 border-b md:border-b-0 group">
                            <label className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Quem</label>
                            <div className="flex items-center gap-3">
                                <Users size={20} className="text-amber-400" />
                                <select
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-white w-full outline-none appearance-none cursor-pointer"
                                >
                                    <option className="bg-black">1 Pessoa</option>
                                    <option className="bg-black">2 Pessoas</option>
                                    <option className="bg-black">3 Pessoas</option>
                                    <option className="bg-black">4+ Pessoas</option>
                                </select>
                                <ChevronDown size={14} className="text-gray-600" />
                            </div>
                        </div>

                        {/* Botão de Busca */}
                        <div className="p-2">
                            <button className="w-full bg-amber-400 h-16 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-amber-300 transition shadow-xl shadow-amber-500/20 active:scale-95 group">
                                <Search size={24} className="text-black group-hover:scale-110 transition" />
                                <span className="text-black font-black text-sm uppercase tracking-widest">Pesquisar</span>
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* CONTEÚDO PRINCIPAL (Destaques) */}
            <main id="destinos" className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-lg">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter">Estadias em Destaque</h2>
                        <p className="text-gray-500 font-medium">Curadoria exclusiva das melhores residências e bangalôs à beira-mar.</p>
                    </div>
                    <button className="text-amber-400 font-black text-xs uppercase tracking-widest border-b-2 border-amber-400 pb-1 hover:text-white hover:border-white transition">Ver todas as propriedades</button>
                </div>

                <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { title: "Bangalô Tropical", price: "R$ 450", rating: "4.9", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80" },
                        { title: "Villa Maré Alta", price: "R$ 1.200", rating: "5.0", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80" },
                        { title: "Suíte Roots", price: "R$ 320", rating: "4.8", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80" }
                    ].map((item, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-6">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black border border-white/10">
                                    <Star size={14} className="text-amber-400 fill-amber-400" /> {item.rating}
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition">{item.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium">Maraú, Bahia</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-white">{item.price}</span>
                                    <p className="text-[10px] uppercase text-amber-400 font-black tracking-widest mt-1">por noite</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* INFO DO PROJETO */}
                <section id="sobre" className="mt-40 p-10 md:p-20 rounded-[4rem] bg-gradient-to-br from-[#111] to-[#080808] border border-white/5 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/5 blur-[100px] rounded-full"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Trabalho de <br /><span className="text-amber-400">Programação Modular</span></h3>
                            <p className="text-gray-400 leading-relaxed text-lg mb-12 font-medium">
                                Desenvolvido como projeto prático para a materia de <strong className="text-white">Programação Modular do curso de Engenharia de Software</strong>, o Maraú Reserve aplica conceitos de POO, API REST, persistência em banco de dados relacional e arquitetura desacoplada.
                            </p>

                            <div className="grid grid-cols-3 gap-10">
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Front-end</h4>
                                    <p className="text-sm font-bold text-gray-300">React & Tailwind</p>
                                </div>
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Back-end</h4>
                                    <p className="text-sm font-bold text-gray-300">Spring Boot (Java)</p>
                                </div>
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Banco de dados</h4>
                                    <p className="text-sm font-bold text-gray-300">MySql</p>
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
                                    "Ítalo Eduardo Carneiro da Silva",
                                    "João Victor Vial Leite Soares",
                                    "Luca Moreira Ribeiro Mazala de Araujo"
                                ].map((nome, index) => (
                                    <div key={index} className="flex items-center gap-4 group cursor-default">
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

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-16 bg-[#030303]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3 grayscale opacity-50">
                            <Palmtree size={20} />
                            <span className="font-black tracking-tighter uppercase text-sm">Maraú Reserve</span>
                        </div>
                        <p className="text-gray-600 text-[12px] font-bold uppercase tracking-widest">
                            © 2026 PUC Minas — Programação Modular
                        </p>
                        <div className="flex gap-8 text-gray-500 text-xs font-black uppercase tracking-widest">
                            <a href="https://github.com/Programacao-Modular-PUC/trabalho-pratico-tp_pm_01" target='_blank' className="hover:text-white transition">Github</a>
                            <a href="https://github.com/Programacao-Modular-PUC/trabalho-pratico-tp_pm_01/tree/docs/docs" target='_blank' className="hover:text-white transition">Docs</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;