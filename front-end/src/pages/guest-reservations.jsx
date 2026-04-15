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
    Phone,
    Mail,
    AlertCircle,
    Star,
    Filter,
    ChevronDown,
    Wifi,
    Coffee,
    Tv,
    Music
} from 'lucide-react'

registerLocale('pt-BR', ptBR)

function GuestReservations() {
    const navigate = useNavigate()
    const location = useLocation()
    const formRef = useRef(null)
    const [selectedAccommodation, setSelectedAccommodation] = useState(null)
    const [preSelected, setPreSelected] = useState(false)
    const [reservationData, setReservationData] = useState({
        name: '',
        email: '',
        phone: '',
        checkIn: null,
        checkOut: null,
        guests: '1',
        specialRequests: ''
    })
    const [successMessage, setSuccessMessage] = useState('')
    const [errors, setErrors] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [priceFilter, setPriceFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [bedsFilter, setBedsFilter] = useState('all')
    const [amenitiesFilter, setAmenitiesFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    // Ler o hotel pré-selecionado vindo da tela de hospedagem
    useEffect(() => {
        if (location.state?.selectedAccommodation) {
            const incoming = location.state.selectedAccommodation
            // Garantir que o objeto tem o campo 'name' (acommodations.jsx usa 'title')
            const normalized = { ...incoming, name: incoming.name || incoming.title }
            setSelectedAccommodation(normalized)
            setPreSelected(true)
            // Scroll suave até o formulário de reserva após um breve delay
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
        }
    }, [location.state])

    const accommodations = [
        {
            id: 1,
            name: 'Bangalô da Maraú',
            location: 'Barra Grande',
            description: 'Bangalô com piscina privativa, vista para o mar e amenidades de luxo.',
            price: 620,
            rating: 4.9,
            img: '/img/praia_de_algodoes.jpg',
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            amenities: ['WiFi', 'Piscina privativa', 'TV 4K', 'Ar condicionado', 'Varanda com vista']
        },
        {
            id: 2,
            name: 'Villa Pontal do Mutá',
            location: 'Ponta do Mutá',
            description: 'Casa ampla com deck, cozinha gourmet e serviço de concierge local.',
            price: 1150,
            rating: 5.0,
            img: '/img/praia-do-muta.jpg',
            beds: 3,
            bathrooms: 2,
            maxGuests: 6,
            amenities: ['WiFi Premium', 'Cozinha gourmet', 'Deck amplo', 'Concierge 24h', 'Frigobar']
        },
        {
            id: 3,
            name: 'Suíte Roots',
            location: 'Três Coqueiros',
            description: 'Suíte charmosa com decoração rústica, ideal para casais.',
            price: 380,
            rating: 4.7,
            img: '/img/praia_de_tres_coqueiros.jpg',
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            amenities: ['WiFi', 'Ar condicionado', 'Decoração rústica', 'Café da manhã', 'Varanda']
        },
        {
            id: 4,
            name: 'Refúgio do Cassange',
            location: 'Cassange',
            description: 'Refúgio exclusivo junto à lagoa, perfeito para relaxar em família.',
            price: 540,
            rating: 4.8,
            img: '/img/praia_do_cassange.jpg',
            beds: 2,
            bathrooms: 1,
            maxGuests: 4,
            amenities: ['WiFi', 'Vista para lagoa', 'Ar condicionado', 'Área de estar', 'Kitchenette']
        },
        {
            id: 5,
            name: 'Pousada Trilha do Sol',
            location: 'Barra Grande',
            description: 'Pousada com piscina ao ar livre, café da manhã regional e atmosfera acolhedora.',
            price: 460,
            rating: 4.8,
            img: '/img/praia_barra_grande.jpg',
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            amenities: ['WiFi', 'Piscina', 'Café da manhã', 'Restaurante', 'Bar']
        },
        {
            id: 6,
            name: 'Casa do Farol',
            location: 'Pontal do Mutá',
            description: 'Casa de temporada com vista panorâmica, varanda espaçosa e acesso à praia.',
            price: 980,
            rating: 4.9,
            img: '/img/praia-do-muta.jpg',
            beds: 2,
            bathrooms: 2,
            maxGuests: 4,
            amenities: ['WiFi', 'Vista panorâmica', 'Varanda espaçosa', 'Acesso à praia', 'Ar condicionado']
        }
    ]

    // Filtrar acomodações
    const filteredAccommodations = accommodations.filter(acc => {
        const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            acc.location.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesPrice = priceFilter === 'all' ||
                           (priceFilter === 'budget' && acc.price < 500) ||
                           (priceFilter === 'medium' && acc.price >= 500 && acc.price < 1000) ||
                           (priceFilter === 'luxury' && acc.price >= 1000)
        
        const matchesLocation = locationFilter === 'all' || acc.location === locationFilter
        
        const matchesBeds = bedsFilter === 'all' || acc.beds.toString() === bedsFilter
        
        const matchesAmenities = amenitiesFilter === 'all' || acc.amenities.includes(amenitiesFilter)
        
        return matchesSearch && matchesPrice && matchesLocation && matchesBeds && matchesAmenities
    })

    const locations = [...new Set(accommodations.map(acc => acc.location))]
    const allAmenities = [...new Set(accommodations.flatMap(acc => acc.amenities))]

    const validateReservation = () => {
        const newErrors = {}
        // Validar apenas datas se ambas forem preenchidas
        if (reservationData.checkIn && reservationData.checkOut && reservationData.checkIn >= reservationData.checkOut) {
            newErrors.checkOut = 'Data de saída deve ser após a entrada'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleReservation = () => {
        if (!validateReservation()) return
        
        // Redirecionar para login - simulando que precisa estar logado
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
            {/* Hero Section */}
            <div className="relative h-80 bg-gradient-to-b from-amber-400/20 via-amber-400/10 to-transparent overflow-hidden pt-20">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(255,193,7)_1px,_transparent_1px)] bg-[size:40px_40px]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-8 h-full flex items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar size={32} className="text-amber-400" />
                            <h1 className="text-5xl font-black tracking-tight">
                                Faça sua <span className="text-amber-400">Reserva</span>
                            </h1>
                        </div>
                        <p className="text-xl text-gray-300 max-w-2xl">
                            Escolha a hospedagem perfeita em Maraú e reserve suas próximas férias.
                        </p>
                        {preSelected && selectedAccommodation && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/50 rounded-full px-4 py-2 text-amber-300 text-sm font-semibold">
                                <Check size={16} />
                                Hospedagem selecionada: <span className="font-black text-amber-400">{selectedAccommodation.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="fixed top-20 right-4 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3 z-50 animate-pulse">
                    <Check size={24} className="text-green-400" />
                    <span className="text-green-100">{successMessage}</span>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-16">
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
                            {/* Price Filter */}
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

                            {/* Location Filter */}
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
                                    {locations.map(location => (
                                        <option key={location} value={location} style={{ background: '#1a1a1a', color: 'white' }}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Beds Filter */}
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

                            {/* Amenities Filter */}
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

                            {/* Results Count */}
                            <div className="flex items-end">
                                <div className="text-sm">
                                    <p className="text-gray-400 mb-1">Resultados</p>
                                    <p className="text-3xl font-bold text-amber-400">{filteredAccommodations.length}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Accommodations Grid */}
                {filteredAccommodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAccommodations.map(accommodation => (
                        <div
                            key={accommodation.id}
                            onClick={() => setSelectedAccommodation(accommodation)}
                            className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-amber-400 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={accommodation.img}
                                    alt={accommodation.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                
                                {/* Rating */}
                                <div className="absolute bottom-3 left-3 bg-black/70 rounded-lg px-3 py-1 flex items-center gap-1">
                                    <Star size={16} className="text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-sm">{accommodation.rating}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-amber-400 mb-2 group-hover:text-amber-300 transition-colors">
                                    {accommodation.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                    <MapPin size={16} />
                                    {accommodation.location}
                                </div>

                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                    {accommodation.description}
                                </p>

                                {/* Specs */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                                        <Bed size={14} className="text-amber-400" />
                                        {accommodation.beds}
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                                        <Bath size={14} className="text-amber-400" />
                                        {accommodation.bathrooms}
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                                        <Users size={14} className="text-amber-400" />
                                        Até {accommodation.maxGuests}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <DollarSign size={20} className="text-amber-400" />
                                        <span className="text-2xl font-bold">
                                            R$ {accommodation.price.toLocaleString('pt-BR')}
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
            </div>

            {/* Modal de Reserva */}
            {selectedAccommodation && (
                <div ref={formRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
                            <h2 className="text-2xl font-black text-amber-400">
                                Reservar: {selectedAccommodation.name}
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

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={reservationData.name}
                                        onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
                                        placeholder="Seu nome"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
                                    />
                                    {errors.name && <p className="text-red-400 text-sm flex items-center gap-2 mt-1"><AlertCircle size={14} />{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                        Email
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-lg">
                                        <Mail size={20} className="text-amber-400" />
                                        <input
                                            type="email"
                                            value={reservationData.email}
                                            onChange={(e) => setReservationData({...reservationData, email: e.target.value})}
                                            placeholder="seu.email@exemplo.com"
                                            className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-sm flex items-center gap-2 mt-1"><AlertCircle size={14} />{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                        Telefone
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-lg">
                                        <Phone size={20} className="text-amber-400" />
                                        <input
                                            type="tel"
                                            value={reservationData.phone}
                                            onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
                                            placeholder="(71) 9999-9999"
                                            className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-400 text-sm flex items-center gap-2 mt-1"><AlertCircle size={14} />{errors.phone}</p>}
                                </div>

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
                                        placeholder="Ex: Celular com vista, cama king, não fumo..."
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

export default GuestReservations
