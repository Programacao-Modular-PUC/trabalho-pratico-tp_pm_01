import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        // Aqui você pode chamar a API de login ou validar o formulário.
        console.log('Login:', { email, password })
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
                                Bem-vindo de volta ao <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">Maraú Reserve</span>
                            </h1>
                            <p className="max-w-xl text-gray-400 text-lg leading-relaxed font-medium">
                                Entre com sua conta para gerenciar reservas, explorar destinos e continuar sua jornada rumo ao paraíso de Maraú.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[3rem] bg-[#0d0d0f]/90 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl p-10 sm:p-12">
                        <div className="mb-8">
                            <img src="/icons/icon.png" alt="" className="w-16 h-16 mx-auto" />
                            <h2 className="mt-4 text-3xl font-black ">Acesse sua conta</h2>
                            <p className="text-gray-400 mt-3">Digite seus dados abaixo para continuar.</p>
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
                                    placeholder="••••••••"
                                    className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                    required
                                />
                            </label>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-gray-400 hover:text-white transition">
                                    <Link to="/forgot-password" className="text-amber-400 font-bold hover:text-amber-300">
                                        Esqueceu sua senha?
                                    </Link>

                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-black font-black uppercase tracking-[0.2em] transition hover:bg-amber-300 hover:scale-[1.02] active:scale-95"
                                >
                                    Entrar
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 rounded-3xl bg-white/5 border border-white/10 p-5 text-sm text-gray-400">
                            Ainda não tem acesso?
                            <Link to="/register" className="text-amber-400 font-bold hover:text-amber-300 ml-1">
                                Crie sua conta agora.
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
