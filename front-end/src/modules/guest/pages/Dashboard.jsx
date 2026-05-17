import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Filter, ChevronDown, Bed, Bath, Users, DollarSign, AlertCircle } from 'lucide-react'
import { api } from '../../../services/api'
import { buildAccommodation } from '../../../services/auth'

function Dashboard() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [priceFilter, setPriceFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [bedsFilter, setBedsFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [accommodations, setAccommodations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadAccommodations() {
            setLoading(true)
            setError('')
            try {
                const rooms = await api.listQuartos()
                setAccommodations(rooms.map(buildAccommodation))
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadAccommodations()
    }, [])

    const filteredAccommodations = accommodations.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesPrice = priceFilter === 'all' ||
            (priceFilter === 'budget' && item.price < 500) ||
            (priceFilter === 'medium' && item.price >= 500 && item.price < 1000) ||
            (priceFilter === 'luxury' && item.price >= 1000)

        const matchesLocation = locationFilter === 'all' || item.location === locationFilter
        const matchesBeds = bedsFilter === 'all' ||
            (bedsFilter === '3' ? item.beds >= 3 : item.beds.toString() === bedsFilter)

        return matchesSearch && matchesPrice && matchesLocation && matchesBeds
    })

    const locations = useMemo(() => [...new Set(accommodations.map(item => item.location))], [accommodations])

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl bg-slate-950/80 border border-slate-700/50 p-8 shadow-xl shadow-slate-950/10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Explorar</p>
                        <h1 className="mt-3 text-3xl font-black text-white">Encontre sua proxima estadia</h1>
                        <p className="mt-2 max-w-2xl text-slate-400">Quartos carregados diretamente da API.</p>
                    </div>
                    <button
                        onClick={() => document.getElementById('results-count')?.scrollIntoView({ behavior: 'smooth' })}
                        className="rounded-3xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                    >
                        Ver ofertas
                    </button>
                </div>
            </div>

            {error && <Feedback text={error} />}

            <div className="mb-6 rounded-2xl bg-slate-900/60 border border-slate-700/50 p-4">
                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 min-w-64 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por quarto ou localizacao..."
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

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FilterSelect label="Faixa de Preco" value={priceFilter} onChange={setPriceFilter}>
                            <option value="all">Todos os precos</option>
                            <option value="budget">Ate R$ 500</option>
                            <option value="medium">R$ 500 - R$ 1.000</option>
                            <option value="luxury">Acima de R$ 1.000</option>
                        </FilterSelect>
                        <FilterSelect label="Localizacao" value={locationFilter} onChange={setLocationFilter}>
                            <option value="all">Todas</option>
                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </FilterSelect>
                        <FilterSelect label="Camas" value={bedsFilter} onChange={setBedsFilter}>
                            <option value="all">Todas</option>
                            <option value="1">1 cama</option>
                            <option value="2">2 camas</option>
                            <option value="3">3+ camas</option>
                        </FilterSelect>
                    </div>
                )}
            </div>

            <div id="results-count" className="mb-4">
                <p className="text-slate-400">
                    <span className="text-amber-400 font-bold">{filteredAccommodations.length}</span> acomodacoes encontradas
                </p>
            </div>

            {loading ? (
                <EmptyState text="Carregando acomodacoes..." />
            ) : filteredAccommodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAccommodations.map(item => (
                        <AccommodationCard key={item.id} item={item} onClick={() => navigate('/hospedagem', { state: { selectedAccommodation: item } })} />
                    ))}
                </div>
            ) : (
                <EmptyState text="Nenhum quarto disponivel com os filtros selecionados." />
            )}
        </div>
    )
}

function AccommodationCard({ item, onClick }) {
    return (
        <div onClick={onClick} className="group rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/60 hover:border-amber-400/50 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer">
            <div className="relative h-48 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold text-sm text-white">{item.rating}</span>
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{item.title}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mt-2"><MapPin size={14} />{item.location}</div>
                <p className="text-slate-400 text-sm mt-3 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                    <Spec icon={<Bed size={12} />} value={item.beds} />
                    <Spec icon={<Bath size={12} />} value={item.bathrooms} />
                    <Spec icon={<Users size={12} />} value={item.maxGuests} />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <DollarSign size={18} className="text-amber-400" />
                        <span className="text-xl font-bold text-white">R$ {item.price.toLocaleString('pt-BR')}</span>
                        <span className="text-slate-400 text-sm">/noite</span>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg text-sm hover:bg-amber-400 transition">Ver</button>
                </div>
            </div>
        </div>
    )
}

function Spec({ icon, value }) {
    return <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded text-xs text-slate-300"><span className="text-amber-400">{icon}</span>{value}</div>
}

function FilterSelect({ label, value, onChange, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors">
                {children}
            </select>
        </div>
    )
}

function Feedback({ text }) {
    return <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 flex gap-3"><AlertCircle />{text}</div>
}

function EmptyState({ text }) {
    return <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-slate-700/50 text-slate-400">{text}</div>
}

export default Dashboard
