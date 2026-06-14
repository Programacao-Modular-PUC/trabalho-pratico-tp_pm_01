import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
    AlertCircle,
    Bath,
    Bed,
    Check,
    ChevronDown,
    DollarSign,
    Filter,
    MapPin,
    Star,
    Users
} from 'lucide-react'
import Searchbar from '../components/searchbar'
import ReservationModal from '../components/ReservationModal'
import { api } from '../services/api'
import { buildAccommodation, ROOM_TYPE_OPTIONS } from '../services/auth'

const fallbackAccommodations = [
    {
        id: 'bangalo',
        title: 'Bangalo da Marau',
        name: 'Bangalo da Marau',
        location: 'Barra Grande',
        description: 'Bangalo com vista para o mar e amenidades de luxo.',
        price: 620,
        rating: '4.9',
        img: '/img/bangalo.jpg',
        beds: 1,
        bathrooms: 1,
        maxGuests: 2,
        amenities: ['WiFi', 'Ar condicionado', 'Varanda com vista']
    },
    {
        id: 'villa',
        title: 'Villa Pontal do Muta',
        name: 'Villa Pontal do Muta',
        location: 'Ponta do Muta',
        description: 'Casa ampla com deck, cozinha gourmet e servico local.',
        price: 1150,
        rating: '5.0',
        img: '/img/vila_pontal.jpg',
        beds: 3,
        bathrooms: 2,
        maxGuests: 6,
        amenities: ['WiFi Premium', 'Cozinha gourmet', 'Deck amplo']
    },
    {
        id: 'suite',
        title: 'Suite Roots',
        name: 'Suite Roots',
        location: 'Tres Coqueiros',
        description: 'Suite charmosa com decoracao rustica, ideal para casais.',
        price: 380,
        rating: '4.8',
        img: '/img/suite_roots.jpg',
        beds: 1,
        bathrooms: 1,
        maxGuests: 2,
        amenities: ['WiFi', 'Ar condicionado', 'Cafe da manha']
    }
]

function Hospedagem() {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()

    const [accommodations, setAccommodations] = useState(fallbackAccommodations)
    const [loading, setLoading] = useState(true)
    const [apiError, setApiError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [priceFilter, setPriceFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [bedsFilter, setBedsFilter] = useState('all')
    const [tipoFilter, setTipoFilter] = useState('all')
    const [amenitiesFilter, setAmenitiesFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedAccommodation, setSelectedAccommodation] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        let mounted = true
        setLoading(true)

        api.listQuartos(tipoFilter !== 'all' ? tipoFilter : undefined)
            .then((rooms) => {
                if (!mounted) return
                const mapped = rooms?.length ? rooms.map(buildAccommodation) : fallbackAccommodations
                setAccommodations(mapped)
                setApiError('')
            })
            .catch((error) => {
                if (!mounted) return
                setAccommodations(fallbackAccommodations)
                setApiError(error.message)
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [tipoFilter])

    const openReservation = (item) => {
        setSelectedAccommodation({ ...item, name: item.name || item.title })
    }

    useLayoutEffect(() => {
        const fromState = location.state?.selectedAccommodation
        const quartoParam = searchParams.get('quarto')

        if (fromState) {
            openReservation(fromState)
            navigate(location.pathname + location.search, { replace: true, state: null })
            return
        }

        if (!quartoParam || loading) return

        const found = accommodations.find(
            (item) => String(item.quartoId || item.id) === String(quartoParam)
        )
        if (found) {
            openReservation(found)
            setSearchParams({}, { replace: true })
        }
    }, [location.state, searchParams, accommodations, loading, location.pathname, location.search, navigate, setSearchParams])

    const filteredLodgings = useMemo(() => {
        return accommodations.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesPrice = priceFilter === 'all' ||
                (priceFilter === 'budget' && item.price < 500) ||
                (priceFilter === 'medium' && item.price >= 500 && item.price < 1000) ||
                (priceFilter === 'luxury' && item.price >= 1000)
            const matchesLocation = locationFilter === 'all' || item.location === locationFilter
            const matchesBeds = bedsFilter === 'all' ||
                (bedsFilter === '3' ? item.beds >= 3 : item.beds.toString() === bedsFilter)
            const matchesTipo = tipoFilter === 'all' || item.tipo === tipoFilter
            const matchesAmenities = amenitiesFilter === 'all' || item.amenities.includes(amenitiesFilter)

            return matchesSearch && matchesPrice && matchesLocation && matchesBeds && matchesTipo && matchesAmenities
        })
    }, [accommodations, amenitiesFilter, bedsFilter, locationFilter, priceFilter, searchTerm, tipoFilter])

    const locations = [...new Set(accommodations.map((item) => item.location))]
    const allAmenities = [...new Set(accommodations.flatMap((item) => item.amenities))]

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
                            Explore quartos individuais, duplos e familia com calculo real de diaria pelo backend.
                        </p>
                        <button
                            onClick={() => document.getElementById('acomodacoes')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-5 bg-amber-400 text-black font-black rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition active:scale-95"
                        >
                            Reserve agora
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative">
                        <div className="space-y-4 pt-12">
                            <img src="/img/praia_de_taipu_de_fora.jpg" className="rounded-[2.5rem] h-80 w-full object-cover border border-white/10 shadow-2xl" alt="Taipu de Fora" />
                            <img src="/img/praia_do_cassange.jpg" className="rounded-[2.5rem] h-56 w-full object-cover border border-white/10 shadow-2xl" alt="Cassange" />
                        </div>
                        <div className="space-y-4">
                            <img src="/img/praia-do-muta.jpg" className="rounded-[2.5rem] h-56 w-full object-cover border border-white/10 shadow-2xl" alt="Muta" />
                            <img src="/img/praia_de_tres_coqueiros.jpg" className="rounded-[2.5rem] h-80 w-full object-cover border border-white/10 shadow-2xl" alt="Tres Coqueiros" />
                        </div>
                    </div>
                </div>
            </header>

            <Searchbar />

            <main id="acomodacoes" className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter">Acomodacoes Disponiveis</h2>
                        <p className="text-gray-500 font-medium">Escolha uma acomodacao cadastrada e confirme a reserva como cliente.</p>
                    </div>
                    <span className="text-amber-400 font-black text-xs uppercase tracking-widest border-b-2 border-amber-400 pb-1">
                        {loading ? 'Carregando...' : `${filteredLodgings.length} resultado(s)`}
                    </span>
                </div>

                {apiError && (
                    <div className="mb-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                        Backend indisponivel agora. Mostrando exemplos locais.
                    </div>
                )}

                <div className="mb-8 space-y-4">
                    <div className="flex gap-4 items-center flex-wrap">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou localizacao..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 min-w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                        >
                            <Filter size={20} />
                            Filtros
                            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {showFilters && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 grid grid-cols-1 md:grid-cols-5 gap-4">
                            <FilterSelect label="Tipo de Quarto" value={tipoFilter} onChange={setTipoFilter} options={
                                ROOM_TYPE_OPTIONS.map(({ value, label }) => [value, label])
                            } />
                            <FilterSelect label="Faixa de Preco" value={priceFilter} onChange={setPriceFilter} options={[
                                ['all', 'Todos os precos'],
                                ['budget', 'Ate R$ 500'],
                                ['medium', 'R$ 500 - R$ 1.000'],
                                ['luxury', 'Acima de R$ 1.000']
                            ]} />
                            <FilterSelect label="Localizacao" value={locationFilter} onChange={setLocationFilter} options={[
                                ['all', 'Todas as localizacoes'],
                                ...locations.map((loc) => [loc, loc])
                            ]} />
                            <FilterSelect label="Numero de Camas" value={bedsFilter} onChange={setBedsFilter} options={[
                                ['all', 'Todas as camas'],
                                ['1', '1 cama'],
                                ['2', '2 camas'],
                                ['3', '3 ou mais camas']
                            ]} />
                            <FilterSelect label="Amenidades" value={amenitiesFilter} onChange={setAmenitiesFilter} options={[
                                ['all', 'Todas as amenidades'],
                                ...allAmenities.map((amenity) => [amenity, amenity])
                            ]} />
                        </div>
                    )}
                </div>

                {filteredLodgings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLodgings.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => openReservation(item)}
                                className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-amber-400 hover:bg-white/10 transition-all duration-300 text-left"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-3 bg-black/70 rounded-lg px-3 py-1 flex items-center gap-1">
                                        <Star size={16} className="text-amber-400 fill-amber-400" />
                                        <span className="font-bold text-sm">{item.rating}</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-amber-400 mb-2 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                        <MapPin size={16} />
                                        {item.location}
                                    </div>
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge icon={Bed}>{item.beds}</Badge>
                                        <Badge icon={Bath}>{item.bathrooms}</Badge>
                                        <Badge icon={Users}>Ate {item.maxGuests}</Badge>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <DollarSign size={20} className="text-amber-400" />
                                            <span className="text-2xl font-bold">R$ {item.price.toLocaleString('pt-BR')}</span>
                                            <span className="text-gray-400 text-sm">/noite</span>
                                        </div>
                                        <span className="px-4 py-2 bg-amber-400 text-black font-bold rounded-lg">Reservar</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <AlertCircle size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Nenhuma acomodacao encontrada com os filtros selecionados.</p>
                    </div>
                )}
            </main>

            {successMessage && (
                <div className="fixed top-20 right-4 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3 z-50">
                    <Check size={24} className="text-green-400" />
                    <span className="text-green-100">{successMessage}</span>
                </div>
            )}

            {selectedAccommodation && (
                <ReservationModal
                    accommodation={selectedAccommodation}
                    onClose={() => setSelectedAccommodation(null)}
                    onSuccess={(reserva) => {
                        const total = Number(reserva.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                        setSuccessMessage(`Reserva confirmada. Total: R$ ${total}`)
                    }}
                />
            )}
        </div>
    )
}

function FilterSelect({ label, value, onChange, options }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors"
            >
                {options.map(([optionValue, optionLabel]) => (
                    <option key={optionValue} value={optionValue} style={{ background: '#1a1a1a', color: 'white' }}>
                        {optionLabel}
                    </option>
                ))}
            </select>
        </div>
    )
}

function Badge({ icon: Icon, children }) {
    return (
        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
            <Icon size={14} className="text-amber-400" />
            {children}
        </div>
    )
}

export default Hospedagem
