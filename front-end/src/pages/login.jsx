import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { api } from '../services/api'
import { saveSession, HOST_TEST_EMAIL, GUEST_TEST_EMAIL } from '../services/auth'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        if (email === HOST_TEST_EMAIL && password === 'testhost') {
            saveSession({ role: 'host', email: HOST_TEST_EMAIL, nome: 'Anfitriao Teste' })
            navigate('/host')
            setLoading(false)
            return
        }

        if (email === GUEST_TEST_EMAIL && password === 'testguest') {
            try {
                const clientes = await api.listClientes()
                const cliente = clientes.find((item) => item.email?.toLowerCase() === GUEST_TEST_EMAIL)
                saveSession({ role: 'guest', cliente: cliente || { nome: 'Cliente Visitante', email: GUEST_TEST_EMAIL } })
                navigate('/guest')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
            return
        }

        try {
            const clientes = await api.listClientes()
            const cliente = clientes.find((item) => item.email?.toLowerCase() === email.toLowerCase())

            if (!cliente) {
                setError('Cliente nao encontrado. Cadastre-se antes de entrar.')
                return
            }

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
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tighter mb-6">
                                Bem-vindo de volta ao <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">Marau Reserve</span>
                            </h1>
                            <p className="max-w-xl text-gray-400 text-lg leading-relaxed font-medium">
                                Entre com seu email cadastrado para reservar quartos, acompanhar estadias e continuar sua viagem por Marau.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[3rem] bg-[#0d0d0f]/90 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl p-10 sm:p-12">
                        <div className="mb-8">
                            <img src="/icons/icon.png" alt="" className="w-16 h-16 mx-auto" />
                            <h2 className="mt-4 text-3xl font-black ">Acesse sua conta</h2>
                            <p className="text-gray-400 mt-3">Clientes entram pelo email cadastrado. Hosts usam a credencial de teste.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <label className="block space-y-3">
                                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                                    <Mail size={16} /> E-mail
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seuemail@gmail.com"
                                    className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                    required
                                />
                            </label>

                            <label className="block space-y-3">
                                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                                    <Lock size={16} /> Senha
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Senha opcional para clientes"
                                    className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                />
                            </label>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <Link to="/register" className="text-sm text-amber-400 font-bold hover:text-amber-300">
                                    Criar conta de cliente
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-black font-black uppercase tracking-[0.2em] transition hover:bg-amber-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                                >
                                    {loading ? 'Entrando...' : 'Entrar'}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 p-5 text-sm">
                            <p className="text-amber-400 font-bold mb-2">Acessos de teste:</p>
                            <p className="text-gray-300"><strong>Cliente demo:</strong> acessoguest@gmail.com / testguest</p>
                            <p className="text-gray-300"><strong>Host:</strong> acessohost@gmail.com / testhost</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
