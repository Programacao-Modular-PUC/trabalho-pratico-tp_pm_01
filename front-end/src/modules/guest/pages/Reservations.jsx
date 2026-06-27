import { useCallback, useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle, MapPin, Users, XCircle } from 'lucide-react'
import CancelReservationButton from '../../../components/CancelReservationButton'
import { api } from '../../../services/api'
import { getLoggedCliente } from '../../../services/auth'
import { canCancelReservation, formatCurrency, formatDate, statusForReservation } from '../../../utils/reservationUtils'

function Reservations() {
    const cliente = getLoggedCliente()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const loadReservations = useCallback(async () => {
        if (!cliente?.id) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError('')
        try {
            const items = await api.listHistoricoCliente(cliente.id)
            setReservations(items || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [cliente?.id])

    useEffect(() => {
        loadReservations()
    }, [loadReservations])

    const handleCancelled = (item) => {
        setReservations((current) => current.filter((reservation) => reservation.id !== item.id))
        setSuccessMessage(`Reserva do quarto ${item.codigoQuarto} cancelada com sucesso.`)
        setError('')
    }

    const totals = useMemo(() => {
        return reservations.reduce((acc, item) => acc + Number(item.valorFinal || 0), 0)
    }, [reservations])

    const upcomingCount = useMemo(() => {
        return reservations.filter((item) => statusForReservation(item) === 'Confirmada').length
    }, [reservations])

    const cancellableCount = useMemo(() => {
        return reservations.filter(canCancelReservation).length
    }, [reservations])

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-black text-slate-900">Minhas reservas</h1>
                <p className="mt-3 max-w-2xl text-slate-600">
                    {cliente?.nome
                        ? `${cliente.nome}, acompanhe e cancele reservas futuras antes do check-in.`
                        : 'Entre como cliente para acompanhar suas reservas.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">{reservations.length} reserva(s)</span>
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-800">{upcomingCount} proxima(s)</span>
                    <span className="rounded-full bg-red-100 px-4 py-2 text-red-700">{cancellableCount} cancelavel(is)</span>
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-amber-800">Total: {formatCurrency(totals)}</span>
                </div>
            </div>

            {successMessage && (
                <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                    {successMessage}
                </div>
            )}

            {loading && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">Carregando reservas...</div>
            )}

            {error && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
            )}

            {!loading && !error && reservations.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <p>Nenhuma reserva encontrada para este cliente.</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {reservations.map((item) => {
                    const status = statusForReservation(item)
                    return (
                        <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{status}</p>
                                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">Quarto {item.codigoQuarto || 'Indisponivel'}</h2>
                                    <p className="text-slate-600">{item.enderecoResidencia || 'Marau, Bahia'}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${status === 'Confirmada' ? 'bg-emerald-100 text-emerald-800' : status === 'Em andamento' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                                        {status}
                                    </span>
                                    <CancelReservationButton
                                        reservation={item}
                                        onCancelled={handleCancelled}
                                        onError={setError}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <InfoCard icon={Calendar} label="Datas">
                                    {formatDate(item.dataEntrada)} - {formatDate(item.dataSaida)}
                                </InfoCard>
                                <InfoCard icon={MapPin} label="Local">
                                    {item.enderecoResidencia || 'Marau, Bahia'}
                                </InfoCard>
                                <InfoCard icon={Users} label="Hospedes">
                                    {item.quantidadeHospedes} {item.quantidadeHospedes === 1 ? 'hospede' : 'hospedes'}
                                </InfoCard>
                                <InfoCard icon={CheckCircle} label="Total">
                                    {formatCurrency(item.valorFinal)}
                                </InfoCard>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
                                <span className="rounded-3xl bg-slate-100 px-5 py-3">Diarias: {item.quantidadeDiarias || '-'}</span>
                                <span className="rounded-3xl bg-slate-100 px-5 py-3">Valor/noite: {formatCurrency(item.valorDiaria)}</span>
                                {item.bercoSolicitado && (
                                    <span className="rounded-3xl bg-amber-100 px-5 py-3 text-amber-800">Berço solicitado</span>
                                )}
                            </div>

                            {!canCancelReservation(item) && status !== 'Finalizada' && (
                                <p className="mt-4 text-sm text-slate-500">
                                    Reservas em andamento nao podem ser canceladas pelo sistema.
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function InfoCard({ icon: Icon, label, children }) {
    return (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-amber-600">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</span>
            </div>
            <p className="mt-3 font-medium text-slate-900">{children}</p>
        </div>
    )
}

export default Reservations
