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
            <div className="mb-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                <h1 className="text-3xl font-black text-white">Minhas reservas</h1>
                <p className="mt-3 max-w-2xl text-slate-400">
                    {cliente?.nome
                        ? `${cliente.nome}, acompanhe e cancele reservas futuras antes do check-in.`
                        : 'Entre como cliente para acompanhar suas reservas.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-slate-900 px-4 py-2 text-slate-300">{reservations.length} reserva(s)</span>
                    <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-300">{upcomingCount} proxima(s)</span>
                    <span className="rounded-full bg-red-500/15 px-4 py-2 text-red-300">{cancellableCount} cancelavel(is)</span>
                    <span className="rounded-full bg-amber-500/15 px-4 py-2 text-amber-300">Total: {formatCurrency(totals)}</span>
                </div>
            </div>

            {successMessage && (
                <div className="mb-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-200">
                    {successMessage}
                </div>
            )}

            {loading && (
                <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 text-slate-300">Carregando reservas...</div>
            )}

            {error && (
                <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200">{error}</div>
            )}

            {!loading && !error && reservations.length === 0 && (
                <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/10">
                    <div className="flex items-center gap-3 text-slate-400">
                        <XCircle className="h-5 w-5 text-red-400" />
                        <p>Nenhuma reserva encontrada para este cliente.</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {reservations.map((item) => {
                    const status = statusForReservation(item)
                    return (
                        <div key={item.id} className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/15">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{status}</p>
                                    <h2 className="mt-3 text-2xl font-semibold text-white">Quarto {item.codigoQuarto || 'Indisponivel'}</h2>
                                    <p className="text-slate-400">{item.enderecoResidencia || 'Marau, Bahia'}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${status === 'Confirmada' ? 'bg-emerald-500/15 text-emerald-300' : status === 'Em andamento' ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-700/70 text-slate-300'}`}>
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

                            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                                <span className="rounded-3xl bg-slate-900/80 px-5 py-3">Diarias: {item.quantidadeDiarias || '-'}</span>
                                <span className="rounded-3xl bg-slate-900/80 px-5 py-3">Valor/noite: {formatCurrency(item.valorDiaria)}</span>
                                {item.bercoSolicitado && (
                                    <span className="rounded-3xl bg-amber-500/15 px-5 py-3 text-amber-300">Berço solicitado</span>
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
        <div className="rounded-3xl bg-slate-900/80 p-4">
            <div className="flex items-center gap-2 text-amber-400">
                <Icon className="h-4 w-4" />
                <span className="text-sm uppercase tracking-[0.25em]">{label}</span>
            </div>
            <p className="mt-3 text-white">{children}</p>
        </div>
    )
}

export default Reservations
