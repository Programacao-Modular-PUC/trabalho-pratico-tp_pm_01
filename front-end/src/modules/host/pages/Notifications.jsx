import { useEffect, useState } from 'react'
import NotificationsPage from '../../../components/NotificationsPage'
import { api } from '../../../services/api'
import { ensureHostSession, filterHostResidences, getHostEmail } from '../../../services/auth'

function HostNotifications() {
    const [recipients, setRecipients] = useState([])
    const [ready, setReady] = useState(false)

    useEffect(() => {
        let active = true

        async function loadRecipients() {
            ensureHostSession()
            const hostEmail = getHostEmail()
            const fallback = hostEmail ? [hostEmail] : []

            try {
                const residencias = filterHostResidences(await api.listResidencias())
                const emails = [...new Set([
                    hostEmail,
                    ...residencias.map((item) => item.email)
                ].filter(Boolean))]

                if (active) {
                    setRecipients(emails.length > 0 ? emails : fallback)
                }
            } catch {
                if (active) setRecipients(fallback)
            } finally {
                if (active) setReady(true)
            }
        }

        loadRecipients()
        return () => {
            active = false
        }
    }, [])

    if (!ready) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 p-6 text-slate-400">
                Carregando notificacoes do anfitriao...
            </div>
        )
    }

    return (
        <NotificationsPage
            audience="host"
            recipientEmails={recipients}
            userEmail={recipients[0]}
            title="Notificacoes do anfitriao"
            subtitle="Receba alertas sobre novas reservas, cancelamentos, check-ins, check-outs e pagamentos das suas propriedades."
            theme="dark"
        />
    )
}

export default HostNotifications
