import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, ArrowRight, Phone, MapPin, IdCard } from 'lucide-react'
import { api } from '../services/api'
import { saveSession } from '../services/auth'

const initialForm = {
    nome: '',
    cpf: '',
    endereco: '',
    telefone: '',
    email: ''
}

function Register() {
    const [form, setForm] = useState(initialForm)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            const cliente = await api.createCliente({
                ...form,
                cpf: form.cpf.replace(/\D/g, '')
            })
            saveSession({ role: 'guest', cliente })
            navigate('/guest')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-400 selection:text-black antialiased">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                    <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[5%] right-[-5%] w-[45%] h-[45%] bg-amber-600/10 blur-[150px] rounded-full" />
                </div>
            </div>

            <div className="min-h-screen flex items-center justify-center px-6 py-24">
                <div className="w-full max-w-6xl grid gap-12 lg:grid-cols-[1.3fr_1fr] items-center">
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tighter mb-6">
                            Crie sua conta no <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">Marau Reserve</span>
                        </h1>
                       
                    </div>

                    <div className="rounded-[3rem] bg-[#0d0d0f]/90 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl p-10 sm:p-12">
                        <div className="mb-8">
                            <img src="/icons/icon.png" alt="" className="w-16 h-16 mx-auto" />
                            <h2 className="mt-4 text-3xl font-black">Abra sua conta</h2>
                            <p className="text-gray-400 mt-3">Venha viver essa experiência!</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <Field icon={<UserPlus size={16} />} label="Nome completo" name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" />
                            <Field icon={<IdCard size={16} />} label="CPF" name="cpf" value={form.cpf} onChange={handleChange} placeholder="Somente numeros" maxLength={14} />
                            <Field icon={<MapPin size={16} />} label="Endereco" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, numero, bairro" />
                            <Field icon={<Phone size={16} />} label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(73) 99999-9999" />
                            <Field icon={<Mail size={16} />} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="seuemail@gmail.com" />

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
                                <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300">
                                    Ja tenho login
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-black font-black uppercase tracking-[0.2em] transition hover:bg-amber-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                                >
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Field({ icon, label, name, value, onChange, placeholder, type = 'text', maxLength }) {
    return (
        <label className="block space-y-3">
            <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                {icon} {label}
            </span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                required
            />
        </label>
    )
}

export default Register
