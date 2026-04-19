import { Calendar, MapPin, Users, CheckCircle, XCircle } from 'lucide-react'

function Reservations() {
    const reservations = [
        {
            id: 1,
            title: 'Casa dos Pés na Areia',
            location: 'Barra Grande',
            dates: '20 jun - 25 jun',
            guests: '2 hóspedes',
            price: 'R$ 3.100',
            status: 'Confirmada'
        },
        {
            id: 2,
            title: 'Refúgio do Cassange',
            location: 'Cassange',
            dates: '05 jul - 09 jul',
            guests: '4 hóspedes',
            price: 'R$ 2.160',
            status: 'Aguardando',
            pending: true
        },
        {
            id: 3,
            title: 'Bangalô da Maraú',
            location: 'Pontal do Mutá',
            dates: '12 ago - 15 ago',
            guests: '2 hóspedes',
            price: 'R$ 1.860',
            status: 'Finalizada'
        }
    ]

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                <h1 className="text-3xl font-black text-white">Minhas reservas</h1>
                <p className="mt-3 max-w-2xl text-slate-400">Acompanhe seus agendamentos, verifique o status e acesse informações da hospedagem.</p>
            </div>

            <div className="space-y-6">
                {reservations.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/15">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{item.status}</p>
                                <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
                                <p className="text-slate-400">{item.location}</p>
                            </div>
                            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${item.status === 'Confirmada' ? 'bg-emerald-500/15 text-emerald-300' : item.status === 'Aguardando' ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-700/70 text-slate-300'}`}>{item.status}</span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-3xl bg-slate-900/80 p-4">
                                <div className="flex items-center gap-2 text-amber-400"><Calendar className="h-4 w-4" /><span className="text-sm uppercase tracking-[0.25em]">Datas</span></div>
                                <p className="mt-3 text-white">{item.dates}</p>
                            </div>
                            <div className="rounded-3xl bg-slate-900/80 p-4">
                                <div className="flex items-center gap-2 text-amber-400"><MapPin className="h-4 w-4" /><span className="text-sm uppercase tracking-[0.25em]">Local</span></div>
                                <p className="mt-3 text-white">{item.location}</p>
                            </div>
                            <div className="rounded-3xl bg-slate-900/80 p-4">
                                <div className="flex items-center gap-2 text-amber-400"><Users className="h-4 w-4" /><span className="text-sm uppercase tracking-[0.25em]">Hóspedes</span></div>
                                <p className="mt-3 text-white">{item.guests}</p>
                            </div>
                            <div className="rounded-3xl bg-slate-900/80 p-4">
                                <div className="flex items-center gap-2 text-amber-400"><CheckCircle className="h-4 w-4" /><span className="text-sm uppercase tracking-[0.25em]">Total</span></div>
                                <p className="mt-3 text-white">{item.price}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button className="rounded-3xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-400">Ver detalhes</button>
                            <button className="rounded-3xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400 hover:text-white">Solicitar alteração</button>
                            {item.status === 'Aguardando' && (
                                <button className="rounded-3xl bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20">Cancelar</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-center gap-3 text-slate-400">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <p>Reserve com antecedência e confirme seus dados para garantir sua próxima viagem.</p>
                </div>
            </div>
        </div>
    )
}

export default Reservations
