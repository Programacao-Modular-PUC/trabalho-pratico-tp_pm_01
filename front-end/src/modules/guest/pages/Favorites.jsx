import { Heart, Star, MapPin } from 'lucide-react'

function Favorites() {
    const favorites = [
        {
            id: 1,
            title: 'Suíte Roots',
            location: 'Três Coqueiros',
            price: 'R$ 380 / diária',
            rating: '4.7'
        },
        {
            id: 2,
            title: 'Casa do Farol',
            location: 'Pontal do Mutá',
            price: 'R$ 980 / diária',
            rating: '4.9'
        },
        {
            id: 3,
            title: 'Pousada Trilha do Sol',
            location: 'Barra Grande',
            price: 'R$ 460 / diária',
            rating: '4.8'
        }
    ]

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Lista de favoritos</p>
                        <h1 className="mt-3 text-3xl font-black text-white">Acomodações salvas</h1>
                    </div>
                    <button className="rounded-3xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-400">Explorar mais</button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {favorites.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-950/80 shadow-xl shadow-slate-950/20">
                        <div className="h-44 bg-[linear-gradient(180deg,rgba(251,191,36,0.18)_0%,rgba(15,23,42,0.75)_100%)] p-6 text-white">
                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200">Favorito</span>
                                <Heart className="h-6 w-6 text-amber-300" />
                            </div>
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold">{item.title}</h2>
                                <p className="mt-2 flex items-center gap-2 text-slate-200"><MapPin className="h-4 w-4" />{item.location}</p>
                            </div>
                        </div>
                        <div className="space-y-4 p-6">
                            <div className="flex items-center justify-between text-slate-300">
                                <span className="font-semibold text-white">{item.price}</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-sm text-amber-300">
                                    <Star className="h-4 w-4" />{item.rating}
                                </span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <button className="rounded-3xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-amber-400 hover:text-white">Ver detalhes</button>
                                <button className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20">Remover</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Favorites
