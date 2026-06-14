import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import { AlertCircle, Bath, Bed, MapPin, Users, X } from 'lucide-react'
import { api } from '../services/api'
import { getLoggedCliente } from '../services/auth'

registerLocale('pt-BR', ptBR)

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

function ReservationModal({ accommodation, onClose, onSuccess }) {
    const navigate = useNavigate()
    const [reservationData, setReservationData] = useState({
        checkIn: null,
        checkOut: null,
        guests: '1',
        specialRequests: '',
        cribRequested: false
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    if (!accommodation) return null

    const validateReservation = () => {
        const newErrors = {}
        if (!reservationData.checkIn) newErrors.checkIn = 'Informe a data de entrada'
        if (!reservationData.checkOut) newErrors.checkOut = 'Informe a data de saida'
        if (reservationData.checkIn && reservationData.checkOut && reservationData.checkIn >= reservationData.checkOut) {
            newErrors.checkOut = 'Data de saida deve ser apos a entrada'
        }
        if (Number(reservationData.guests) > Number(accommodation.maxGuests || 1)) {
            newErrors.guests = 'Quantidade de hospedes acima da capacidade'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleReservation = async () => {
        if (!validateReservation()) return

        const cliente = getLoggedCliente()
        if (!cliente?.id) {
            navigate('/login')
            return
        }

        if (!accommodation.quartoId || !accommodation.residenciaId) {
            setErrors({ submit: 'Essa acomodacao ainda nao esta ligada ao backend.' })
            return
        }

        setSubmitting(true)
        setErrors({})
        try {
            const reserva = await api.createAluguel({
                residenciaId: accommodation.residenciaId,
                quartoId: accommodation.quartoId,
                clienteId: cliente.id,
                dataEntrada: formatApiDateTime(reservationData.checkIn, 14),
                dataSaida: formatApiDateTime(reservationData.checkOut, 12),
                quantidadeHospedes: Number(reservationData.guests),
                bercoSolicitado: Boolean(reservationData.cribRequested && accommodation.allowsCrib)
            })

            onSuccess?.(reserva)
            onClose()
        } catch (error) {
            setErrors({ submit: error.message })
        } finally {
            setSubmitting(false)
        }
    }

    const nights = reservationData.checkIn && reservationData.checkOut
        ? Math.ceil((reservationData.checkOut - reservationData.checkIn) / (1000 * 60 * 60 * 24))
        : 0
    const estimatedCribFee = accommodation.allowsCrib && reservationData.cribRequested ? 35 : 0
    const totalPrice = (accommodation.price + estimatedCribFee) * nights

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0a0a]">
                <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 p-6 backdrop-blur">
                    <h2 className="text-2xl font-black text-amber-400">
                        Reservar: {accommodation.name || accommodation.title}
                    </h2>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 transition hover:bg-white/10">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <Info label="Localizacao" icon={MapPin}>{accommodation.location}</Info>
                            <Info label="Camas" icon={Bed}>{accommodation.beds}</Info>
                            <Info label="Banheiros" icon={Bath}>{accommodation.bathrooms}</Info>
                            <Info label="Max. Hospedes" icon={Users}>{accommodation.maxGuests}</Info>
                        </div>
                        {accommodation.amenities?.length > 0 && (
                            <div className="mt-4 border-t border-white/10 pt-4">
                                <p className="mb-2 text-xs uppercase text-gray-400">Amenidades</p>
                                <div className="flex flex-wrap gap-2">
                                    {accommodation.amenities.map((amenity) => (
                                        <span key={amenity} className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-medium text-amber-300">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
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
                            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-amber-400">
                                Numero de Hospedes
                            </label>
                            <select
                                value={reservationData.guests}
                                onChange={(e) => setReservationData({ ...reservationData, guests: e.target.value })}
                                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                            >
                                {Array.from({ length: accommodation.maxGuests }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num} style={{ background: '#1a1a1a', color: 'white' }}>
                                        {num} {num === 1 ? 'hospede' : 'hospedes'}
                                    </option>
                                ))}
                            </select>
                            {errors.guests && (
                                <p className="mt-1 flex items-center gap-2 text-sm text-red-400">
                                    <AlertCircle size={14} />{errors.guests}
                                </p>
                            )}
                        </div>

                        {accommodation.allowsCrib && (
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
                    </div>

                    {nights > 0 && (
                        <div className="rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-400/20 to-amber-500/20 p-4">
                            <div className="flex justify-between">
                                <span className="text-gray-300">
                                    Estimativa para {nights} {nights === 1 ? 'noite' : 'noites'}
                                </span>
                                <span className="font-bold">
                                    R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    )}

                    {errors.submit && (
                        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
                        >
                            Fechar
                        </button>
                        <button
                            type="button"
                            onClick={handleReservation}
                            disabled={submitting}
                            className="flex-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 font-bold uppercase tracking-wider text-black transition disabled:opacity-60"
                        >
                            {submitting ? 'Confirmando...' : 'Confirmar Reserva'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Info({ label, icon: Icon, children }) {
    return (
        <div>
            <p className="mb-1 text-xs uppercase text-gray-400">{label}</p>
            <p className="flex items-center gap-2 font-bold">
                <Icon size={16} className="text-amber-400" />
                {children}
            </p>
        </div>
    )
}

function DateField({ label, selected, onChange, minDate, error }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-amber-400">{label}</label>
            <DatePicker
                selected={selected}
                onChange={onChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione"
                minDate={minDate}
                locale="pt-BR"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
            />
            {error && (
                <p className="mt-1 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle size={14} />{error}
                </p>
            )}
        </div>
    )
}

export default ReservationModal
