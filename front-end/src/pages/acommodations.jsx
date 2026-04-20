import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import {
    MapPin,
    Bed,
    Bath,
    Users,
    DollarSign,
    X,
    Check,
    Calendar,
    AlertCircle,
    Star,
    Filter,
    ChevronDown
} from 'lucide-react'
import Searchbar from '../components/searchbar'

registerLocale('pt-BR', ptBR)

function Hospedagem() {
    const navigate = useNavigate()
    const location = useLocation()
    const formRef = useRef(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [priceFilter, setPriceFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [bedsFilter, setBedsFilter] = useState('all')
    const [amenitiesFilter, setAmenitiesFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    
    // Reservation states
    const [selectedAccommodation, setSelectedAccommodation] = useState(null)
    const [preSelected, setPreSelected] = useState(false)
    const [reservationData, setReservationData] = useState({
        checkIn: null,
        checkOut: null,
        guests: '1',
        specialRequests: ''
    })
    const [successMessage, setSuccessMessage] = useState('')
    const [errors, setErrors] = useState({})

    // Ler o hotel pré-selecionado
    useEffect(() => {
        if (location.state?.selectedAccommodation) {
            const incoming = location.state.selectedAccommodation
            const normalized = { ...incoming, name: incoming.name || incoming.title }
            setSelectedAccommodation(normalized)
            setPreSelected(true)
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
        }
    }, [location.state])

    const accommodations = [
        {
            id: 1,
            title: 'Bangalô da Maraú',
            name: 'Bangalô da Maraú',
            location: 'Barra Grande',
            description: 'Bangalô com piscina privativa, vista para o mar e amenidades de luxo.',
            price: 620,
            rating: '4.9',
            img: '/img/bangalo.jpg',
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
            img: '/img/vila_pontal.jpg',
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
            rating: '4.8',
            img: '/img/suite_roots.jpg',
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
            img: '/img/refugio_cassange.jpg',
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
            img: '/img/pousada_trilha_do_sol.jpg',
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
            img: '/img/casa_farol.jpg',
            beds: 2,
            bathrooms: 2,
            maxGuests: 4,
            amenities: ['WiFi', 'Vista panorâmica', 'Varanda espaçosa', 'Acesso à praia', 'Ar condicionado']
        }
    ]

    // Filtrar acomodações
    const filteredLodgings = accommodations.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesPrice = priceFilter === 'all' ||
            (priceFilter === 'budget' && item.price < 500) ||
            (priceFilter === 'medium' && item.price >= 500 && item.price < 1000) ||
            (priceFilter === 'luxury' && item.price >= 1000)
        
        const matchesLocation = locationFilter === 'all' || item.location === locationFilter
        
        const matchesBeds = bedsFilter === 'all' || item.beds.toString() === bedsFilter
        
        const matchesAmenities = amenitiesFilter === 'all' || item.amenities.includes(amenitiesFilter)
        
        return matchesSearch && matchesPrice && matchesLocation && matchesBeds && matchesAmenities
    })

    const locations = [...new Set(accommodations.map(item => item.location))]
    const allAmenities = [...new Set(accommodations.flatMap(item => item.amenities))]

    const validateReservation = () => {
        const newErrors = {}
        if (reservationData.checkIn && reservationData.checkOut && reservationData.checkIn >= reservationData.checkOut) {
            newErrors.checkOut = 'Data de saída deve ser após a entrada'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleReservation = () => {
        if (!validateReservation()) return
        setSuccessMessage('Faça login para confirmar sua reserva!')
        setTimeout(() => {
            navigate('/login')
        }, 500)
    }

    const nights = selectedAccommodation && reservationData.checkIn && reservationData.checkOut
        ? Math.ceil((reservationData.checkOut - reservationData.checkIn) / (1000 * 60 * 60 * 24))
        : 0

    const totalPrice = selectedAccommodation ? selectedAccommodation.price * nights : 0

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
                                onClick={() => document.getElementById('acomodacoes')?.scrollIntoView({ behavior: 'smooth' })}
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

            <main id="acomodacoes" className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter">Acomodações Disponíveis</h2>
                        <p className="text-gray-500 font-medium">Escolha entre villas, bangalôs e suítes à beira-mar com serviço local e tarifas competitivas.</p>
                    </div>
                    <a href="#acomodacoes" className="text-amber-400 font-black text-xs uppercase tracking-widest border-b-2 border-amber-400 pb-1 hover:text-white hover:border-white transition">Ver todas as ofertas</a>
                </div>

                {/* Search and Filters Bar */}
                <div className="mb-8 space-y-4">
                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="flex-1 min-w-64">
                            <input
                                type="text"
                                placeholder="Buscar por nome ou localização..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                        >
                            <Filter size={20} />
                            Filtros
                            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Filters Dropdown */}
                    {showFilters && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                    Faixa de Preço
                                </label>
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 10px center',
                                        backgroundSize: '20px',
                                        paddingRight: '40px'
                                    }}
                                >
                                    <option value="all" style={{ background: '#1a1a1a', color: 'white' }}>Todos os preços</option>
                                    <option value="budget" style={{ background: '#1a1a1a', color: 'white' }}>Até R$ 500</option>
                                    <option value="medium" style={{ background: '#1a1a1a', color: 'white' }}>R$ 500 - R$ 1.000</option>
                                    <option value="luxury" style={{ background: '#1a1a1a', color: 'white' }}>Acima de R$ 1.000</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                    Localização
                                </label>
                                <select
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 10px center',
                                        backgroundSize: '20px',
                                        paddingRight: '40px'
                                    }}
                                >
                                    <option value="all" style={{ background: '#1a1a1a', color: 'white' }}>Todas as localizações</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc} style={{ background: '#1a1a1a', color: 'white' }}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                    Número de Camas
                                </label>
                                <select
                                    value={bedsFilter}
                                    onChange={(e) => setBedsFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 10px center',
                                        backgroundSize: '20px',
                                        paddingRight: '40px'
                                    }}
                                >
                                    <option value="all" style={{ background: '#1a1a1a', color: 'white' }}>Todas as camas</option>
                                    <option value="1" style={{ background: '#1a1a1a', color: 'white' }}>1 cama</option>
                                    <option value="2" style={{ background: '#1a1a1a', color: 'white' }}>2 camas</option>
                                    <option value="3" style={{ background: '#1a1a1a', color: 'white' }}>3 ou mais camas</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                    Amenidades
                                </label>
                                <select
                                    value={amenitiesFilter}
                                    onChange={(e) => setAmenitiesFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 10px center',
                                        backgroundSize: '20px',
                                        paddingRight: '40px'
                                    }}
                                >
                                    <option value="all" style={{ background: '#1a1a1a', color: 'white' }}>Todas as amenidades</option>
                                    {allAmenities.map(amenity => (
                                        <option key={amenity} value={amenity} style={{ background: '#1a1a1a', color: 'white' }}>
                                            {amenity}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <div className="text-sm">
                                    <p className="text-gray-400 mb-1">Resultados</p>
                                    <p className="text-3xl font-bold text-amber-400">{filteredLodgings.length}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Accommodations Grid */}
                {filteredLodgings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLodgings.map(item => (
                        <div
                            key={item.id}
                            onClick={() => {
                                const normalized = { ...item, name: item.name || item.title }
                                setSelectedAccommodation(normalized)
                                setTimeout(() => {
                                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                }, 100)
                            }}
                            className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-amber-400 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                
                                {/* Rating */}
                                <div className="absolute bottom-3 left-3 bg-black/70 rounded-lg px-3 py-1 flex items-center gap-1">
                                    <Star size={16} className="text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-sm">{item.rating}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-amber-400 mb-2 group-hover:text-amber-300 transition-colors">
                                    {item.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                    <MapPin size={16} />
                                    {item.location}
                                </div>

                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                    {item.description}
                                </p>

                                {/* Specs */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                                        <Bed size={14} className="text-amber-400" />
                                        {item.beds}
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                                        <Bath size={14} className="text-amber-400" />
                                        {item.bathrooms}
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                                        <Users size={14} className="text-amber-400" />
                                        Até {item.maxGuests}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <DollarSign size={20} className="text-amber-400" />
                                        <span className="text-2xl font-bold">
                                            R$ {item.price.toLocaleString('pt-BR')}
                                        </span>
                                        <span className="text-gray-400 text-sm">/noite</span>
                                    </div>
                                    <button className="px-4 py-2 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-500 transition transform hover:scale-105">
                                        Reservar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                    <div className="text-center py-16">
                        <AlertCircle size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">
                            Nenhuma acomodação encontrada com os filtros selecionados.
                        </p>
                    </div>
                )}

                {filteredLodgings.length === 0 && (
                    <div className="mt-20 rounded-[2rem] bg-white/5 border border-white/10 p-12 text-center text-gray-300">
                        Nenhuma hospedagem encontrada com esses filtros. Tente outro local ou palavra-chave.
                    </div>
                )}
            </main>

            {/* Success Message */}
            {successMessage && (
                <div className="fixed top-20 right-4 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3 z-50 animate-pulse">
                    <Check size={24} className="text-green-400" />
                    <span className="text-green-100">{successMessage}</span>
                </div>
            )}

            {/* Modal de Reserva */}
            {selectedAccommodation && (
                <div ref={formRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
                            <h2 className="text-2xl font-black text-amber-400">
                                Reservar: {selectedAccommodation.name || selectedAccommodation.title}
                            </h2>
                            <button
                                onClick={() => setSelectedAccommodation(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Accommodation Info */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase mb-1">Localização</p>
                                        <p className="font-bold flex items-center gap-2">
                                            <MapPin size={16} className="text-amber-400" />
                                            {selectedAccommodation.location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase mb-1">Camas</p>
                                        <p className="font-bold flex items-center gap-2">
                                            <Bed size={16} className="text-amber-400" />
                                            {selectedAccommodation.beds}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase mb-1">Banheiros</p>
                                        <p className="font-bold flex items-center gap-2">
                                            <Bath size={16} className="text-amber-400" />
                                            {selectedAccommodation.bathrooms}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase mb-1">Max. Hóspedes</p>
                                        <p className="font-bold flex items-center gap-2">
                                            <Users size={16} className="text-amber-400" />
                                            {selectedAccommodation.maxGuests}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Amenities */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-gray-400 text-xs uppercase mb-2">Amenidades</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAccommodation.amenities.map((amenity, idx) => (
                                            <span key={idx} className="bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reservation Form */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Dados da Reserva</h3>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                            Data de Entrada
                                        </label>
                                        <DatePicker
                                            selected={reservationData.checkIn}
                                            onChange={(date) => setReservationData({...reservationData, checkIn: date})}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Selecione"
                                            minDate={new Date()}
                                            locale="pt-BR"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors"
                                        />
                                        {errors.checkIn && <p className="text-red-400 text-sm flex items-center gap-2 mt-1"><AlertCircle size={14} />{errors.checkIn}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                            Data de Saída
                                        </label>
                                        <DatePicker
                                            selected={reservationData.checkOut}
                                            onChange={(date) => setReservationData({...reservationData, checkOut: date})}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Selecione"
                                            minDate={reservationData.checkIn || new Date()}
                                            locale="pt-BR"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors"
                                        />
                                        {errors.checkOut && <p className="text-red-400 text-sm flex items-center gap-2 mt-1"><AlertCircle size={14} />{errors.checkOut}</p>}
                                    </div>
                                </div>

                                {/* Guests */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                        Número de Hóspedes
                                    </label>
                                    <select
                                        value={reservationData.guests}
                                        onChange={(e) => setReservationData({...reservationData, guests: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 10px center',
                                            backgroundSize: '20px',
                                            paddingRight: '40px'
                                        }}
                                    >
                                        {Array.from({length: selectedAccommodation.maxGuests}, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num} style={{ background: '#1a1a1a', color: 'white' }}>
                                                {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Special Requests */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                        Pedidos Especiais (Opcional)
                                    </label>
                                    <textarea
                                        value={reservationData.specialRequests}
                                        onChange={(e) => setReservationData({...reservationData, specialRequests: e.target.value})}
                                        placeholder="Ex: Quarto com vista, cama king, não fumo..."
                                        rows="3"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                                    />
                                </div>
                            </div>

                            {/* Price Summary */}
                            {nights > 0 && (
                                <div className="bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/50 rounded-xl p-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">R$ {selectedAccommodation.price.toLocaleString('pt-BR')} × {nights} {nights === 1 ? 'noite' : 'noites'}</span>
                                            <span className="font-bold">R$ {totalPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                                        </div>
                                        <div className="border-t border-amber-400/30 pt-2 flex justify-between text-lg font-bold text-amber-400">
                                            <span>Total:</span>
                                            <span>R$ {totalPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setSelectedAccommodation(null)}
                                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleReservation}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 uppercase tracking-wider"
                                >
                                    Confirmar Reserva
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Hospedagem;