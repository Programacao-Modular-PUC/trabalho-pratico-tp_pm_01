import NotificationsPage from '../../../components/NotificationsPage'
import { getSessionEmail } from '../../../services/auth'

function HostNotifications() {
    const email = getSessionEmail()

    return (
        <NotificationsPage
            userEmail={email}
            title="Notificacoes do anfitriao"
            subtitle="Receba alertas sobre novas reservas, cancelamentos, check-ins, check-outs e pagamentos das suas propriedades."
            theme="dark"
        />
    )
}

export default HostNotifications
