import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Filter, ChevronDown, Bed, Bath, Users, DollarSign } from 'lucide-react'

function Dashboard() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [priceFilter, setPriceFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [bedsFilter, setBedsFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

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
            rating: '4.7',
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
            img: '/img/praia-do-muta.jpg',
            beds: 2,
            bathrooms: 2,
            maxGuests: 4,
            amenities: ['WiFi', 'Vista panorâmica', 'Varanda espaçosa', 'Acesso à praia', 'Ar condicionado']
        }
    ]

    const filteredAccommodations = accommodations.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesPrice = priceFilter === 'all' ||
            (priceFilter === 'budget' && item.price < 500) ||
            (priceFilter === 'medium' && item.price >= 500 && item.price < 1000) ||
            (priceFilter === 'luxury' && item.price >= 1000)
        
        const matchesLocation = locationFilter === 'all' || item.location === locationFilter
        const matchesBeds = bedsFilter === 'all' || item.beds.toString() === bedsFilter
        
        return matchesSearch && matchesPrice && matchesLocation && matchesBeds
    })

    const locations = [...new Set(accommodations.map(item => item.location))]

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8 rounded-3xl bg-slate-950/80 border border-slate-700/50 p-8 shadow-xl shadow-slate-950/10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Explorar</p>
                        <h1 className="mt-3 text-3xl font-black text-white">Encontre sua próxima estadia</h1>
                        <p className="mt-2 max-w-2xl text-slate-400">Explore acomodações cuidadosamente selecionadas em Maraú.</p>
                    </div>
                    <button 
                        onClick={() => getElementById('results-count').scrollIntoView({ behavior: 'smooth' })}
                        className="rounded-3xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                    >
                        Ver todas as ofertas
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 rounded-2xl bg-slate-900/60 border border-slate-700/50 p-4">
                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 min-w-64 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou localização..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                    >
                        <Filter size={20} />
                        Filtros
                        <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters Dropdown */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                Faixa de Preço
                            </label>
                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 10px center',
                                    backgroundSize: '20px',
                                    paddingRight: '40px'
                                }}
                            >
                                <option value="all" style={{ background: '#1e293b' }}>Todos os preços</option>
                                <option value="budget" style={{ background: '#1e293b' }}>Até R$ 500</option>
                                <option value="medium" style={{ background: '#1e293b' }}>R$ 500 - R$ 1.000</option>
                                <option value="luxury" style={{ background: '#1e293b' }}>Acima de R$ 1.000</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                Localização
                            </label>
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 10px center',
                                    backgroundSize: '20px',
                                    paddingRight: '40px'
                                }}
                            >
                                <option value="all" style={{ background: '#1e293b' }}>Todas as localizações</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc} style={{ background: '#1e293b' }}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
                                Camas
                            </label>
                            <select
                                value={bedsFilter}
                                onChange={(e) => setBedsFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 10px center',
                                    backgroundSize: '20px',
                                    paddingRight: '40px'
                                }}
                            >
                                <option value="all" style={{ background: '#1e293b' }}>Todas</option>
                                <option value="1" style={{ background: '#1e293b' }}>1 cama</option>
                                <option value="2" style={{ background: '#1e293b' }}>2 camas</option>
                                <option value="3" style={{ background: '#1e293b' }}>3+ camas</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div id="results-count" className="mb-4 flex items-center justify-between">
                <p className="text-slate-400">
                    <span className="text-amber-400 font-bold">{filteredAccommodations.length}</span> acomodações encontradas
                </p>
            </div>

            {/* Accommodations Grid */}
            {filteredAccommodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAccommodations.map(item => (
                        <div
                            key={item.id}
                            onClick={() => navigate('/hospedagem', { state: { selectedAccommodation: item } })}
                            className="group rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/60 hover:border-amber-400/50 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                
                                {/* Rating */}
                                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-sm text-white">{item.rating}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                                    {item.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                                    <MapPin size={14} />
                                    {item.location}
                                </div>

                                <p className="text-slate-400 text-sm mt-3 line-clamp-2">
                                    {item.description}
                                </p>

                                {/* Specs */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded text-xs text-slate-300">
                                        <Bed size={12} className="text-amber-400" />
                                        {item.beds}
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded text-xs text-slate-300">
                                        <Bath size={12} className="text-amber-400" />
                                        {item.bathrooms}
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded text-xs text-slate-300">
                                        <Users size={12} className="text-amber-400" />
                                        {item.maxGuests}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <DollarSign size={18} className="text-amber-400" />
                                        <span className="text-xl font-bold text-white">
                                            R$ {item.price.toLocaleString('pt-BR')}
                                        </span>
                                        <span className="text-slate-400 text-sm">/noite</span>
                                    </div>
                                    <button className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg text-sm hover:bg-amber-400 transition">
                                        Ver
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-slate-700/50">
                    <p className="text-slate-400 text-lg">Nenhuma acomodação encontrada com os filtros selecionados.</p>
                </div>
            )}
        </div>
    )
}

export default Dashboard
