const STORAGE_KEY = 'marauReserveSession'

export function saveSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function getSession() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch {
        return null
    }
}

export function clearSession() {
    localStorage.removeItem(STORAGE_KEY)
}

export function getLoggedCliente() {
    const session = getSession()
    return session?.role === 'guest' ? session.cliente : null
}

export const ROOM_TYPE_OPTIONS = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'DUPLO', label: 'Duplo' },
    { value: 'CASAL', label: 'Casal' },
    { value: 'FAMILIA', label: 'Familia' }
]

export function buildAccommodation(room) {
    const residencia = [room.enderecoResidencia].filter(Boolean).join(' ')
    const beds = Number(room.quantidadeCamasSolteiro || 0)
        + Number(room.quantidadeCamasCasal || 0)
        + Number(room.quantidadeCamasQueen || 0)
        + Number(room.quantidadeCamasKing || 0)

    return {
        id: room.id,
        quartoId: room.id,
        residenciaId: room.residenciaId,
        tipo: room.tipo,
        title: `${labelTipo(room.tipo)} ${room.codigo}`,
        name: `${labelTipo(room.tipo)} ${room.codigo}`,
        location: residencia || 'Marau, Bahia',
        description: describeRoom(room),
        price: Number(room.valorBase || 0),
        rating: '4.8',
        img: imageForType(room.tipo),
        beds: Math.max(1, beds || (room.tipo === 'DUPLO' || room.tipo === 'CASAL' ? 1 : 0)),
        bathrooms: room.possuiHidromassagem ? 2 : 1,
        maxGuests: Number(room.capacidadeMaxima || 1),
        allowsCrib: Boolean(room.permiteBerco),
        amenities: [
            room.possuiArCondicionado ? 'Ar condicionado' : null,
            room.possuiHidromassagem ? 'Hidromassagem' : null,
            room.permiteBerco ? 'Berco sob solicitacao' : null,
            room.tipo === 'FAMILIA' ? `${room.quantidadeAmbientes || 1} ambiente(s)` : null
        ].filter(Boolean)
    }
}

function labelTipo(tipo) {
    const labels = {
        INDIVIDUAL: 'Quarto Individual',
        DUPLO: 'Quarto Duplo',
        CASAL: 'Quarto Casal',
        FAMILIA: 'Quarto Familia'
    }
    return labels[tipo] || 'Quarto'
}

function describeRoom(room) {
    if (room.tipo === 'INDIVIDUAL') {
        return `Opcao economica com ${room.quantidadeCamasSolteiro || 1} cama(s) de solteiro.`
    }
    if (room.tipo === 'DUPLO' || room.tipo === 'CASAL') {
        return `Quarto para casal com cama ${room.tipoCamaCasal || 'CASAL_PADRAO'}${room.permiteBerco ? ' e berco opcional' : ''}.`
    }
    return `Quarto familia com capacidade para ${room.capacidadeMaxima || 1} hospedes e ambientes integrados.`
}

function imageForType(tipo) {
    if (tipo === 'FAMILIA') return '/img/vila_pontal.jpg'
    if (tipo === 'INDIVIDUAL') return '/img/suite_roots.jpg'
    return '/img/bangalo.jpg'
}
