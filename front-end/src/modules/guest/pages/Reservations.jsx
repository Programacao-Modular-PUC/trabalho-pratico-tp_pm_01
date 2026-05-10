import { useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle, MapPin, Users, XCircle } from 'lucide-react'
import { api } from '../../../services/api'
import { getLoggedCliente } from '../../../services/auth'

function formatDate(value) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function statusForReservation(item) {
    const now = new Date()
    const start = new Date(item.dataEntrada)
    const end = new Date(item.dataSaida)

    if (end < now) return 'Finalizada'
    if (start <= now && end >= now) return 'Em andamento'
    return 'Confirmada'
}

function Reservations() {
    const cliente = getLoggedCliente()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!cliente?.id) {
            setLoading(false)
            return
        }

        let mounted = true
        api.listAlugueis()
            .then((items) => {
                if (!mounted) return
                setReservations((items || []).filter((item) => Number(item.clienteId) === Number(cliente.id)))
                setError('')
            })
            .catch((err) => {
                if (mounted) setError(err.message)
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [cliente?.id])

    const totals = useMemo(() => {
        return reservations.reduce((acc, item) => acc + Number(item.valorFinal || 0), 0)
    }, [reservations])

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                <h1 className="text-3xl font-black text-white">Minhas reservas</h1>
                <p className="mt-3 max-w-2xl text-slate-400">
                    {cliente?.nome ? `${cliente.nome}, acompanhe suas reservas confirmadas.` : 'Entre como cliente para acompanhar suas reservas.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-slate-900 px-4 py-2 text-slate-300">{reservations.length} reserva(s)</span>
                    <span className="rounded-full bg-amber-500/15 px-4 py-2 text-amber-300">Total: {formatCurrency(totals)}</span>
                </div>
            </div>

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
                                    <h2 className="mt-3 text-2xl font-semibold text-white">Quarto {item.codigoQuarto}</h2>
                                    <p className="text-slate-400">{item.enderecoResidencia || 'Marau, Bahia'}</p>
                                </div>
                                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${status === 'Confirmada' ? 'bg-emerald-500/15 text-emerald-300' : status === 'Em andamento' ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-700/70 text-slate-300'}`}>
                                    {status}
                                </span>
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
                                <span className="rounded-3xl bg-slate-900/80 px-5 py-3">Diarias: {item.quantidadeDiarias}</span>
                                <span className="rounded-3xl bg-slate-900/80 px-5 py-3">Diaria: {formatCurrency(item.valorDiaria)}</span>
                                {item.bercoSolicitado && (
                                    <span className="rounded-3xl bg-amber-500/15 px-5 py-3 text-amber-300">Berco solicitado</span>
                                )}
                            </div>
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
