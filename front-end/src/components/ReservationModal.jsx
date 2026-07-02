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

function ReservationModal({ accommodation, onClose, onSuccess, initialSearch }) {
    const navigate = useNavigate()
    const [reservationData, setReservationData] = useState({
        checkIn: initialSearch?.checkIn || null,
        checkOut: initialSearch?.checkOut || null,
        guests: String(initialSearch?.guests || '1'),
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

    useEffect(() => {
        if (!initialSearch) return
        setReservationData((current) => ({
            ...current,
            checkIn: initialSearch.checkIn || current.checkIn,
            checkOut: initialSearch.checkOut || current.checkOut,
            guests: String(initialSearch.guests || current.guests)
        }))
    }, [initialSearch])

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white/95 p-6 backdrop-blur">
                    <h2 className="text-2xl font-black text-slate-900">
                        Reservar: <span className="text-amber-600">{accommodation.name || accommodation.title}</span>
                    </h2>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <Info label="Localizacao" icon={MapPin}>{accommodation.location}</Info>
                            <Info label="Camas" icon={Bed}>{accommodation.beds}</Info>
                            <Info label="Banheiros" icon={Bath}>{accommodation.bathrooms}</Info>
                            <Info label="Max. Hospedes" icon={Users}>{accommodation.maxGuests}</Info>
                        </div>
                        {accommodation.amenities?.length > 0 && (
                            <div className="mt-4 border-t border-slate-200 pt-4">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Amenidades</p>
                                <div className="flex flex-wrap gap-2">
                                    {accommodation.amenities.map((amenity) => (
                                        <span key={amenity} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">Dados da Reserva</h3>
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
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Numero de Hospedes
                            </label>
                            <select
                                value={reservationData.guests}
                                onChange={(e) => setReservationData({ ...reservationData, guests: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            >
                                {Array.from({ length: accommodation.maxGuests }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? 'hospede' : 'hospedes'}
                                    </option>
                                ))}
                            </select>
                            {errors.guests && (
                                <p className="mt-1 flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle size={14} />{errors.guests}
                                </p>
                            )}
                        </div>

                        {accommodation.allowsCrib && (
                            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <span>
                                    <span className="block font-bold text-slate-900">Solicitar berco</span>
                                    <span className="text-sm text-slate-600">O backend aplica a taxa extra na diaria.</span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={reservationData.cribRequested}
                                    onChange={(e) => setReservationData({ ...reservationData, cribRequested: e.target.checked })}
                                    className="h-5 w-5 accent-amber-500"
                                />
                            </label>
                        )}
                    </div>

                    {nights > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-700">
                                    Estimativa para {nights} {nights === 1 ? 'noite' : 'noites'}
                                </span>
                                <span className="text-xl font-bold text-slate-900">
                                    R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    )}

                    {errors.submit && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Fechar
                        </button>
                        <button
                            type="button"
                            onClick={handleReservation}
                            disabled={submitting}
                            className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-bold text-white transition hover:from-amber-600 hover:to-amber-700 disabled:opacity-60"
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
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="flex items-center gap-2 font-bold text-slate-900">
                <Icon size={16} className="text-amber-600" />
                {children}
            </p>
        </div>
    )
}

function DateField({ label, selected, onChange, minDate, error }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
            <DatePicker
                selected={selected}
                onChange={onChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione"
                minDate={minDate}
                locale="pt-BR"
                calendarClassName="guest-datepicker"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            {error && (
                <p className="mt-1 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={14} />{error}
                </p>
            )}
        </div>
    )
}

export default ReservationModal
