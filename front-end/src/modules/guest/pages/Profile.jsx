import { Mail, MapPin, Phone, Shield, User } from 'lucide-react'
import { getLoggedCliente } from '../../../services/auth'

function Profile() {
    const cliente = getLoggedCliente()

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Perfil do hospede</p>
                        <h1 className="mt-3 text-3xl font-black text-white">{cliente?.nome || 'Cliente'}</h1>
                        <p className="mt-2 text-slate-400">Dados carregados do cadastro em /clientes.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-700/50 p-4 text-center">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Status</p>
                        <strong className="mt-2 block text-xl text-white">{cliente?.id ? 'Logado' : 'Sem sessao'}</strong>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_0.6fr]">
                <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/15">
                    <div className="space-y-6">
                        <ReadOnlyField icon={User} label="Nome completo" value={cliente?.nome || '-'} />
                        <ReadOnlyField icon={Mail} label="E-mail" value={cliente?.email || '-'} />
                        <ReadOnlyField icon={Phone} label="Telefone" value={cliente?.telefone || '-'} />
                        <ReadOnlyField icon={MapPin} label="Endereco" value={cliente?.endereco || '-'} />
                        <ReadOnlyField icon={Shield} label="CPF" value={cliente?.cpf || '-'} />
                    </div>
                </div>

                <aside className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
                    <h2 className="text-xl font-bold text-white">Acesso do cliente</h2>
                    <p className="mt-4 text-slate-400">
                        O login usa o e-mail cadastrado no endpoint de clientes. Como o backend da sprint nao possui senha, o front valida a sessao pelo cadastro existente.
                    </p>
                    <div className="mt-6 rounded-3xl bg-slate-900/80 p-4">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Identificador</p>
                        <p className="mt-2 text-white">Cliente #{cliente?.id || '-'}</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}

function ReadOnlyField({ icon: Icon, label, value }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-200">{label}</label>
            <div className="mt-3 flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                <Icon className="h-5 w-5 text-amber-400" />
                <span className="w-full text-white">{value}</span>
            </div>
        </div>
    )
}

export default Profile
