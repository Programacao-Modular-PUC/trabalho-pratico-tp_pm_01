import { useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle, Clock, History as HistoryIcon, MapPin, Users, XCircle } from 'lucide-react'
import CancelReservationButton from '../../../components/CancelReservationButton'
import { api } from '../../../services/api'
import { getLoggedCliente } from '../../../services/auth'
import { formatCurrency, formatDate, statusForReservation } from '../../../utils/reservationUtils'

function History() {
    const cliente = getLoggedCliente()
    const [history, setHistory] = useState([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    useEffect(() => {
        if (!cliente?.id) {
            setLoading(false)
            return
        }

        let mounted = true
        api.listHistoricoCliente(cliente.id)
            .then((items) => {
                if (!mounted) return
                setHistory(items || [])
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

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            const status = statusForReservation(item)
            if (filter === 'upcoming') return status === 'Confirmada'
            if (filter === 'active') return status === 'Em andamento'
            if (filter === 'past') return status === 'Finalizada'
            return true
        })
    }, [filter, history])

    const stats = useMemo(() => {
        const past = history.filter((item) => statusForReservation(item) === 'Finalizada')
        const totalSpent = past.reduce((sum, item) => sum + Number(item.valorFinal || 0), 0)
        return { total: history.length, past: past.length, totalSpent }
    }, [history])

    const filters = [
        { id: 'all', label: 'Todas' },
        { id: 'upcoming', label: 'Proximas' },
        { id: 'active', label: 'Em andamento' },
        { id: 'past', label: 'Finalizadas' }
    ]

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <HistoryIcon className="h-8 w-8 text-amber-600" />
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Historico de hospedagens</h1>
                        <p className="mt-2 max-w-2xl text-slate-600">
                            {cliente?.nome
                                ? `${cliente.nome}, veja todas as suas estadias registradas no sistema.`
                                : 'Entre como cliente para consultar seu historico.'}
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">{stats.total} hospedagem(ns)</span>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">{stats.past} finalizada(s)</span>
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-amber-800">
                        Total em estadias: {formatCurrency(stats.totalSpent)}
                    </span>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {filters.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setFilter(id)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            filter === id
                                ? 'bg-amber-500 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">Carregando historico...</div>
            )}

            {error && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
            )}

            {successMessage && (
                <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                    {successMessage}
                </div>
            )}

            {!loading && !error && filteredHistory.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <p>Nenhuma hospedagem encontrada para o filtro selecionado.</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {filteredHistory.map((item) => {
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
                                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                        status === 'Confirmada'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : status === 'Em andamento'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-slate-100 text-slate-700'
                                    }`}>
                                        {status}
                                    </span>
                                    <CancelReservationButton
                                        reservation={item}
                                        onCancelled={(cancelled) => {
                                            setHistory((current) => current.filter((entry) => entry.id !== cancelled.id))
                                            setSuccessMessage(`Hospedagem do quarto ${cancelled.codigoQuarto} cancelada.`)
                                            setError('')
                                        }}
                                        onError={setError}
                                        label="Cancelar hospedagem"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <InfoCard icon={Calendar} label="Periodo">
                                    {formatDate(item.dataEntrada)} - {formatDate(item.dataSaida)}
                                </InfoCard>
                                <InfoCard icon={MapPin} label="Local">
                                    {item.enderecoResidencia || 'Marau, Bahia'}
                                </InfoCard>
                                <InfoCard icon={Users} label="Hospedes">
                                    {item.quantidadeHospedes} {item.quantidadeHospedes === 1 ? 'hospede' : 'hospedes'}
                                </InfoCard>
                                <InfoCard icon={CheckCircle} label="Total pago">
                                    {formatCurrency(item.valorFinal)}
                                </InfoCard>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
                                <span className="rounded-3xl bg-slate-100 px-5 py-3 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                    {item.quantidadeDiarias || '-'} diaria(s)
                                </span>
                                <span className="rounded-3xl bg-slate-100 px-5 py-3">
                                    Valor/noite: {formatCurrency(item.valorDiaria)}
                                </span>
                                {item.bercoSolicitado && (
                                    <span className="rounded-3xl bg-amber-100 px-5 py-3 text-amber-800">Berço solicitado</span>
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
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-amber-600">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</span>
            </div>
            <p className="mt-3 font-medium text-slate-900">{children}</p>
        </div>
    )
}

export default History
