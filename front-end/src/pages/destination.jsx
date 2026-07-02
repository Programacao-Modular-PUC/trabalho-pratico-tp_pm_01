import React, { useState, forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';
import {
    MapPin,
    Calendar as CalendarIcon,
    Users,
    Star,
    ChevronDown,
    Search,
    Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Searchbar from '../components/searchbar';
import { usePublicTheme } from '../hooks/usePublicTheme';

registerLocale('pt-BR', ptBR);

function Destinations() {
    const t = usePublicTheme();
    const [location] = useState('Peninsula de Marau, Bahia');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [guests, setGuests] = useState('1');

    const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
        <div
            className="flex items-center gap-3 w-full text-left cursor-pointer group"
            onClick={onClick}
            ref={ref}
        >
            <CalendarIcon size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="flex-grow">
                <span className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-0.5">
                    Estadia
                </span>
                <span className={`text-sm font-medium ${value ? t.searchFieldText : t.searchPlaceholder}`}>
                    {value || placeholder}
                </span>
            </div>
            <ChevronDown size={14} className={t.mutedSoft} />
        </div>
    ));

    const destinations = [
        {
            title: 'Praia da Ponta do Mutá',
            description: 'Situada entre Barra Grande e Três Coqueiros, é conhecida pelas águas calmas e por oferecer um pôr do sol icônico.',
            rating: '4.8',
            img: 'img/praia-do-muta.jpg'
        },
        {
            title: 'Praia de Taipu de Fora',
            description: 'Considerada uma das mais belas do Brasil, é ideal para mergulho durante a maré baixa, quando os corais formam piscinas naturais.Mares cristalinos e recifes vibrantes.',
            rating: '4.9',
            img: '/img/praia_de_taipu_de_fora.jpg'
        },
        {
            title: 'Barra grande',
            description: 'Principal vila da península, possui infraestrutura turística, águas mornas e é frequentada por famílias.',
            rating: '4.6',
            img: '/img/praia_barra_grande.jpg'
        },
        {
            title: 'Praia de Algodões',
            description: 'Localizada mais ao sul, oferece tranquilidade, uma longa faixa de areia e formação de piscinas naturais na maré baixa.',
            rating: '4.7',
            img: 'img/praia_de_algodoes.jpg'
        },
        {
            title: 'Praia de três coqueiros',
            description: ' Localizada perto de Barra Grande, é popular para caminhadas e possui corais que formam piscinas naturais.',
            rating: '4.5',
            img: 'img/praia_de_tres_coqueiros.jpg'
        },
        {
            title: 'Praia do cassange',
            description: 'Praia mais isolada, conhecida pela sinergia entre a água doce da lagoa e a água salgada do mar.',
            rating: '4.8',
            img: 'img/praia_do_cassange.jpg'
        }
    ];

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
                            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em]">Aventura brasileira</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                            Encontre seu <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">destino perfeito.</span>
                        </h1>
                        <p className={`text-lg lg:text-xl ${t.muted} leading-relaxed max-w-xl font-medium mb-12`}>
                            Explore os melhores destinos da Bahia e do litoral brasileiro com acomodações premium, praias exclusivas e experiências memoráveis.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <button className="px-10 py-5 bg-amber-400 text-black font-black rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition active:scale-95">
                                <a href="#destinos">Ver destinos</a>
                            </button>
                            <Link to="/saiba-mais" className={`px-10 py-5 font-black rounded-2xl transition backdrop-blur-md inline-block text-center ${t.secondaryBtn}`}>
                                Saiba mais
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative">
                        <div className="space-y-4 pt-12">
                            <img src="/img/praia_de_taipu_de_fora.jpg" className={`rounded-[2.5rem] h-80 w-full object-cover ${t.imageBorder}`} alt="Ilha" />
                            <img src="/img/praia_do_cassange.jpg" className={`rounded-[2.5rem] h-56 w-full object-cover ${t.imageBorder}`} alt="Praia" />
                        </div>
                        <div className="space-y-4">
                            <img src="/img/praia-do-muta.jpg" className={`rounded-[2.5rem] h-56 w-full object-cover ${t.imageBorder}`} alt="Resort" />
                            <img src="/img/praia_de_tres_coqueiros.jpg" className={`rounded-[2.5rem] h-80 w-full object-cover ${t.imageBorder}`} alt="Por do sol" />
                        </div>
                    </div>
                </div>
            </header>

           <Searchbar></Searchbar>


            <main id="destinos" className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-lg">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter">Destinos Imperdíveis</h2>
                        <p className={`${t.mutedSoft} font-medium`}>Conheca a selecao exclusiva de destinos com praias, trilhas e experiencias locais.</p>
                    </div>
                    <button className={`text-amber-400 font-black text-xs uppercase tracking-widest border-b-2 border-amber-400 pb-1 transition ${t.linkAccent}`}>Ver todas as ofertas</button>
                </div>

                <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {destinations.map((item, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-6">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className={`absolute top-6 right-6 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black ${t.badge}`}>
                                    <Star size={14} className="text-amber-400 fill-amber-400" /> {item.rating}
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition">{item.title}</h3>
                                    <p className={`${t.mutedSoft} text-sm font-medium`}>{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className={`mt-40 p-10 md:p-20 rounded-[4rem] relative overflow-hidden ${t.sectionCard}`}>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/5 blur-[100px] rounded-full"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Destino certo para a sua <span className="text-amber-400">próxima viagem.</span></h3>
                            <p className={`${t.muted} leading-relaxed text-lg mb-12 font-medium`}>
                                Explore praias paradisíacas, refúgios à beira-mar e vilarejos cheios de charme.
                                Um convite para viver experiências únicas em um ambiente pensado para inspirar, moderno, elegante e inesquecível.
                            </p>

                            <div className="grid grid-cols-3 gap-10">
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Praias</h4>
                                    <p className={`text-sm font-bold ${t.body}`}>Areia branca e aguas claras.</p>
                                </div>
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Experiencias</h4>
                                    <p className={`text-sm font-bold ${t.body}`}>Passeios exclusivos e natureza.</p>
                                </div>
                                <div>
                                    <h4 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Estadia</h4>
                                    <p className={`text-sm font-bold ${t.body}`}>Conforto e design premium.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-10 rounded-[3rem] backdrop-blur-xl ${t.panel}`}>
                            <div className="flex items-center gap-4 text-amber-400 font-black uppercase tracking-[0.25em] text-xs mb-8">
                                <Compass size={18} />
                                Destinos exclusivos
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-3xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                                        <span className="text-xl font-black">01</span>
                                    </div>
                                    <div>
                                        <h4 className={`font-black ${t.heading}`}>Reserva rapida</h4>
                                        <p className={`${t.muted} text-sm`}>Organize sua viagem em poucos cliques.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-3xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                                        <span className="text-xl font-black">02</span>
                                    </div>
                                    <div>
                                        <h4 className={`font-black ${t.heading}`}>Suporte ativo</h4>
                                        <p className={`${t.muted} text-sm`}>Atendimento dedicado para sua estadia.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-3xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                                        <span className="text-xl font-black">03</span>
                                    </div>
                                    <div>
                                        <h4 className={`font-black ${t.heading}`}>Experiencias unicas</h4>
                                        <p className={`${t.muted} text-sm`}>Viva o melhor do litoral e da cultura local.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-3xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                                        <span className="text-xl font-black">04</span>
                                    </div>
                                    <div>
                                        <h4 className={`font-black ${t.heading}`}>Localizacoes privilegiadas</h4>
                                        <p className={`${t.muted} text-sm`}>Fique nos melhores pontos, perto das praias mais desejadas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Destinations;
