import React from 'react'
import {
    Award,
    CheckCircle,
    Code,
    Database,
    Globe,
    Server,
    Users
} from 'lucide-react'
import { usePublicTheme } from '../hooks/usePublicTheme'

function About() {
    const t = usePublicTheme()
    return (
        <div className={t.page}>
            <header className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="h-px w-12 bg-amber-400"></span>
                            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em]">Sobre o projeto</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                            Maraú <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">Reserve</span>
                        </h1>
                        <p className={`text-lg lg:text-xl ${t.muted} leading-relaxed max-w-xl font-medium mb-12`}>
                            Um sistema completo de reserva de hospedagens desenvolvido como trabalho prático para a disciplina de Programação Modular.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <a href="#tecnologias" className="px-10 py-5 bg-amber-400 text-black font-black rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition active:scale-95">
                                Ver tecnologias
                            </a>
                            <a href="#desenvolvedores" className={`px-10 py-5 font-black rounded-2xl transition backdrop-blur-md ${t.secondaryBtn}`}>
                                Conhecer equipe
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative">
                        <div className="space-y-4 pt-12">
                            <img src="/img/praia_de_taipu_de_fora.jpg" className={`rounded-[2.5rem] h-80 w-full object-cover ${t.imageBorder}`} alt="Praia" />
                            <img src="/img/praia_do_cassange.jpg" className={`rounded-[2.5rem] h-56 w-full object-cover ${t.imageBorder}`} alt="Lagoa" />
                        </div>
                        <div className="space-y-4">
                            <img src="/img/praia-do-muta.jpg" className={`rounded-[2.5rem] h-56 w-full object-cover ${t.imageBorder}`} alt="Por do sol" />
                            <img src="/img/praia_de_tres_coqueiros.jpg" className={`rounded-[2.5rem] h-80 w-full object-cover ${t.imageBorder}`} alt="Corais" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-32 space-y-32">
                <section className="text-center">
                    <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter">
                        O que é o <span className="text-amber-400">Maraú Reserve</span>?
                    </h2>
                    <p className={`text-lg ${t.muted} leading-relaxed max-w-4xl mx-auto font-medium`}>
                        Uma plataforma completa de reserva de hospedagens localizada na Península de Maraú, Bahia.
                        Desenvolvido como projeto acadêmico para demonstrar conceitos avançados de programação modular,
                        arquitetura de software e desenvolvimento full-stack.
                    </p>
                </section>

                <section id="tecnologias" className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h3 className="text-4xl font-black mb-8 tracking-tighter">Tecnologias Utilizadas</h3>
                        <p className={`${t.muted} leading-relaxed text-lg mb-12 font-medium`}>
                            O projeto foi desenvolvido utilizando uma stack moderna e robusta,
                            seguindo as melhores práticas de desenvolvimento de software.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className={`p-6 rounded-[2rem] ${t.card}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center">
                                        <Globe className="text-amber-400" size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold">Front-end</h4>
                                </div>
                                <p className={`${t.mutedSoft} text-sm font-medium`}>React + Vite + Tailwind CSS</p>
                            </div>

                            <div className={`p-6 rounded-[2rem] ${t.card}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center">
                                        <Server className="text-amber-400" size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold">Back-end</h4>
                                </div>
                                <p className={`${t.mutedSoft} text-sm font-medium`}>Spring Boot (Java)</p>
                            </div>

                            <div className={`p-6 rounded-[2rem] ${t.card}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center">
                                        <Database className="text-amber-400" size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold">Banco de Dados</h4>
                                </div>
                                <p className={`${t.mutedSoft} text-sm font-medium`}>MySQL</p>
                            </div>

                            <div className={`p-6 rounded-[2rem] ${t.card}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center">
                                        <Code className="text-amber-400" size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold">Arquitetura</h4>
                                </div>
                                <p className={`${t.mutedSoft} text-sm font-medium`}>REST API + MVC</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-10 rounded-[4rem] relative overflow-hidden ${t.sectionCard}`}>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/5 blur-[100px] rounded-full"></div>

                        <div className="relative z-10">
                            <h4 className="text-2xl font-black mb-6">Características Técnicas</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="text-amber-400" size={20} />
                                    <span className={`${t.body} font-medium`}>Programação Orientada a Objetos</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="text-amber-400" size={20} />
                                    <span className={`${t.body} font-medium`}>API RESTful</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="text-amber-400" size={20} />
                                    <span className={`${t.body} font-medium`}>Persistência em Banco Relacional</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="text-amber-400" size={20} />
                                    <span className={`${t.body} font-medium`}>Interface Responsiva</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="text-amber-400" size={20} />
                                    <span className={`${t.body} font-medium`}>Arquitetura Desacoplada</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="desenvolvedores" className="text-center">
                    <h3 className="text-4xl font-black mb-8 tracking-tighter">Desenvolvedores</h3>
                    <p className={`${t.muted} leading-relaxed text-lg mb-16 font-medium max-w-2xl mx-auto`}>
                        Conheça a equipe responsável pelo desenvolvimento do Maraú Reserve,
                        um projeto acadêmico que une tecnologia e paixão pela natureza.
                    </p>

                    <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <div className={`p-8 rounded-[2rem] ${t.card}`}>
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                <img src="/img/imagem_italo.jpg" alt="Ítalo Eduardo" className="w-full h-full object-cover"/>
                                <Users className="text-white" size={32} style={{ display: 'none' }} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Ítalo Eduardo</h4>
                            <p className="text-amber-400 text-sm font-medium mb-3">Desenvolvedor Full-Stack</p>
                            <p className={`${t.mutedSoft} text-sm font-medium`}>Responsável pelo desenvolvimento completo da aplicação web e integração com back-end</p>
                        </div>
                        <div className={`p-8 rounded-[2rem] ${t.card}`}>
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                <img src="" alt="Guilherme Augusto" className="w-full h-full object-cover" />
                                <Users className="text-white" size={32} style={{ display: 'none' }} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Guilherme Augusto</h4>
                            <p className="text-amber-400 text-sm font-medium mb-3">Desenvolvedor Full-Stack</p>
                            <p className={`${t.mutedSoft} text-sm font-medium`}>Responsável pelo desenvolvimento completo da aplicação web e integração com back-end</p>
                        </div>                        <div className={`p-8 rounded-[2rem] ${t.card}`}>
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                <img src="" alt="João Victor" className="w-full h-full object-cover"/>
                                <Users className="text-white" size={32} style={{ display: 'none' }} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">João Victor</h4>
                            <p className="text-amber-400 text-sm font-medium mb-3">Desenvolvedor Full-Stack</p>
                            <p className={`${t.mutedSoft} text-sm font-medium`}>Responsável pelo desenvolvimento completo da aplicação web e integração com back-end</p>
                        </div>
                        <div className={`p-8 rounded-[2rem] ${t.card}`}>
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                <img src="/img/imagem_luca.jpg" alt="Luca Moreira" className="w-full h-full object-cover"  />
                                <Users className="text-white" size={32} style={{ display: 'none' }} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Luca Moreira</h4>
                            <p className="text-amber-400 text-sm font-medium mb-3">Desenvolvedor Full-Stack</p>
                            <p className={`${t.mutedSoft} text-sm font-medium`}>Responsável pelo desenvolvimento completo da aplicação web e integração com back-end</p>
                        </div>
                    </div>
                </section>

                <section className={`p-10 md:p-20 rounded-[4rem] relative overflow-hidden ${t.sectionCard}`}>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/5 blur-[100px] rounded-full"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Objetivos do <br /><span className="text-amber-400">Projeto</span></h3>
                            <p className={`${t.muted} leading-relaxed text-lg mb-12 font-medium`}>
                                Demonstrar a aplicação prática dos conceitos aprendidos na disciplina de Programação Modular,
                                desenvolvendo um sistema completo e funcional que possa ser utilizado em um contexto real.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-black font-black text-sm">1</span>
                                    </div>
                                    <div>
                                        <h4 className={`${t.heading} font-bold mb-1`}>Aplicação de POO</h4>
                                        <p className={`${t.mutedSoft} text-sm`}>Implementar conceitos de orientação a objetos em um projeto real</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-black font-black text-sm">2</span>
                                    </div>
                                    <div>
                                        <h4 className={`${t.heading} font-bold mb-1`}>Desenvolvimento Full-Stack</h4>
                                        <p className={`${t.mutedSoft} text-sm`}>Criar uma aplicação completa com front-end e back-end integrados</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-black font-black text-sm">3</span>
                                    </div>
                                    <div>
                                        <h4 className={`${t.heading} font-bold mb-1`}>Persistência de Dados</h4>
                                        <p className={`${t.mutedSoft} text-sm`}>Implementar sistema de banco de dados relacional</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="w-64 h-64 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full mx-auto mb-8 flex items-center justify-center">
                                <div className="w-48 h-48 bg-gradient-to-br from-amber-400/30 to-amber-600/30 rounded-full flex items-center justify-center">
                                    <Code className="text-amber-400" size={80} />
                                </div>
                            </div>
                            <h4 className="text-2xl font-black mb-4">Trabalho Prático</h4>
                            <p className={`${t.muted} font-medium`}>Programacao Modular - Engenharia de Software</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default About;