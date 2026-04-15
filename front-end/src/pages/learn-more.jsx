import React from 'react';
import { ArrowLeft, MapPin, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function LearnMore() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-400 selection:text-black antialiased">
            <header className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative z-10">
                        <Link to="/destinos" className="inline-flex items-center gap-2 text-amber-400 hover:text-white transition mb-8">
                            <ArrowLeft size={20} />
                            <span className="font-medium">Voltar aos destinos</span>
                        </Link>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="h-px w-12 bg-amber-400"></span>
                            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em]">Saiba mais</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                            Sobre a Península de <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">Maraú</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl font-medium mb-12">
                            Descubra tudo sobre este paraíso baiano, com suas praias deslumbrantes, cultura rica e experiências inesquecíveis.
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
                    <div>
                        <h3 className="text-3xl font-black mb-6 tracking-tighter">Um pedaço do paraíso na Bahia</h3>
                        <p className="text-gray-400 leading-relaxed text-lg mb-8 font-medium">
                            A Península de Maraú é um destino único no litoral baiano, conhecida por suas praias de águas cristalinas,
                            vilarejos charmosos e uma biodiversidade impressionante. Localizada entre os municípios de Maraú e
                            Itacaré, oferece uma combinação perfeita entre relaxamento e aventura.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg mb-8 font-medium">
                            Com mais de 40 praias paradisíacas, a península é ideal para quem busca paz, natureza e experiências
                            autênticas. Desde mergulhos em recifes de corais até caminhadas por trilhas ecológicas, há atividades
                            para todos os gostos.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img src="/img/praia_de_taipu_de_fora.jpg" className="rounded-[2rem] h-48 w-full object-cover border border-white/10" alt="Praia" />
                        <img src="/img/praia_do_cassange.jpg" className="rounded-[2rem] h-48 w-full object-cover border border-white/10 mt-8" alt="Natureza" />
                        <img src="/img/praia-do-muta.jpg" className="rounded-[2rem] h-48 w-full object-cover border border-white/10 -mt-8" alt="Mar" />
                        <img src="/img/praia_barra_grande.jpg" className="rounded-[2rem] h-48 w-full object-cover border border-white/10" alt="Vila" />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin size={32} className="text-amber-400" />
                        </div>
                        <h4 className="text-xl font-black mb-4">Localização Privilegiada</h4>
                        <p className="text-gray-400 font-medium">
                            Situada no sul da Bahia, a península oferece fácil acesso e uma localização estratégica para explorar
                            outros destinos da região.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star size={32} className="text-amber-400" />
                        </div>
                        <h4 className="text-xl font-black mb-4">Experiências Únicas</h4>
                        <p className="text-gray-400 font-medium">
                            Mergulhos, passeios de barco, trilhas ecológicas e contato com comunidades locais fazem da península
                            um destino rico em cultura e natureza.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users size={32} className="text-amber-400" />
                        </div>
                        <h4 className="text-xl font-black mb-4">Hospitalidade Local</h4>
                        <p className="text-gray-400 font-medium">
                            A acolhida calorosa dos moradores e a infraestrutura turística de qualidade garantem uma estadia
                            confortável e memorável.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LearnMore;