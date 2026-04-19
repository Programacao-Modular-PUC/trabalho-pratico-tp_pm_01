import { MapPin, BookOpen, Globe, Sparkles } from 'lucide-react'

function Support() {
    const steps = [
        {
            title: 'Preparar viagem',
            description: 'Saiba o que levar, como chegar e quais são as experiências mais procuradas.',
            icon: MapPin
        },
        {
            title: 'Acomodação segura',
            description: 'Veja como confirmar check-in, pedidos extras e regras da casa com antecedência.',
            icon: BookOpen
        },
        {
            title: 'Explorar atividades',
            description: 'Descubra passeios próximos, restaurantes e atrações locais.',
            icon: Globe
        },
        {
            title: 'Dicas MaraúReserve',
            description: 'Aproveite nossas recomendações para uma estadia mais tranquila e confortável.',
            icon: Sparkles
        }
    ]

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Informações</p>
                        <h1 className="mt-3 text-3xl font-black text-white">Guia do hóspede</h1>
                        <p className="mt-2 text-slate-400">Tudo que você precisa saber antes, durante e depois da sua hospedagem.</p>
                    </div>
                    <button className="rounded-3xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400">Ver políticas</button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {steps.map((item) => {
                    const Icon = item.icon
                    return (
                        <div key={item.title} className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                            <div className="flex items-center gap-3 text-amber-300">
                                <Icon className="h-6 w-6" />
                                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                            </div>
                            <p className="mt-4 text-slate-400">{item.description}</p>
                        </div>
                    )
                })}
            </div>

            <div className="mt-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                <h2 className="text-2xl font-bold text-white">O que fazer primeiro?</h2>
                <p className="mt-4 text-slate-400">Comece definindo suas datas, verificando as regras da hospedagem, e confirmando o local de check-in.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Antes da viagem</p>
                        <p className="mt-3 text-white">Verifique documentos, transporte e bagagem.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Durante a estadia</p>
                        <p className="mt-3 text-white">Consulte regras da casa e aproveite as recomendações locais.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Support
