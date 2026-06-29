import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Bell, Filter, RefreshCw } from 'lucide-react'
import { api } from '../services/api'
import {
    EVENTO_LABELS,
    EVENTO_COLORS,
    filterNotificacoesForHost,
    filterNotificacoesPorEmail,
    formatNotificacaoDate,
    labelEvento
} from '../utils/notificationUtils'

function NotificationsPage({
    userEmail,
    recipientEmails,
    audience = 'guest',
    title,
    subtitle,
    theme = 'light'
}) {
    const [notificacoes, setNotificacoes] = useState([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const isDark = theme === 'dark'

    const recipientLabel = useMemo(() => {
        if (audience === 'host' && recipientEmails?.length) {
            return recipientEmails.join(', ')
        }
        return userEmail || 'Nao identificado'
    }, [audience, recipientEmails, userEmail])

    const loadNotificacoes = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const items = await api.listNotificacoes()
            if (audience === 'host') {
                const destinatarios = recipientEmails?.length
                    ? recipientEmails
                    : (userEmail ? [userEmail] : [])
                setNotificacoes(filterNotificacoesForHost(items, destinatarios))
            } else {
                setNotificacoes(filterNotificacoesPorEmail(items, userEmail))
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [audience, recipientEmails, userEmail])

    useEffect(() => {
        loadNotificacoes()
    }, [loadNotificacoes])

    const filtered = useMemo(() => {
        if (filter === 'all') return notificacoes
        return notificacoes.filter((item) => item.tipoEvento === filter)
    }, [filter, notificacoes])

    const shell = isDark
        ? 'bg-gradient-to-br from-slate-900 via-black to-slate-900 min-h-screen text-white'
        : 'min-h-screen bg-slate-50 text-slate-900'

    const card = isDark
        ? 'rounded-3xl border border-slate-700/80 bg-slate-950/80 shadow-xl'
        : 'rounded-3xl border border-slate-200 bg-white shadow-sm'

    const muted = isDark ? 'text-slate-400' : 'text-slate-600'

    return (
        <div className={`p-6 ${shell}`}>
            <div className={`mb-8 ${card} p-8`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`rounded-2xl p-3 ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                            <Bell className={`h-7 w-7 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                        </div>
                        <div>
                            <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                Central de Notificacoes
                            </p>
                            <h1 className={`mt-2 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
                            <p className={`mt-2 max-w-2xl ${muted}`}>{subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={loadNotificacoes}
                        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            isDark
                                ? 'bg-slate-800 text-white hover:bg-slate-700'
                                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <RefreshCw size={16} />
                        Atualizar
                    </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <span className={`rounded-full px-4 py-2 ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        {notificacoes.length} notificacao(oes)
                    </span>
                    <span className={`rounded-full px-4 py-2 ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        Destinatario: {recipientLabel}
                    </span>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-2 text-sm font-semibold ${muted}`}>
                    <Filter size={16} /> Filtrar:
                </span>
                <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} isDark={isDark} label="Todas" />
                {Object.entries(EVENTO_LABELS).map(([value, label]) => (
                    <FilterChip
                        key={value}
                        active={filter === value}
                        onClick={() => setFilter(value)}
                        isDark={isDark}
                        label={label}
                    />
                ))}
            </div>

            {error && (
                <div className={`mb-6 ${card} border-red-500/40 bg-red-500/10 p-4 text-red-300 flex gap-3`}>
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {error}
                </div>
            )}

            {loading ? (
                <div className={`${card} p-8 ${muted}`}>Carregando notificacoes...</div>
            ) : filtered.length === 0 ? (
                <div className={`${card} p-8 ${muted}`}>
                    Nenhuma notificacao encontrada para {recipientLabel}.
                    {filter !== 'all' && ' Tente remover o filtro de evento.'}
                    {filter === 'all' && audience === 'host' && ' Faca uma reserva como hospede ou confirme check-in/pagamento para gerar alertas.'}
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((item) => (
                        <article key={item.id} className={`${card} p-6`}>
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="space-y-3">
                                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${EVENTO_COLORS[item.tipoEvento] || 'bg-slate-100 text-slate-700'}`}>
                                        {labelEvento(item.tipoEvento)}
                                    </span>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.titulo}</h2>
                                    <p className={`text-sm leading-relaxed ${muted}`}>{item.conteudo}</p>
                                </div>
                                <div className={`min-w-48 space-y-2 text-sm ${muted}`}>
                                    <p><strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Canal:</strong> {item.canal}</p>
                                    <p><strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Quando:</strong> {formatNotificacaoDate(item.registradaEm)}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

function FilterChip({ active, onClick, label, isDark }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                    ? 'bg-amber-500 text-black'
                    : isDark
                        ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
            {label}
        </button>
    )
}

export default NotificationsPage
