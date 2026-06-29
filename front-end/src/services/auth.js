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

export const HOST_TEST_EMAIL = 'acessohost@gmail.com'
export const GUEST_TEST_EMAIL = 'acessoguest@gmail.com'

export function getLoggedHost() {
    const session = getSession()
    return session?.role === 'host' ? session : null
}

export function getHostEmail() {
    const session = getSession()
    if (session?.role !== 'host') return null
    return session.email || HOST_TEST_EMAIL
}

export function belongsToHostResidence(residence, hostEmail) {
    if (!hostEmail || !residence) return false
    return residence.email?.toLowerCase() === hostEmail.toLowerCase()
}

export function filterHostResidences(residencias, hostEmail = getHostEmail()) {
    if (!Array.isArray(residencias)) return []
    if (!hostEmail) return residencias

    const matched = residencias.filter((item) => belongsToHostResidence(item, hostEmail))
    if (matched.length > 0) return matched

    if (hostEmail.toLowerCase() === HOST_TEST_EMAIL.toLowerCase()) {
        return residencias
    }

    return matched
}

export function filterRoomsByResidences(rooms, residencias) {
    if (!Array.isArray(rooms) || !Array.isArray(residencias)) return rooms || []
    const residenceIds = new Set(residencias.map((item) => item.id))
    return rooms.filter((room) => residenceIds.has(room.residenciaId))
}

export function ensureHostSession() {
    const session = getSession()
    if (session?.role !== 'host') return session

    if (session.email) return session

    const patched = {
        ...session,
        email: HOST_TEST_EMAIL,
        nome: session.nome || 'Anfitriao Teste'
    }
    saveSession(patched)
    return patched
}

export function getSessionEmail() {
    const session = getSession()
    if (session?.role === 'host') return getHostEmail()
    if (session?.role === 'guest') return session.cliente?.email
    return null
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
