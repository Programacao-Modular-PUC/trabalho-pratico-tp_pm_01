import { Mail, MapPin, Phone, Shield, User, History } from 'lucide-react'
import { getLoggedCliente } from '../../../services/auth'

function Profile({ onNavigate }) {
    const cliente = getLoggedCliente()

    return (
        <div className="p-6">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Perfil do hospede</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-900">{cliente?.nome || 'Cliente'}</h1>
                        <p className="mt-2 text-slate-600">Dados carregados do cadastro em /clientes.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Status</p>
                        <strong className="mt-2 block text-xl text-slate-900">{cliente?.id ? 'Logado' : 'Sem sessao'}</strong>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_0.6fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="space-y-6">
                        <ReadOnlyField icon={User} label="Nome completo" value={cliente?.nome || '-'} />
                        <ReadOnlyField icon={Mail} label="E-mail" value={cliente?.email || '-'} />
                        <ReadOnlyField icon={Phone} label="Telefone" value={cliente?.telefone || '-'} />
                        <ReadOnlyField icon={MapPin} label="Endereco" value={cliente?.endereco || '-'} />
                        <ReadOnlyField icon={Shield} label="CPF" value={cliente?.cpf || '-'} />
                    </div>
                </div>

                <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">Acesso do cliente</h2>
                    <p className="mt-4 text-slate-600">
                        Consulte seu historico completo de hospedagens ou gerencie reservas ativas pelo menu lateral.
                    </p>
                    {onNavigate && (
                        <button
                            onClick={() => onNavigate('historico')}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-3xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                            <History className="h-4 w-4" />
                            Ver historico de hospedagens
                        </button>
                    )}
                    <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Identificador</p>
                        <p className="mt-2 font-medium text-slate-900">Cliente #{cliente?.id || '-'}</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}

function ReadOnlyField({ icon: Icon, label, value }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700">{label}</label>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Icon className="h-5 w-5 text-amber-600" />
                <span className="w-full text-slate-900">{value}</span>
            </div>
        </div>
    )
}

export default Profile
