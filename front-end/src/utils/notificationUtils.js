export const EVENTO_LABELS = {
    RESERVA_CRIADA: 'Reserva criada',
    RESERVA_CANCELADA: 'Reserva cancelada',
    CHECKIN_REALIZADO: 'Check-in realizado',
    CHECKOUT_REALIZADO: 'Check-out realizado',
    PAGAMENTO_CONFIRMADO: 'Pagamento confirmado'
}

export const EVENTO_COLORS = {
    RESERVA_CRIADA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    RESERVA_CANCELADA: 'bg-red-100 text-red-700 border-red-200',
    CHECKIN_REALIZADO: 'bg-blue-100 text-blue-800 border-blue-200',
    CHECKOUT_REALIZADO: 'bg-slate-100 text-slate-800 border-slate-200',
    PAGAMENTO_CONFIRMADO: 'bg-amber-100 text-amber-800 border-amber-200'
}

export function labelEvento(tipo) {
    return EVENTO_LABELS[tipo] || tipo
}

export function formatNotificacaoDate(value) {
    if (!value) return '-'
    return new Date(value).toLocaleString('pt-BR')
}

export function filterNotificacoesPorEmail(notificacoes, email) {
    if (!email) return []
    const normalized = email.toLowerCase()
    return (notificacoes || []).filter(
        (item) => item.destinatario?.toLowerCase() === normalized
    )
}
