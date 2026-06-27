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
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Lista de favoritos</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-900">Acomodações salvas</h1>
                    </div>
                    <button className="rounded-3xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600">Explorar mais</button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {favorites.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <div className="h-44 bg-gradient-to-br from-amber-100 to-amber-50 p-6">
                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 shadow-sm">Favorito</span>
                                <Heart className="h-6 w-6 text-amber-500 fill-amber-500" />
                            </div>
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                                <p className="mt-2 flex items-center gap-2 text-slate-600"><MapPin className="h-4 w-4" />{item.location}</p>
                            </div>
                        </div>
                        <div className="space-y-4 p-6">
                            <div className="flex items-center justify-between text-slate-700">
                                <span className="font-semibold text-slate-900">{item.price}</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />{item.rating}
                                </span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <button className="rounded-3xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-amber-400 hover:text-amber-700">Ver detalhes</button>
                                <button className="rounded-3xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100">Remover</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Favorites
