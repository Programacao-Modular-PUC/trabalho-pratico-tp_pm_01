import { useEffect, useMemo, useState } from 'react'
import {
    DollarSign,
    Calendar,
    Users,
    Home,
    AlertCircle,
    RefreshCw,
    BarChart3
} from 'lucide-react'
import { api } from '../../../services/api'
import { ensureHostSession, filterHostResidences, getHostEmail } from '../../../services/auth'

function Dashboard() {
    const [bookings, setBookings] = useState([])
    const [residences, setResidences] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadDashboard = async () => {
        setLoading(true)
        setError('')
        try {
            ensureHostSession()
            const email = getHostEmail()
            const [alugueis, residencias] = await Promise.all([
                api.listAlugueis(),
                api.listResidencias()
            ])
            const hostResidences = filterHostResidences(residencias, email)
            const hostResidenceIds = new Set(hostResidences.map((item) => item.id))
            setResidences(hostResidences)
            setBookings(alugueis.filter((item) => hostResidenceIds.has(item.residenciaId)))
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDashboard()
    }, [])

    const stats = useMemo(() => {
        const finalized = bookings.filter((item) => item.status === 'FINALIZADA')
        const reserved = bookings.filter((item) => item.status === 'RESERVADA')
        const active = bookings.filter((item) => item.status === 'EM_ANDAMENTO')
        const totalRevenue = finalized.reduce((sum, item) => sum + Number(item.valorFinal || 0), 0)
        const monthRevenue = finalized
            .filter((item) => {
                const date = new Date(item.dataSaida)
                const now = new Date()
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            })
            .reduce((sum, item) => sum + Number(item.valorFinal || 0), 0)
        const totalGuests = bookings.reduce((sum, item) => sum + Number(item.quantidadeHospedes || 0), 0)

        return {
            totalRevenue,
            monthRevenue,
            occupancyRate: bookings.length > 0
                ? Math.round(((finalized.length + active.length) / bookings.length) * 100)
                : 0,
            totalGuests,
            activeListings: residences.length,
            upcomingReservations: reserved.length
        }
    }, [bookings, residences])

    const recentStays = useMemo(() => {
        return [...bookings]
            .sort((a, b) => new Date(b.dataEntrada) - new Date(a.dataEntrada))
            .slice(0, 6)
    }, [bookings])

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR')

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Dashboard</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-900">Visao geral do anfitriao</h1>
                        <p className="mt-2 max-w-2xl text-slate-600">
                            Reservas, receita e ocupacao carregadas diretamente da API — mesmas bases usadas em Relatorios e Agendamentos.
                        </p>
                    </div>
                    <button
                        onClick={loadDashboard}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Atualizar
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 flex gap-3">
                    <AlertCircle className="shrink-0" />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center text-slate-600 shadow-sm">
                    Carregando dados do painel...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard icon={DollarSign} label="Receita total" value={formatCurrency(stats.totalRevenue)} hint="Reservas finalizadas" />
                        <StatCard icon={Calendar} label="Receita do mes" value={formatCurrency(stats.monthRevenue)} hint="Saidas no mes atual" />
                        <StatCard icon={BarChart3} label="Taxa de ocupacao" value={`${stats.occupancyRate}%`} hint="Finalizadas + em andamento" />
                        <StatCard icon={Users} label="Hospedes atendidos" value={stats.totalGuests} hint={`${stats.upcomingReservations} reserva(s) futura(s)`} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Home className="text-amber-600" size={20} />
                                <h2 className="font-bold text-slate-900">Minhas residencias</h2>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stats.activeListings}</p>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                {residences.slice(0, 3).map((item) => (
                                    <li key={item.id}>{item.endereco} — {item.bairro}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-4">Reservas recentes</h2>
                            {recentStays.length === 0 ? (
                                <p className="text-slate-600">Nenhuma reserva encontrada para suas propriedades.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentStays.map((stay) => (
                                        <div key={stay.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{stay.nomeCliente}</p>
                                                <p className="text-sm text-slate-600">Quarto {stay.codigoQuarto} — {stay.enderecoResidencia || 'Residencia'}</p>
                                                <p className="text-xs text-slate-500">{formatDate(stay.dataEntrada)} - {formatDate(stay.dataSaida)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{stay.status}</span>
                                                <p className="mt-2 font-bold text-slate-900">{formatCurrency(stay.valorFinal)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

function StatCard({ icon: Icon, label, value, hint }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-amber-100 p-3 text-amber-700">
                <Icon size={22} />
            </div>
            <p className="text-sm text-slate-600">{label}</p>
            <h3 className="mt-1 text-2xl font-black text-slate-900">{value}</h3>
            <p className="mt-2 text-xs text-slate-500">{hint}</p>
        </div>
    )
}

export default Dashboard
