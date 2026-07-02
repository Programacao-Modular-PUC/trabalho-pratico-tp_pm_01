import {
    getMockNotificacoes,
    MOCK_RELATORIO_CLIENTES_FREQUENTES,
    MOCK_RELATORIO_FATURAMENTO,
    MOCK_RELATORIO_HISTORICO,
    MOCK_RELATORIO_QUARTOS_MAIS_ALUGADOS,
    MOCK_RELATORIO_RECEITA_POR_TIPO,
    MOCK_RELATORIO_TAXA_OCUPACAO
} from './mockData'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    })

    if (!response.ok) {
        let message = 'Nao foi possivel concluir a operacao.'
        try {
            const data = await response.json()
            message = data.message || data.error || message
        } catch {
            message = await response.text() || message
        }
        const error = new Error(message)
        error.status = response.status
        throw error
    }

    if (response.status === 204) {
        return null
    }

    return response.json()
}

function unwrapRelatorio(data) {
    if (Array.isArray(data)) {
        return data
    }
    if (data && Array.isArray(data.dados)) {
        return data.dados
    }
    return data ?? []
}

async function withMockFallback(fetcher, fallback, { useWhenEmpty = false } = {}) {
    try {
        const data = await fetcher()
        if (useWhenEmpty && Array.isArray(data) && data.length === 0) {
            return { data: fallback(), demo: true }
        }
        return { data, demo: false }
    } catch {
        return { data: fallback(), demo: true }
    }
}

export const api = {
    listClientes: () => request('/clientes'),
    createCliente: (data) => request('/clientes', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    listResidencias: () => request('/residencias'),
    createResidencia: (data) => request('/residencias', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    deleteResidencia: (id) => request(`/residencias/${id}`, { method: 'DELETE' }),

    listQuartos: (tipo) => {
        const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : ''
        return request(`/quartos${query}`)
    },
    createQuarto: (data) => request('/quartos', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    deleteQuarto: (id) => request(`/quartos/${id}`, { method: 'DELETE' }),

    listAlugueis: () => request('/alugueis'),
    listHistoricoCliente: async (clienteId) => {
        try {
            return await request(`/clientes/${clienteId}/alugueis`)
        } catch (error) {
            if (error.status !== 404) throw error
            const items = await request('/alugueis')
            return items.filter((item) => Number(item.clienteId) === Number(clienteId))
        }
    },
    createAluguel: (data) => request('/alugueis', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    cancelAluguel: (id) => request(`/alugueis/${id}/cancelar`, { method: 'POST' }),
    deleteAluguel: (id) => request(`/alugueis/${id}/cancelar`, { method: 'POST' }),
    checkInAluguel: (id) => request(`/alugueis/${id}/check-in`, { method: 'POST' }),
    checkOutAluguel: (id) => request(`/alugueis/${id}/check-out`, { method: 'POST' }),
    confirmarPagamentoAluguel: (id) => request(`/alugueis/${id}/confirmar-pagamento`, { method: 'POST' }),

    listNotificacoes: async () => {
        const { data } = await withMockFallback(
            () => request('/notificacoes'),
            getMockNotificacoes,
            { useWhenEmpty: true }
        )
        return data
    },
    listNotificacoesPorEvento: (tipo) => request(`/notificacoes/evento/${tipo}`),

    getRelatorioFaturamentoMensal: async (ano) => {
        const q = ano ? `?ano=${ano}` : ''
        const { data } = await withMockFallback(
            async () => unwrapRelatorio(await request(`/relatorios/faturamento-mensal${q}`)),
            () => MOCK_RELATORIO_FATURAMENTO.filter((item) => !ano || item.ano === Number(ano))
        )
        return data
    },
    getRelatorioTaxaOcupacao: async (dataInicio, dataFim) => {
        const p = new URLSearchParams()
        if (dataInicio) p.set('dataInicio', dataInicio)
        if (dataFim) p.set('dataFim', dataFim)
        const q = p.toString()
        const { data } = await withMockFallback(
            async () => unwrapRelatorio(await request(`/relatorios/taxa-ocupacao${q ? `?${q}` : ''}`)),
            () => MOCK_RELATORIO_TAXA_OCUPACAO
        )
        return data
    },
    getRelatorioClientesFrequentes: async (limite) => {
        const q = limite ? `?limite=${limite}` : ''
        const { data } = await withMockFallback(
            async () => unwrapRelatorio(await request(`/relatorios/clientes-frequentes${q}`)),
            () => (limite ? MOCK_RELATORIO_CLIENTES_FREQUENTES.slice(0, limite) : MOCK_RELATORIO_CLIENTES_FREQUENTES)
        )
        return data
    },
    getRelatorioQuartosMaisAlugados: async (limite) => {
        const q = limite ? `?limite=${limite}` : ''
        const { data } = await withMockFallback(
            async () => unwrapRelatorio(await request(`/relatorios/quartos-mais-alugados${q}`)),
            () => (limite ? MOCK_RELATORIO_QUARTOS_MAIS_ALUGADOS.slice(0, limite) : MOCK_RELATORIO_QUARTOS_MAIS_ALUGADOS)
        )
        return data
    },
    getRelatorioReceitaPorTipoQuarto: async () => {
        const { data } = await withMockFallback(
            async () => unwrapRelatorio(await request('/relatorios/receita-por-tipo-quarto')),
            () => MOCK_RELATORIO_RECEITA_POR_TIPO
        )
        return data
    },
    getRelatorioHistoricoReservas: async ({ dataInicio, dataFim, clienteId, quartoId } = {}) => {
        const p = new URLSearchParams()
        if (dataInicio) p.set('dataInicio', dataInicio)
        if (dataFim) p.set('dataFim', dataFim)
        if (clienteId) p.set('clienteId', clienteId)
        if (quartoId) p.set('quartoId', quartoId)
        const q = p.toString()
        const { data } = await withMockFallback(
            async () => unwrapRelatorio(await request(`/relatorios/historico-reservas${q ? `?${q}` : ''}`)),
            () => MOCK_RELATORIO_HISTORICO
        )
        return data
    },
}
