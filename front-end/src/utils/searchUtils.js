export const DEFAULT_LOCATION = 'Peninsula de Marau, Bahia'

export const GUEST_OPTIONS = [
    { value: '1', label: '1 Pessoa' },
    { value: '2', label: '2 Pessoas' },
    { value: '3', label: '3 Pessoas' },
    { value: '4', label: '4+ Pessoas' }
]

export function parseGuestsCount(value) {
    if (!value) return 1
    return Number(value) || 1
}

export function parseDateParam(value) {
    if (!value) return null
    const date = new Date(`${value}T12:00:00`)
    return Number.isNaN(date.getTime()) ? null : date
}

export function buildSearchQueryString(criteria = {}) {
    const params = new URLSearchParams()
    const { location, startDate, endDate, guests, searchTerm } = criteria

    if (searchTerm?.trim()) params.set('q', searchTerm.trim())
    if (location?.trim() && location.trim() !== DEFAULT_LOCATION) params.set('local', location.trim())
    if (startDate instanceof Date && !Number.isNaN(startDate.getTime())) {
        params.set('entrada', startDate.toISOString().slice(0, 10))
    }
    if (endDate instanceof Date && !Number.isNaN(endDate.getTime())) {
        params.set('saida', endDate.toISOString().slice(0, 10))
    }
    if (guests) params.set('hospedes', String(guests))

    return params.toString()
}

export function parseSearchFromUrl(searchParams) {
    return {
        searchTerm: searchParams.get('q') || '',
        location: searchParams.get('local') || DEFAULT_LOCATION,
        startDate: parseDateParam(searchParams.get('entrada')),
        endDate: parseDateParam(searchParams.get('saida')),
        guests: searchParams.get('hospedes') || '1'
    }
}

export function hasDateConflict(alugueis, quartoId, startDate, endDate) {
    if (!startDate || !endDate || !quartoId) return false

    const checkIn = new Date(startDate)
    const checkOut = new Date(endDate)
    checkIn.setHours(14, 0, 0, 0)
    checkOut.setHours(12, 0, 0, 0)

    return (alugueis || []).some((item) => {
        if (Number(item.quartoId) !== Number(quartoId)) return false
        const entrada = new Date(item.dataEntrada)
        const saida = new Date(item.dataSaida)
        return entrada < checkOut && saida > checkIn
    })
}

export function filterAccommodations(accommodations, criteria = {}, alugueis = []) {
    const guestCount = parseGuestsCount(criteria.guests)
    const term = (criteria.searchTerm || '').trim().toLowerCase()
    const locationTerm = (criteria.location || '').trim().toLowerCase()
    const genericLocation = DEFAULT_LOCATION.toLowerCase()

    return (accommodations || []).filter((item) => {
        if (term) {
            const haystack = `${item.title || ''} ${item.name || ''} ${item.location || ''} ${item.description || ''}`.toLowerCase()
            if (!haystack.includes(term)) return false
        }

        if (locationTerm && locationTerm !== genericLocation) {
            const itemLocation = (item.location || '').toLowerCase()
            const needle = locationTerm.split(',')[0].trim()
            if (needle && !itemLocation.includes(needle)) return false
        }

        if (guestCount > Number(item.maxGuests || 1)) return false

        if (criteria.startDate && criteria.endDate) {
            if (criteria.endDate <= criteria.startDate) return false
            if (hasDateConflict(alugueis, item.quartoId || item.id, criteria.startDate, criteria.endDate)) {
                return false
            }
        }

        return true
    })
}
