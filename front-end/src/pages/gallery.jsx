import React from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicTheme } from '../hooks/usePublicTheme';

function Gallery() {
    const t = usePublicTheme();
    const images = [
        { src: '/img/praia-do-muta.jpg', alt: 'Praia do Mutá' },
        { src: '/img/praia_de_taipu_de_fora.jpg', alt: 'Praia de Taipu de Fora' },
        { src: '/img/praia_barra_grande.jpg', alt: 'Barra Grande' },
        { src: '/img/praia_de_algodoes.jpg', alt: 'Praia de Algodões' },
        { src: '/img/praia_de_tres_coqueiros.jpg', alt: 'Praia de Três Coqueiros' },
        { src: '/img/praia_do_cassange.jpg', alt: 'Praia do Cassange' },
    ];

    return (
        <div className={t.page}>
            <header className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative z-10">
                        <Link to="/" className={`inline-flex items-center gap-2 text-amber-400 transition mb-8 ${t.linkAccent}`}>
                            <ArrowLeft size={20} />
                            <span className="font-medium">Voltar</span>
                        </Link>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="h-px w-12 bg-amber-400"></span>
                            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em]">Galeria de fotos</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                            Península de <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">Maraú</span>
                        </h1>
                        <p className={`text-lg lg:text-xl ${t.muted} leading-relaxed max-w-xl font-medium mb-12`}>
                            Explore as belezas naturais e os momentos únicos capturados na Península de Maraú, Bahia.
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5]">
                                <img src={image.src} alt={image.alt} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                                    <Camera size={32} className="text-white opacity-0 group-hover:opacity-100 transition duration-300" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className={`text-lg font-bold ${t.heading} group-hover:text-amber-400 transition`}>{image.alt}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Gallery;