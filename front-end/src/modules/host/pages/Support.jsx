import React, { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    ChevronDown,
    Headphones,
    FileText
} from 'lucide-react';

function Support() {
    const [expandedFaq, setExpandedFaq] = useState(null);

    const faqs = [
        {
            id: 1,
            question: 'Quanto tempo leva para receber o pagamento?',
            answer: 'Os pagamentos são processados entre 5 a 7 dias úteis após o check-out do hóspede. Você pode acompanhar o status no painel de pagamentos.'
        },
        {
            id: 2,
            question: 'Como faço para modificar preços das minhas residências?',
            answer: 'Acesse a página "Minhas Residências", clique em "Editar" na propriedade desejada e altere os preços dos quartos. As mudanças entram em vigor conforme suas regras de cancelamento.'
        },
        {
            id: 3,
            question: 'Qual é a política de cancelamento padrão?',
            answer: 'Oferecemos política flexível (até 1 dia antes), moderada (até 3 dias antes) e rígida (até 7 dias antes). Você escolhe qual funciona melhor para seu negócio.'
        },
        {
            id: 4,
            question: 'Como adicionar mais quartos à minha propriedade?',
            answer: 'Na página "Minhas Residências", clique em "Editar" e use o botão "Adicionar Quarto" para criar novos cômodos com características e preços diferentes.'
        },
        {
            id: 5,
            question: 'Posso oferecer serviços adicionais?',
            answer: 'Sim! Ao editar seus quartos, você pode adicionar serviços opcionais como hidromasagem, ar-condicionado premium, café da manhã, etc., com preços personalizados.'
        },
        {
            id: 6,
            question: 'O que fazer se tiver um problema com uma reserva?',
            answer: 'Entre em contato com nosso suporte através do email suporte@plataforma.com ou ligue para (71) 3000-0000. Nossa equipe está disponível 24/7 para ajudar.'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-8 pb-12 min-h-screen">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Headphones className="w-8 h-8 text-amber-500" />
                        <h1 className="text-4xl font-black text-white">Suporte e Ajuda</h1>
                    </div>
                    <p className="text-gray-400">Encontre respostas ou entre em contato com nossa equipe</p>
                </div>

                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Email */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition">
                        <div className="flex items-center gap-3 mb-3">
                            <Mail className="w-6 h-6 text-amber-500" />
                            <h3 className="text-lg font-bold text-white">Email</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Resposta em até 24 horas</p>
                        <a href="mailto:suporte@plataforma.com" className="text-amber-400 font-semibold hover:text-amber-300 transition">
                            suporte@plataforma.com
                        </a>
                    </div>

                    {/* Phone */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition">
                        <div className="flex items-center gap-3 mb-3">
                            <Phone className="w-6 h-6 text-amber-500" />
                            <h3 className="text-lg font-bold text-white">Telefone</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Segunda a domingo, 8h às 22h</p>
                        <p className="text-amber-400 font-semibold">(71) 3000-0000</p>
                    </div>

                    {/* Location */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition">
                        <div className="flex items-center gap-3 mb-3">
                            <MapPin className="w-6 h-6 text-amber-500" />
                            <h3 className="text-lg font-bold text-white">Localização</h3>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Maraú, Bahia<br/>
                            Brasil
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-amber-500" />
                        Perguntas Frequentes
                    </h2>

                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden hover:border-amber-500/20 transition"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-700/20 transition"
                                >
                                    <h3 className="text-left font-semibold text-white">{faq.question}</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-amber-500 transition-transform ${
                                            expandedFaq === faq.id ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {expandedFaq === faq.id && (
                                    <div className="px-4 pb-4 pt-0 border-t border-slate-700/50">
                                        <p className="text-gray-400">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Help */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Não encontrou o que procura?</h3>
                    <p className="text-gray-400 mb-4">Nossa equipe de suporte está pronta para ajudar com qualquer dúvida ou problema que você possa ter.</p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-lg font-bold transition">
                        Enviar Mensagem
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Support;
