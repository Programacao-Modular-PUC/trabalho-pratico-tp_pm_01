import React, { useState, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import {
    MapPin,
    Calendar as CalendarIcon,
    Users,
    Star,
    ChevronDown,
    Search
} from 'lucide-react'
import Searchbar from '../components/searchbar'

registerLocale('pt-BR', ptBR)

function Hospedagem() {
    const navigate = useNavigate()
    const [location] = useState('Península de Maraú, Bahia')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [guests, setGuests] = useState('1')
    const [searchTerm, setSearchTerm] = useState('')

    const lodgings = [
        {
            id: 1,
            title: 'Bangalô da Maraú',
            name: 'Bangalô da Maraú',
            location: 'Barra Grande',
            description: 'Bangalô com piscina privativa, vista para o mar e amenidades de luxo.',
            price: 620,
            rating: '4.9',
            img: '/img/praia_de_algodoes.jpg',
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            amenities: ['WiFi', 'Piscina privativa', 'TV 4K', 'Ar condicionado', 'Varanda com vista']
        },
        {
            id: 2,
            title: 'Villa Pontal do Mutá',
            name: 'Villa Pontal do Mutá',
            location: 'Ponta do Mutá',
            description: 'Casa ampla com deck, cozinha gourmet e serviço de concierge local.',
            price: 1150,
            rating: '5.0',
            img: '/img/praia-do-muta.jpg',
            beds: 3,
            bathrooms: 2,
            maxGuests: 6,
            amenities: ['WiFi Premium', 'Cozinha gourmet', 'Deck amplo', 'Concierge 24h', 'Frigobar']
        },
        {
            id: 3,
            title: 'Suíte Roots',
            name: 'Suíte Roots',
            location: 'Três Coqueiros',
            description: 'Suíte charmosa com decoração rústica, ideal para casais.',
            price: 380,
            rating: '4.7',
            img: '/img/praia_de_tres_coqueiros.jpg',
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            amenities: ['WiFi', 'Ar condicionado', 'Decoração rústica', 'Café da manhã', 'Varanda']
        },
        {
            id: 4,
            title: 'Refúgio do Cassange',
            name: 'Refúgio do Cassange',
            location: 'Cassange',
            description: 'Refúgio exclusivo junto à lagoa, perfeito para relaxar em família.',
            price: 540,
            rating: '4.8',
            img: '/img/praia_do_cassange.jpg',
            beds: 2,
            bathrooms: 1,
            maxGuests: 4,
            amenities: ['WiFi', 'Vista para lagoa', 'Ar condicionado', 'Área de estar', 'Kitchenette']
        },
        {
            id: 5,
            title: 'Pousada Trilha do Sol',
            name: 'Pousada Trilha do Sol',
            location: 'Barra Grande',
            description: 'Pousada com piscina ao ar livre, café da manhã regional e atmosfera acolhedora.',
            price: 460,
            rating: '4.8',
            img: '/img/praia_barra_grande.jpg',
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            amenities: ['WiFi', 'Piscina', 'Café da manhã', 'Restaurante', 'Bar']
        },
        {
            id: 6,
            title: 'Casa do Farol',
            name: 'Casa do Farol',
            location: 'Pontal do Mutá',
            description: 'Casa de temporada com vista panorâmica, varanda espaçosa e acesso à praia.',
            price: 980,
            rating: '4.9',
            img: '/img/praia-do-muta.jpg',
            beds: 2,
            bathrooms: 2,
            maxGuests: 4,
            amenities: ['WiFi', 'Vista panorâmica', 'Varanda espaçosa', 'Acesso à praia', 'Ar condicionado']
        }
    ]

    const filteredLodgings = lodgings.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
    ))

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-400 selection:text-black antialiased">
            <header className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="h-px w-12 bg-amber-400"></span>
                            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em]">Hospedagem</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                            Encontre a melhor <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">hospedagem</span> para sua viagem.
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl font-medium mb-12">
                            Explore acomodações cuidadosamente selecionadas em Maraú, com ofertas que combinam conforto, natureza e experiências exclusivas.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <button
                                onClick={() => navigate('/reservas')}
                                className="px-10 py-5 bg-amber-400 text-black font-black rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition active:scale-95"
                            >
                                Reserve agora
                            </button>
                            <a href="#acomodacoes" className="px-10 py-5 bg-white/5 border border-white/10 font-black rounded-2xl hover:bg-white/10 transition backdrop-blur-md inline-flex items-center justify-center">
                                Ver acomodações
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative">
                        <div className="space-y-4 pt-12">
                            <img src="/img/praia_de_taipu_de_fora.jpg" className="rounded-[2.5rem] h-80 w-full object-cover border border-white/10 shadow-2xl" alt="Bangalô" />
                            <img src="/img/praia_do_cassange.jpg" className="rounded-[2.5rem] h-56 w-full object-cover border border-white/10 shadow-2xl" alt="Villa" />
                        </div>
                        <div className="space-y-4">
                            <img src="/img/praia-do-muta.jpg" className="rounded-[2.5rem] h-56 w-full object-cover border border-white/10 shadow-2xl" alt="Suíte" />
                            <img src="/img/praia_de_tres_coqueiros.jpg" className="rounded-[2.5rem] h-80 w-full object-cover border border-white/10 shadow-2xl" alt="Refúgio" />
                        </div>
                    </div>
                </div>
            </header>

            <Searchbar></Searchbar>

            <main className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter">Acomodações Disponíveis</h2>
                        <p className="text-gray-500 font-medium">Escolha entre villas, bangalôs e suítes à beira-mar com serviço local e tarifas competitivas.</p>
                    </div>
                    <a href="#acomodacoes" className="text-amber-400 font-black text-xs uppercase tracking-widest border-b-2 border-amber-400 pb-1 hover:text-white hover:border-white transition">Ver todas as ofertas</a>
                </div>

                <section id="acomodacoes" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredLodgings.map((item, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer"
                            onClick={() => navigate('/reservas', { state: { selectedAccommodation: item } })}
                        >
                            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-6">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black border border-white/10">
                                    <Star size={14} className="text-amber-400 fill-amber-400" /> {item.rating}
                                </div>
                                {/* Overlay de clique */}
                                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/10 transition-colors duration-300 rounded-[2.5rem] flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                                    <span className="bg-amber-400 text-black font-black text-sm px-6 py-2 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        Reservar agora →
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition">{item.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium mb-3">{item.location}</p>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-white">R$ {item.price.toLocaleString('pt-BR')}</span>
                                    <p className="text-[10px] uppercase text-amber-400 font-black tracking-widest mt-1">por noite</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {filteredLodgings.length === 0 && (
                    <div className="mt-20 rounded-[2rem] bg-white/5 border border-white/10 p-12 text-center text-gray-300">
                        Nenhuma hospedagem encontrada com esses filtros. Tente outro local ou palavra-chave.
                    </div>
                )}
            </main>
        </div>
    )
}

export default Hospedagem;