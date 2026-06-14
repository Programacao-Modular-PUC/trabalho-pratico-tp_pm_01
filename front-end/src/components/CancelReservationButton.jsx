import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { api } from '../services/api'
import { buildCancelMessage, canCancelReservation } from '../utils/reservationUtils'

function CancelReservationButton({
    reservation,
    onCancelled,
    onError,
    className = '',
    label = 'Cancelar reserva'
}) {
    const [loading, setLoading] = useState(false)

    if (!canCancelReservation(reservation)) return null

    const handleClick = async () => {
        if (!window.confirm(buildCancelMessage(reservation))) return

        setLoading(true)
        try {
            await api.cancelAluguel(reservation.id)
            onCancelled?.(reservation)
        } catch (error) {
            onError?.(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-60 ${className}`}
        >
            <Trash2 className="h-4 w-4" />
            {loading ? 'Cancelando...' : label}
        </button>
    )
}

export default CancelReservationButton
