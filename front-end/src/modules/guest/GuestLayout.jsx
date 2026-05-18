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
    ChevronDown
} from 'lucide-react'
import Explore from './pages/Dashboard'
import Reservations from './pages/Reservations'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Info from './pages/Support'
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

    return (
        <div className="flex min-h-screen bg-black">
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-black border-r border-slate-700/50 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
                <div className="h-20 border-b border-slate-700/50 flex items-center px-6 gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <img src="/icons/icon.png" alt="MaraúReserve" />
                    </div>
                    <div>
                        <p className="font-black text-white text-lg">MaraúReserve</p>
                        <p className="text-xs text-amber-400 font-bold">Guest</p>
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
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                                {isActive && <ChevronDown className="w-4 h-4 ml-auto rotate-180" />}
                            </button>
                        )
                    })}
                </nav>

                <div className="px-4 py-6 border-t border-slate-700/50 mt-auto">
                    <Link
                        to="/login"
                        onClick={clearSession}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-20 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-black flex items-center px-6 z-40">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-gray-400 hover:text-white transition"
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

                <div className="flex-1 overflow-auto bg-[#070707] min-h-screen">
                    <ActiveComponent />
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}

export default GuestLayout;
