import { Search, MapPin, Star, Sparkles, ListChecks, Eye } from 'lucide-react'

function Dashboard() {
    const highlights = [
        {
            title: 'Busca rápida',
            description: 'Encontre hospedagens por localização, data e preferências.',
            icon: Search
        },
        {
            title: 'Mais procurados',
            description: 'Veja propriedades favoritas de outros hóspedes.',
            icon: Star
        },
        {
            title: 'Sugestões personalizadas',
            description: 'Receba recomendações de acordo com seu perfil de viagem.',
            icon: Sparkles
        },
        {
            title: 'Poupe tempo',
            description: 'Acesse reservas, favoritos e detalhes em um único lugar.',
            icon: ListChecks
        }
    ]

    const featured = [
        {
            name: 'Casa do Farol',
            location: 'Pontal do Mutá',
            details: '2 camas • Vista para o mar • Piscina',
            price: 'R$ 980 / diária'
        },
        {
            name: 'Refúgio do Cassange',
            location: 'Cassange',
            details: 'Lagoa privativa • Cozinha completa • Wi-Fi',
            price: 'R$ 540 / diária'
        },
        {
            name: 'Pousada Trilha do Sol',
            location: 'Barra Grande',
            details: 'Piscina externa • Café da manhã incluso • Acesso fácil à praia',
            price: 'R$ 460 / diária'
        }
    ]

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl bg-slate-950/80 border border-slate-700/50 p-8 shadow-xl shadow-slate-950/10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Explorar</p>
                        <h1 className="mt-3 text-3xl font-black text-white">Encontre sua próxima estadia</h1>
                        <p className="mt-2 max-w-2xl text-slate-400">Veja recomendações, filtros rápidos e propriedades com ótima avaliação.</p>
                    </div>
                    <button className="rounded-3xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400">Ver ofertas</button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {highlights.map((item) => {
                    const Icon = item.icon
                    return (
                        <div key={item.title} className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
                            <Icon className="h-6 w-6 text-amber-300" />
                            <h2 className="mt-5 text-xl font-semibold text-white">{item.title}</h2>
                            <p className="mt-3 text-slate-400">{item.description}</p>
                        </div>
                    )
                })}
            </div>

            <section className="mt-10 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Destaques</p>
                        <h2 className="mt-3 text-2xl font-bold text-white">Propriedades selecionadas</h2>
                    </div>
                    <button className="rounded-3xl border border-amber-400/30 px-5 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/10">Filtrar resultados</button>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {featured.map((item) => (
                        <div key={item.name} className="rounded-3xl bg-slate-900/80 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-semibold text-white">{item.name}</p>
                                    <p className="mt-2 text-slate-400">{item.location}</p>
                                </div>
                                <Eye className="h-5 w-5 text-amber-300" />
                            </div>
                            <p className="mt-4 text-slate-400">{item.details}</p>
                            <div className="mt-6 flex items-center justify-between text-white">
                                <span className="font-semibold">{item.price}</span>
                                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-300">Disponível</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Dashboard
