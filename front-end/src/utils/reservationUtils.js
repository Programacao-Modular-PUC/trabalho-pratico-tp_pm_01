export function formatDate(value) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatCurrency(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function statusForReservation(item) {
    const now = new Date()
    const start = new Date(item.dataEntrada)
    const end = new Date(item.dataSaida)

    if (end < now) return 'Finalizada'
    if (start <= now && end >= now) return 'Em andamento'
    return 'Confirmada'
}

export function canCancelReservation(item) {
    return statusForReservation(item) === 'Confirmada'
}

export function buildCancelMessage(item) {
    return `Deseja cancelar a reserva do quarto ${item.codigoQuarto || 'selecionado'} (${formatDate(item.dataEntrada)} - ${formatDate(item.dataSaida)})?`
}
