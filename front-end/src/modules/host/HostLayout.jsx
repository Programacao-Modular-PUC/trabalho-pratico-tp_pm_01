import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    LayoutDashboard,
    Home,
    Calendar,
    Plus,
    MessageSquare,
    Settings as SettingsIcon,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Bell,
    BarChart3
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Residences from './pages/Residences'
import AddResidence from './pages/AddResidence'
import Bookings from './pages/Bookings'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Support from './pages/Support'
import Relatorios from './pages/Relatorios'
import { clearSession, ensureHostSession, getLoggedHost } from '../../services/auth'

function HostLayout() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        ensureHostSession()
    }, [])

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: Dashboard },
        { id: 'residences', label: 'Minhas Residencias', icon: Home, component: Residences },
        { id: 'bookings', label: 'Agendamentos', icon: Calendar, component: Bookings },
        { id: 'notifications', label: 'Notificacoes', icon: Bell, component: Notifications },
        { id: 'relatorios', label: 'Relatorios', icon: BarChart3, component: Relatorios },
        { id: 'add-residence', label: 'Adicionar Residencia', icon: Plus, component: AddResidence },
        { id: 'support', label: 'Suporte', icon: MessageSquare, component: Support },
        { id: 'settings', label: 'Configuracoes', icon: SettingsIcon, component: Settings }
    ]

    const ActiveComponent = navItems.find((item) => item.id === activeTab)?.component || Dashboard
    const host = getLoggedHost()

    return (
        <div className="flex min-h-screen bg-slate-100">
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
                <div className="h-20 border-b border-slate-200 flex items-center px-6 gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <img src="/icons/icon.png" alt="MarauReserve" />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-lg">MarauReserve</p>
                        <p className="text-xs text-amber-600 font-bold">Host</p>
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
                    <div className="text-right mr-4 hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">{host?.nome || 'Anfitriao'}</p>
                        <p className="text-xs text-slate-500">{host?.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{host?.nome?.[0] || host?.email?.[0]?.toUpperCase() || 'H'}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-50 min-h-screen">
                    <ActiveComponent />
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}

export default HostLayout
