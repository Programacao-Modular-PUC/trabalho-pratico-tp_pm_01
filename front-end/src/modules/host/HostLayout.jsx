import React, { useState } from 'react';
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
    Bell
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Residences from './pages/Residences';
import AddResidence from './pages/AddResidence';
import Bookings from './pages/Bookings';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Support from './pages/Support';
import { Link } from 'react-router-dom';
import { clearSession, getLoggedHost } from '../../services/auth';

function HostLayout() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            component: Dashboard
        },
        {
            id: 'residences',
            label: 'Minhas Residências',
            icon: Home,
            component: Residences
        },
        {
            id: 'bookings',
            label: 'Agendamentos',
            icon: Calendar,
            component: Bookings
        },
        {
            id: 'notifications',
            label: 'Notificacoes',
            icon: Bell,
            component: Notifications
        },
        {
            id: 'add-residence',
            label: 'Adicionar Residência',
            icon: Plus,
            component: AddResidence
        },
        {
            id: 'support',
            label: 'Suporte',
            icon: MessageSquare,
            component: Support
        },
        {
            id: 'settings',
            label: 'Configurações',
            icon: SettingsIcon,
            component: Settings
        }
    ];

    const ActiveComponent = navItems.find(item => item.id === activeTab)?.component || Dashboard;
    const host = getLoggedHost();

    return (
        <div className="flex h-screen bg-black">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-black border-r border-slate-700/50 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
                {/* Logo */}
                <div className="h-20 border-b border-slate-700/50 flex items-center px-6 gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                       <img src="/icons/icon.png" alt="MaraúReserve" />
                    </div>
                    <div>
                        <p className="font-black text-white text-lg">MaraúReserve</p>
                        <p className="text-xs text-amber-400 font-bold">Host</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false); // Fecha sidebar em mobile
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
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-4 py-6 border-t border-slate-700/50 mt-auto space-y-3">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-semibold">
                        <LogOut className="w-5 h-5" />
                        <Link to="/login" onClick={clearSession} className="text-red-400 hover:text-red-300">
                            Sair
                        </Link>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
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
                            <span className="text-white font-bold">{host?.nome?.[0] || host?.email?.[0]?.toUpperCase() || 'H'}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <ActiveComponent />
                </div>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}

export default HostLayout;
