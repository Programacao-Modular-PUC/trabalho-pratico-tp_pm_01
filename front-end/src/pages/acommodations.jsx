import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
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
    Users,
    X
} from 'lucide-react'
import Searchbar from '../components/searchbar'
import { api } from '../services/api'
import { buildAccommodation, getLoggedCliente } from '../services/auth'

registerLocale('pt-BR', ptBR)

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

function formatApiDateTime(date, hour) {
    const d = new Date(date)
    d.setHours(hour, 0, 0, 0)
    const pad = (value) => String(value).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00:00`
}

function tomorrow() {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    date.setHours(0, 0, 0, 0)
    return date
}

function Hospedagem() {
    const navigate = useNavigate()
    const location = useLocation()
    const formRef = useRef(null)

    const [accommodations, setAccommodations] = useState(fallbackAccommodations)
    const [loading, setLoading] = useState(true)
    const [apiError, setApiError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [priceFilter, setPriceFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [bedsFilter, setBedsFilter] = useState('all')
    const [amenitiesFilter, setAmenitiesFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedAccommodation, setSelectedAccommodation] = useState(null)
    const [reservationData, setReservationData] = useState({
        checkIn: null,
        checkOut: null,
        guests: '1',
        specialRequests: '',
        cribRequested: false
    })
    const [successMessage, setSuccessMessage] = useState('')
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        let mounted = true
        setLoading(true)

        api.listQuartos()
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
    }, [])

    useEffect(() => {
        if (location.state?.selectedAccommodation) {
            const incoming = location.state.selectedAccommodation
            setSelectedAccommodation({ ...incoming, name: incoming.name || incoming.title })
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
        }
    }, [location.state])

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
            const matchesAmenities = amenitiesFilter === 'all' || item.amenities.includes(amenitiesFilter)

            return matchesSearch && matchesPrice && matchesLocation && matchesBeds && matchesAmenities
        })
    }, [accommodations, amenitiesFilter, bedsFilter, locationFilter, priceFilter, searchTerm])

    const locations = [...new Set(accommodations.map((item) => item.location))]
    const allAmenities = [...new Set(accommodations.flatMap((item) => item.amenities))]

    const validateReservation = () => {
        const newErrors = {}
        if (!reservationData.checkIn) newErrors.checkIn = 'Informe a data de entrada'
        if (!reservationData.checkOut) newErrors.checkOut = 'Informe a data de saida'
        if (reservationData.checkIn && reservationData.checkOut && reservationData.checkIn >= reservationData.checkOut) {
            newErrors.checkOut = 'Data de saida deve ser apos a entrada'
        }
        if (Number(reservationData.guests) > Number(selectedAccommodation?.maxGuests || 1)) {
            newErrors.guests = 'Quantidade de hospedes acima da capacidade'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleReservation = async () => {
        if (!validateReservation()) return

        const cliente = getLoggedCliente()
        if (!cliente?.id) {
            setSuccessMessage('Entre como cliente para confirmar sua reserva.')
            setTimeout(() => navigate('/login'), 600)
            return
        }

        if (!selectedAccommodation?.quartoId || !selectedAccommodation?.residenciaId) {
            setErrors({ submit: 'Essa acomodacao ainda nao esta ligada ao backend.' })
            return
        }

        setSubmitting(true)
        setErrors({})
        try {
            const reserva = await api.createAluguel({
                residenciaId: selectedAccommodation.residenciaId,
                quartoId: selectedAccommodation.quartoId,
                clienteId: cliente.id,
                dataEntrada: formatApiDateTime(reservationData.checkIn, 14),
                dataSaida: formatApiDateTime(reservationData.checkOut, 12),
                quantidadeHospedes: Number(reservationData.guests),
                bercoSolicitado: Boolean(reservationData.cribRequested && selectedAccommodation.allowsCrib)
            })

            const total = Number(reserva.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
            setSuccessMessage(`Reserva confirmada. Total: R$ ${total}`)
            setSelectedAccommodation(null)
            setReservationData({
                checkIn: null,
                checkOut: null,
                guests: '1',
                specialRequests: '',
                cribRequested: false
            })
        } catch (error) {
            setErrors({ submit: error.message })
        } finally {
            setSubmitting(false)
        }
    }

    const nights = selectedAccommodation && reservationData.checkIn && reservationData.checkOut
        ? Math.ceil((reservationData.checkOut - reservationData.checkIn) / (1000 * 60 * 60 * 24))
        : 0
    const estimatedCribFee = selectedAccommodation?.allowsCrib && reservationData.cribRequested ? 35 : 0
    const totalPrice = selectedAccommodation ? (selectedAccommodation.price + estimatedCribFee) * nights : 0

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
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                onClick={() => {
                                    setSelectedAccommodation({ ...item, name: item.name || item.title })
                                    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
                                }}
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
                <div ref={formRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
                            <h2 className="text-2xl font-black text-amber-400">Reservar: {selectedAccommodation.name || selectedAccommodation.title}</h2>
                            <button onClick={() => setSelectedAccommodation(null)} className="p-2 hover:bg-white/10 rounded-lg transition">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Info label="Localizacao" icon={MapPin}>{selectedAccommodation.location}</Info>
                                    <Info label="Camas" icon={Bed}>{selectedAccommodation.beds}</Info>
                                    <Info label="Banheiros" icon={Bath}>{selectedAccommodation.bathrooms}</Info>
                                    <Info label="Max. Hospedes" icon={Users}>{selectedAccommodation.maxGuests}</Info>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-gray-400 text-xs uppercase mb-2">Amenidades</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAccommodation.amenities.map((amenity) => (
                                            <span key={amenity} className="bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">{amenity}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Dados da Reserva</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <DateField
                                        label="Data de Entrada"
                                        selected={reservationData.checkIn}
                                        onChange={(date) => setReservationData({ ...reservationData, checkIn: date })}
                                        minDate={tomorrow()}
                                        error={errors.checkIn}
                                    />
                                    <DateField
                                        label="Data de Saida"
                                        selected={reservationData.checkOut}
                                        onChange={(date) => setReservationData({ ...reservationData, checkOut: date })}
                                        minDate={reservationData.checkIn || tomorrow()}
                                        error={errors.checkOut}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">Numero de Hospedes</label>
                                    <select
                                        value={reservationData.guests}
                                        onChange={(e) => setReservationData({ ...reservationData, guests: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors"
                                    >
                                        {Array.from({ length: selectedAccommodation.maxGuests }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num} style={{ background: '#1a1a1a', color: 'white' }}>
                                                {num} {num === 1 ? 'hospede' : 'hospedes'}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.guests && <p className="text-red-400 text-sm flex items-center gap-2 mt-1"><AlertCircle size={14} />{errors.guests}</p>}
                                </div>

                                {selectedAccommodation.allowsCrib && (
                                    <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                                        <span>
                                            <span className="block font-bold text-white">Solicitar berco</span>
                                            <span className="text-sm text-gray-400">O backend aplica a taxa extra na diaria.</span>
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={reservationData.cribRequested}
                                            onChange={(e) => setReservationData({ ...reservationData, cribRequested: e.target.checked })}
                                            className="h-5 w-5 accent-amber-400"
                                        />
                                    </label>
                                )}

                                <textarea
                                    value={reservationData.specialRequests}
                                    onChange={(e) => setReservationData({ ...reservationData, specialRequests: e.target.value })}
                                    placeholder="Pedidos especiais, se houver"
                                    rows="3"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                                />
                            </div>

                            {nights > 0 && (
                                <div className="bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/50 rounded-xl p-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Estimativa para {nights} {nights === 1 ? 'noite' : 'noites'}</span>
                                            <span className="font-bold">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <p className="text-xs text-amber-100/80">O total final vem da regra de diaria do Spring Boot.</p>
                                    </div>
                                </div>
                            )}

                            {errors.submit && (
                                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{errors.submit}</div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setSelectedAccommodation(null)} className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors font-semibold">
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleReservation}
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold rounded-lg transition-all duration-300 disabled:opacity-60 uppercase tracking-wider"
                                >
                                    {submitting ? 'Confirmando...' : 'Confirmar Reserva'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

function Info({ label, icon: Icon, children }) {
    return (
        <div>
            <p className="text-gray-400 text-xs uppercase mb-1">{label}</p>
            <p className="font-bold flex items-center gap-2">
                <Icon size={16} className="text-amber-400" />
                {children}
            </p>
        </div>
    )
}

function DateField({ label, selected, onChange, minDate, error }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">{label}</label>
            <DatePicker
                selected={selected}
                onChange={onChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione"
                minDate={minDate}
                locale="pt-BR"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 transition-colors"
            />
            {error && <p className="text-red-400 text-sm flex items-center gap-2 mt-1"><AlertCircle size={14} />{error}</p>}
        </div>
    )
}

export default Hospedagem
