import React, { useState } from 'react';
import {
    DollarSign,
    Calendar,
    Users,
    TrendingUp,
    BarChart3,
    Star,
    Eye
} from 'lucide-react';

function Dashboard() {
    const [stats] = useState({
        totalRevenue: 15250.00,
        monthRevenue: 3500.00,
        occupancyRate: 75,
        totalGuests: 45,
        activeListings: 3,
        upcomingReservations: 4
    });

    const [recentStays] = useState([
        {
            id: 1,
            guestName: 'Lucas Ferreira',
            residence: 'Casa à Beira-Mar Premium',
            checkIn: '2025-04-10',
            checkOut: '2025-04-15',
            rating: 5,
            revenue: 2700.00
        },
        {
            id: 2,
            guestName: 'Carla Mendes',
            residence: 'Chalé Aconchegante na Serra',
            checkIn: '2025-04-05',
            checkOut: '2025-04-08',
            rating: 4.5,
            revenue: 840.00
        },
        {
            id: 3,
            guestName: 'Roberto Gomes',
            residence: 'Apartamento Centro Histórico',
            checkIn: '2025-03-28',
            checkOut: '2025-03-31',
            rating: 4,
            revenue: 450.00
        }
    ]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2">Bem-vindo ao Dashboard</h1>
                    <p className="text-gray-400">Aqui você pode acompanhar suas estatísticas e performance</p>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-3 rounded-xl group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-all">
                                <DollarSign className="w-6 h-6 text-amber-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-gray-400 text-sm mb-1">Receita Total</p>
                        <h3 className="text-3xl font-black text-white mb-2">{formatCurrency(stats.totalRevenue)}</h3>
                        <p className="text-xs text-green-400">+12% este mês</p>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-3 rounded-xl group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
                                <Calendar className="w-6 h-6 text-blue-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-gray-400 text-sm mb-1">Receita este Mês</p>
                        <h3 className="text-3xl font-black text-white mb-2">{formatCurrency(stats.monthRevenue)}</h3>
                        <p className="text-xs text-green-400">+8% semana passada</p>
                    </div>

                    {/* Occupancy Rate */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-3 rounded-xl group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all">
                                <BarChart3 className="w-6 h-6 text-purple-400" />
                            </div>
                            <span className="text-xl font-bold text-purple-400">{stats.occupancyRate}%</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">Taxa de Ocupação</p>
                        <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all"
                                style={{ width: `${stats.occupancyRate}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500">Bem acima da média</p>
                    </div>

                    {/* Total Guests */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-pink-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 p-3 rounded-xl group-hover:from-pink-500/30 group-hover:to-pink-600/30 transition-all">
                                <Users className="w-6 h-6 text-pink-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-gray-400 text-sm mb-1">Total de Hóspedes</p>
                        <h3 className="text-3xl font-black text-white mb-2">{stats.totalGuests}</h3>
                        <p className="text-xs text-green-400">+5 este mês</p>
                    </div>
                </div>

                {/* Recent Stays */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                    <h2 className="text-2xl font-black text-white mb-6">Estadias Recentes</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentStays.map((stay) => (
                            <div
                                key={stay.id}
                                className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 hover:border-amber-500/30 transition-all"
                            >
                                <p className="font-bold text-white mb-1">{stay.guestName}</p>
                                <p className="text-sm text-gray-400 mb-3">{stay.residence}</p>
                                <p className="text-xs text-gray-500 mb-4">
                                    {formatDate(stay.checkIn)} - {formatDate(stay.checkOut)}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${
                                                    i < stay.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="font-bold text-amber-400">{formatCurrency(stay.revenue)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
