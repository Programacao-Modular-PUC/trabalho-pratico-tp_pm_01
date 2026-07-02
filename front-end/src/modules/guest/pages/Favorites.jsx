import { Heart, Star, MapPin } from 'lucide-react'
import { TEST_GUEST } from '../../../services/auth'

function Favorites() {
    const favorites = TEST_GUEST.favoritos

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Lista de favoritos</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-900">Acomodacoes salvas</h1>
                        <p className="mt-2 text-slate-600">Quartos relacionados ao perfil demo {TEST_GUEST.cliente.nome} nas residencias do host de teste.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {favorites.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <div className="relative h-44 overflow-hidden">
                            <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 shadow-sm">Favorito</span>
                                <Heart className="h-6 w-6 text-amber-500 fill-amber-500" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                                <p className="mt-2 flex items-center gap-2 text-slate-100 text-sm"><MapPin className="h-4 w-4" />{item.location}</p>
                            </div>
                        </div>
                        <div className="space-y-4 p-6">
                            <div className="flex items-center justify-between text-slate-700">
                                <span className="font-semibold text-slate-900">R$ {item.price.toLocaleString('pt-BR')} / diaria</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />{item.rating}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Favorites
