import NotificationsPage from '../../../components/NotificationsPage'
import { getSessionEmail } from '../../../services/auth'

function GuestNotifications() {
    const email = getSessionEmail()

    return (
        <NotificationsPage
            userEmail={email}
            title="Suas notificacoes"
            subtitle="Acompanhe confirmacoes de reserva, check-in, check-out e pagamentos relacionados a sua conta."
            theme="light"
        />
    )
}

export default GuestNotifications
