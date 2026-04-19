import React, { useState } from 'react';
import { Calendar, Users, DollarSign, MapPin, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';

function Bookings() {
    // Dados iniciais (Mocks)
    const [bookings, setBookings] = useState([
        { id: 1, guestName: 'Maria Silva', residence: 'Pousada Taipu de Fora', checkIn: '2026-04-25T14:00', checkOut: '2026-04-28T10:00', guests: 4, totalPrice: 1350.00, status: 'confirmada', dailyRate: 450 },
        { id: 2, guestName: 'João Santos', residence: 'Chalé Barra Grande', checkIn: '2026-04-26T15:00', checkOut: '2026-04-30T13:00', guests: 3, totalPrice: 1120.00, status: 'confirmada', dailyRate: 280 },
        { id: 3, guestName: 'Ana Costa', residence: 'Reduto Mata Atlântica', checkIn: '2026-05-01T12:00', checkOut: '2026-05-05T14:00', guests: 2, totalPrice: 1800.00, status: 'pendente', dailyRate: 400 }
    ]);

    const [filter, setFilter] = useState('todos');
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    // Lógica para confirmar reserva
    const confirmBooking = (id) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'confirmada' } : b));
    };

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    
    // Cálculo de diárias para o recibo (Regra das 12h)
    const calculateNights = (inStr, outStr) => {
        const dIn = new Date(inStr);
        const dOut = new Date(outStr);
        let nights = Math.ceil((dOut - dIn) / (1000 * 60 * 60 * 24));
        if (dOut.getHours() > 12) nights += 1; // Saída após as 12h adiciona nova diária
        return nights;
    };

    const filteredBookings = bookings.filter(b => filter === 'todos' || b.status === filter);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Dinâmico */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Painel de Reservas</h1>
                        <p className="text-slate-400">Controle de hospedagens - Maraú, BA</p>
                    </div>
                    <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                        {['todos', 'confirmada', 'pendente'].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === f ? 'bg-amber-500 text-black' : 'hover:text-white'}`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards de Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatusCard title="Total" value={bookings.length} icon={<Calendar className="text-blue-400"/>} />
                    <StatusCard title="Confirmadas" value={bookings.filter(b=>b.status==='confirmada').length} icon={<CheckCircle className="text-green-400"/>} color="text-green-400" />
                    <StatusCard title="Pendentes" value={bookings.filter(b=>b.status==='pendente').length} icon={<AlertCircle className="text-yellow-400"/>} color="text-yellow-400" />
                </div>

                {/* Lista de Reservas */}
                <div className="grid gap-4">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 hover:bg-slate-800/60 transition group">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Hóspede</span>
                                    <h3 className="text-lg font-bold text-white">{booking.guestName}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <MapPin size={14}/> {booking.residence}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                    <div>
                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Período</span>
                                        <p className="text-sm font-medium">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Total</span>
                                        <p className="text-lg font-black text-amber-500">{formatCurrency(booking.totalPrice)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {booking.status === 'pendente' ? (
                                            <button 
                                                onClick={() => confirmBooking(booking.id)}
                                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
                                            >
                                                Confirmar
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setSelectedReceipt(booking)}
                                                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
                                            >
                                                <FileText size={14}/> Recibo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Recibo (Atende o Item 8 do Enunciado) */}
            {selectedReceipt && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="bg-amber-500 p-6 flex justify-between items-center text-black">
                            <h2 className="font-black text-xl uppercase tracking-tighter">Recibo de Hospedagem</h2>
                            <button onClick={() => setSelectedReceipt(null)}><X /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="border-b border-dashed border-slate-300 pb-4">
                                <p className="text-xs uppercase text-slate-500 font-bold mb-1">Cliente</p>
                                <p className="font-bold text-lg">{selectedReceipt.guestName}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500 font-medium">Data e horário de entrada:</p>
                                    <p className="font-bold">{new Date(selectedReceipt.checkIn).toLocaleString('pt-BR')}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 font-medium">Data e horário de saída:</p>
                                    <p className="font-bold">{new Date(selectedReceipt.checkOut).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-600">Número de diárias:</span>
                                    <span className="font-bold">{calculateNights(selectedReceipt.checkIn, selectedReceipt.checkOut)}</span>
                                </div>
                                <div className="flex justify-between text-xl border-t border-slate-200 pt-2">
                                    <span className="font-black">Total à pagar:</span>
                                    <span className="font-black text-amber-600">{formatCurrency(selectedReceipt.totalPrice)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => window.print()}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition"
                            >
                                Imprimir Recibo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-componente para os cards de topo
function StatusCard({ title, value, icon, color = "text-white" }) {
    return (
        <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">{title}</span>
                {icon}
            </div>
            <span className={`text-3xl font-black ${color}`}>{value}</span>
        </div>
    );
}

export default Bookings;