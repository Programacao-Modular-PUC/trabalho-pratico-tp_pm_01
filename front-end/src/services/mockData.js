export const HOST_TEST_EMAIL = 'acessohost@gmail.com'
export const GUEST_TEST_EMAIL = 'acessoguest@gmail.com'

/** Dados de demonstracao alinhados ao DataSeeder do backend. */
export const TEST_HOST = {
    email: HOST_TEST_EMAIL,
    password: 'testhost',
    nome: 'Anfitriao Teste',
    residencias: [
        { id: 1, nome: 'Villa Pontal do Muta', bairro: 'Ponta do Muta', quartos: ['101', '201', '301'] },
        { id: 2, nome: 'Refugio Lagoa do Cassange', bairro: 'Cassange', quartos: ['C01', 'C10', 'C20'] },
        { id: 3, nome: 'Pousada Taipu Roots', bairro: 'Taipu de Fora', quartos: ['R01', 'R12', 'R30'] }
    ]
}

export const TEST_GUEST_CLIENTE = {
    id: 1,
    nome: 'Cliente Visitante',
    cpf: '00000000001',
    endereco: 'Rua das Palmeiras, 100 - Barra Grande',
    telefone: '(73) 99999-0101',
    email: GUEST_TEST_EMAIL
}

export const TEST_GUEST = {
    email: GUEST_TEST_EMAIL,
    password: 'testguest',
    cliente: TEST_GUEST_CLIENTE,
    reservasRelacionadas: [
        { quarto: 'R01', residencia: 'Pousada Taipu Roots', periodo: '24/01/2026 - 31/01/2026', status: 'FINALIZADA' },
        { quarto: '301', residencia: 'Villa Pontal do Muta', periodo: '02/03/2026 - 07/03/2026', status: 'FINALIZADA' },
        { quarto: 'C10', residencia: 'Refugio Lagoa do Cassange', periodo: '10/08/2025 - 14/08/2025', status: 'RESERVADA' }
    ],
    favoritos: [
        { id: 7, title: 'Quarto Individual R01', location: 'Pousada Taipu Roots - Taipu de Fora', price: 310, rating: '4.8', img: '/img/suite_roots.jpg' },
        { id: 1, title: 'Quarto Individual 101', location: 'Villa Pontal do Muta - Ponta do Muta', price: 280, rating: '4.9', img: '/img/suite_roots.jpg' },
        { id: 5, title: 'Quarto Casal C10', location: 'Refugio Lagoa do Cassange - Cassange', price: 520, rating: '4.7', img: '/img/bangalo.jpg' }
    ]
}

export const TEST_OTHER_CLIENTS = [
    { email: 'mariana.costa@email.com', nome: 'Mariana Costa', cpf: '12345678901' },
    { email: 'rafael.almeida@email.com', nome: 'Rafael Almeida', cpf: '98765432100' }
]

const now = () => new Date().toISOString()

export const MOCK_NOTIFICACOES = [
    {
        id: 1001,
        tipoEvento: 'RESERVA_CRIADA',
        titulo: 'Reserva registrada',
        conteudo: 'Reserva #42 confirmada para Cliente Visitante no quarto C10 (Refugio Lagoa do Cassange). Perfil: hospede.',
        destinatario: GUEST_TEST_EMAIL,
        canal: 'INTERNA',
        registradaEm: now()
    },
    {
        id: 1002,
        tipoEvento: 'PAGAMENTO_CONFIRMADO',
        titulo: 'Pagamento confirmado',
        conteudo: 'Pagamento da reserva #38 confirmado para Cliente Visitante no quarto R01 (Pousada Taipu Roots). Perfil: hospede.',
        destinatario: GUEST_TEST_EMAIL,
        canal: 'EMAIL',
        registradaEm: now()
    },
    {
        id: 1003,
        tipoEvento: 'CHECKOUT_REALIZADO',
        titulo: 'Check-out realizado',
        conteudo: 'Check-out concluido para Cliente Visitante no quarto 301 (Villa Pontal do Muta). Perfil: hospede.',
        destinatario: GUEST_TEST_EMAIL,
        canal: 'INTERNA',
        registradaEm: now()
    },
    {
        id: 2001,
        tipoEvento: 'RESERVA_CRIADA',
        titulo: 'Nova reserva recebida',
        conteudo: 'Nova reserva de Cliente Visitante no quarto C10 (Refugio Lagoa do Cassange). Perfil: proprietario.',
        destinatario: HOST_TEST_EMAIL,
        canal: 'INTERNA',
        registradaEm: now()
    },
    {
        id: 2002,
        tipoEvento: 'CHECKIN_REALIZADO',
        titulo: 'Check-in realizado',
        conteudo: 'Check-in de Mariana Costa no quarto 201 (Villa Pontal do Muta). Perfil: proprietario.',
        destinatario: HOST_TEST_EMAIL,
        canal: 'INTERNA',
        registradaEm: now()
    },
    {
        id: 2003,
        tipoEvento: 'PAGAMENTO_CONFIRMADO',
        titulo: 'Pagamento recebido',
        conteudo: 'Pagamento confirmado para reserva de Rafael Almeida no quarto R30 (Pousada Taipu Roots). Perfil: proprietario.',
        destinatario: HOST_TEST_EMAIL,
        canal: 'EMAIL',
        registradaEm: now()
    }
]

export const MOCK_RELATORIO_FATURAMENTO = [
    { ano: 2025, mes: 1, nomeMes: 'janeiro', totalFaturado: 2840, quantidadeAlugueis: 3 },
    { ano: 2025, mes: 2, nomeMes: 'fevereiro', totalFaturado: 4120, quantidadeAlugueis: 3 },
    { ano: 2025, mes: 3, nomeMes: 'marco', totalFaturado: 5380, quantidadeAlugueis: 3 },
    { ano: 2026, mes: 1, nomeMes: 'janeiro', totalFaturado: 8920, quantidadeAlugueis: 6 },
    { ano: 2026, mes: 2, nomeMes: 'fevereiro', totalFaturado: 7650, quantidadeAlugueis: 5 },
    { ano: 2026, mes: 3, nomeMes: 'marco', totalFaturado: 6210, quantidadeAlugueis: 4 }
]

export const MOCK_RELATORIO_TAXA_OCUPACAO = [
    { residenciaNome: 'Villa Pontal do Muta', taxaOcupacao: 72.5, diasOcupados: 22, diasDisponiveis: 30 },
    { residenciaNome: 'Refugio Lagoa do Cassange', taxaOcupacao: 68.0, diasOcupados: 20, diasDisponiveis: 30 },
    { residenciaNome: 'Pousada Taipu Roots', taxaOcupacao: 81.3, diasOcupados: 24, diasDisponiveis: 30 }
]

export const MOCK_RELATORIO_CLIENTES_FREQUENTES = [
    { clienteId: 1, nomeCliente: 'Cliente Visitante', email: GUEST_TEST_EMAIL, totalReservas: 12, totalGasto: 18450 },
    { clienteId: 2, nomeCliente: 'Mariana Costa', email: 'mariana.costa@email.com', totalReservas: 10, totalGasto: 16200 },
    { clienteId: 3, nomeCliente: 'Rafael Almeida', email: 'rafael.almeida@email.com', totalReservas: 9, totalGasto: 14880 }
]

export const MOCK_RELATORIO_QUARTOS_MAIS_ALUGADOS = [
    { quartoId: 1, codigoQuarto: '101', residenciaNome: 'Villa Pontal do Muta', totalAlugueis: 8 },
    { quartoId: 7, codigoQuarto: 'R01', residenciaNome: 'Pousada Taipu Roots', totalAlugueis: 7 },
    { quartoId: 5, codigoQuarto: 'C10', residenciaNome: 'Refugio Lagoa do Cassange', totalAlugueis: 6 }
]

export const MOCK_RELATORIO_RECEITA_POR_TIPO = [
    { tipoQuarto: 'INDIVIDUAL', totalReceita: 22400, quantidadeAlugueis: 18 },
    { tipoQuarto: 'CASAL', totalReceita: 35600, quantidadeAlugueis: 14 },
    { tipoQuarto: 'FAMILIA', totalReceita: 48200, quantidadeAlugueis: 11 }
]

export const MOCK_RELATORIO_HISTORICO = [
    {
        aluguelId: 42,
        nomeCliente: 'Cliente Visitante',
        codigoQuarto: 'C10',
        residenciaNome: 'Refugio Lagoa do Cassange',
        dataEntrada: '2025-08-10T14:00:00',
        dataSaida: '2025-08-14T11:00:00',
        status: 'RESERVADA',
        valorFinal: 2080
    },
    {
        aluguelId: 38,
        nomeCliente: 'Cliente Visitante',
        codigoQuarto: 'R01',
        residenciaNome: 'Pousada Taipu Roots',
        dataEntrada: '2026-01-24T14:00:00',
        dataSaida: '2026-01-31T11:00:00',
        status: 'FINALIZADA',
        valorFinal: 2170
    },
    {
        aluguelId: 31,
        nomeCliente: 'Mariana Costa',
        codigoQuarto: '201',
        residenciaNome: 'Villa Pontal do Muta',
        dataEntrada: '2026-01-04T14:00:00',
        dataSaida: '2026-01-10T11:00:00',
        status: 'FINALIZADA',
        valorFinal: 3240
    }
]

export function getMockNotificacoes() {
    return MOCK_NOTIFICACOES.map((item) => ({ ...item, registradaEm: now() }))
}
