import { useState } from 'react'
import { AlertCircle, CheckCircle2, Home, Plus } from 'lucide-react'
import { api } from '../../../services/api'
import { getHostEmail } from '../../../services/auth'

const buildInitialForm = (hostEmail = '') => ({
    endereco: '',
    numero: '',
    bairro: '',
    cep: '',
    telefone: '',
    email: hostEmail
})

function AddResidence() {
    const hostEmail = getHostEmail()
    const [formData, setFormData] = useState(() => buildInitialForm(hostEmail || ''))
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setError('')

        try {
            await api.createResidencia({
                ...formData,
                email: hostEmail || formData.email
            })
            setFormData(buildInitialForm(hostEmail || ''))
            setMessage('Residencia cadastrada com sucesso.')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-8 pb-12 min-h-screen">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2">Adicionar Nova Residencia</h1>
                    <p className="text-gray-400">Cadastre a propriedade que recebera quartos da Sprint 2.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                            <Home className="text-amber-400" />
                            Dados da Residencia
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Endereco" name="endereco" value={formData.endereco} onChange={handleInputChange} placeholder="Rua, avenida ou praia" />
                            <Field label="Numero" name="numero" value={formData.numero} onChange={handleInputChange} placeholder="Ex: 120" />
                            <Field label="Bairro" name="bairro" value={formData.bairro} onChange={handleInputChange} placeholder="Ex: Barra Grande" />
                            <Field label="CEP" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="45520-000" />
                            <Field label="Telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(73) 99999-9999" />
                            <Field label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder={hostEmail || 'contato@residencia.com'} readOnly={Boolean(hostEmail)} />
                        </div>
                    </div>

                    {message && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex gap-3 text-green-300">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{message}</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3 text-red-300">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-60 text-black py-3 rounded-xl font-black text-lg transition flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        {loading ? 'Salvando...' : 'Adicionar Residencia'}
                    </button>
                </form>
            </div>
        </div>
    )
}

function Field({ label, name, value, onChange, placeholder, type = 'text', readOnly = false }) {
    return (
        <div>
            <label className="block text-white font-bold mb-2">{label} *</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition ${readOnly ? 'opacity-80 cursor-not-allowed' : ''}`}
                required
            />
        </div>
    )
}

export default AddResidence
