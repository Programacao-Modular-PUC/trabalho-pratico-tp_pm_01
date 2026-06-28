import { useState } from "react"
import { Link } from "react-router-dom"
import {
    LayoutDashboard,
    Calendar,
    Heart,
    User,
    MessageSquare,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Bell,
    History
} from 'lucide-react'
import Explore from './pages/Dashboard'
import Reservations from './pages/Reservations'
import HistoryPage from './pages/History'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Info from './pages/Support'
import Notifications from './pages/Notifications'
import { clearSession, getLoggedCliente } from '../../services/auth'

function GuestLayout() {
    const [activeTab, setActiveTab] = useState('explore')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const navItems = [
        {
            id: 'explore',
            label: 'Explorar',
            icon: LayoutDashboard,
            component: Explore
        },
        {
            id: 'reservas',
            label: 'Reservas',
            icon: Calendar,
            component: Reservations
        },
        {
            id: 'notificacoes',
            label: 'Notificacoes',
            icon: Bell,
            component: Notifications
        },
        {
            id: 'historico',
            label: 'Historico',
            icon: History,
            component: HistoryPage
        },
        {
            id: 'favoritos',
            label: 'Favoritos',
            icon: Heart,
            component: Favorites
        },
        {
            id: 'perfil',
            label: 'Perfil',
            icon: User,
            component: Profile
        },
        {
            id: 'info',
            label: 'Informações',
            icon: MessageSquare,
            component: Info
        }
    ]

    const ActiveComponent = navItems.find(item => item.id === activeTab)?.component || Explore
    const cliente = getLoggedCliente()

    const renderActiveComponent = () => {
        if (activeTab === 'perfil') {
            return <Profile onNavigate={setActiveTab} />
        }
        const Component = ActiveComponent
        return <Component />
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
                <div className="h-20 border-b border-slate-200 flex items-center px-6 gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <img src="/icons/icon.png" alt="MaraúReserve" />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-lg">MaraúReserve</p>
                        <p className="text-xs text-amber-600 font-bold">Guest</p>
                    </div>
                </div>

                <nav className="px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id)
                                    setSidebarOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                                    isActive
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                                {isActive && <ChevronDown className="w-4 h-4 ml-auto rotate-180" />}
                            </button>
                        )
                    })}
                </nav>

                <div className="px-4 py-6 border-t border-slate-200 mt-auto">
                    <Link
                        to="/login"
                        onClick={clearSession}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-20 border-b border-slate-200 bg-white flex items-center px-6 z-40 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-slate-500 hover:text-slate-900 transition"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{cliente?.nome?.[0] || 'H'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-50 min-h-screen">
                    {renderActiveComponent()}
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}

export default GuestLayout;
