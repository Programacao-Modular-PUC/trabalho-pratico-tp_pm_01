import { User, Mail, Phone, Shield } from 'lucide-react'

function Profile() {
    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Perfil do hóspede</p>
                        <h1 className="mt-3 text-3xl font-black text-white">Minhas informações</h1>
                        <p className="mt-2 text-slate-400">Atualize seus dados de contato, preferências e segurança.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-700/50 p-4 text-center">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Status</p>
                        <strong className="mt-2 block text-xl text-white">Perfil completo</strong>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_0.6fr]">
                <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/15">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-200">Nome completo</label>
                            <div className="mt-3 flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                                <User className="h-5 w-5 text-amber-400" />
                                <input className="w-full bg-transparent outline-none text-white placeholder:text-slate-500" placeholder="Ana Silva" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-200">E-mail</label>
                            <div className="mt-3 flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                                <Mail className="h-5 w-5 text-amber-400" />
                                <input className="w-full bg-transparent outline-none text-white placeholder:text-slate-500" placeholder="ana.silva@email.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-200">Telefone</label>
                            <div className="mt-3 flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                                <Phone className="h-5 w-5 text-amber-400" />
                                <input className="w-full bg-transparent outline-none text-white placeholder:text-slate-500" placeholder="(71) 99999-9999" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-200">Segurança</label>
                            <div className="mt-3 flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                                <Shield className="h-5 w-5 text-amber-400" />
                                <input className="w-full bg-transparent outline-none text-white placeholder:text-slate-500" placeholder="Alterar senha" />
                            </div>
                        </div>

                        <button className="rounded-3xl bg-amber-500 px-6 py-4 text-sm font-semibold text-black transition hover:bg-amber-400">Salvar alterações</button>
                    </form>
                </div>

                <aside className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                    <h2 className="text-xl font-bold text-white">Preferências</h2>
                    <p className="mt-4 text-slate-400">Personalize suas próximas estadias e receba recomendações de acordo com seu perfil.</p>
                    <div className="mt-6 space-y-4">
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Tipo de viagem</p>
                            <p className="mt-2 text-white">Romântica / Família / Aventura</p>
                        </div>
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Amenidades preferidas</p>
                            <p className="mt-2 text-white">Wi-Fi, Piscina, Vista para o mar</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Profile
