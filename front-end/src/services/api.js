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

    listNotificacoes: () => request('/notificacoes'),
    listNotificacoesPorEvento: (tipo) => request(`/notificacoes/evento/${tipo}`),

    getRelatorioFaturamentoMensal: (ano) => {
        const q = ano ? `?ano=${ano}` : '';
        return request(`/relatorios/faturamento-mensal${q}`);
    },
    getRelatorioTaxaOcupacao: (dataInicio, dataFim) => {
        const p = new URLSearchParams();
        if (dataInicio) p.set('dataInicio', dataInicio);
        if (dataFim) p.set('dataFim', dataFim);
        const q = p.toString();
        return request(`/relatorios/taxa-ocupacao${q ? `?${q}` : ''}`);
    },
    getRelatorioClientesFrequentes: (limite) => {
        const q = limite ? `?limite=${limite}` : '';
        return request(`/relatorios/clientes-frequentes${q}`);
    },
    getRelatorioQuartosMaisAlugados: (limite) => {
        const q = limite ? `?limite=${limite}` : '';
        return request(`/relatorios/quartos-mais-alugados${q}`);
    },
    getRelatorioReceitaPorTipoQuarto: () => request('/relatorios/receita-por-tipo-quarto'),
    getRelatorioHistoricoReservas: ({ dataInicio, dataFim, clienteId, quartoId } = {}) => {
        const p = new URLSearchParams();
        if (dataInicio) p.set('dataInicio', dataInicio);
        if (dataFim) p.set('dataFim', dataFim);
        if (clienteId) p.set('clienteId', clienteId);
        if (quartoId) p.set('quartoId', quartoId);
        const q = p.toString();
        return request(`/relatorios/historico-reservas${q ? `?${q}` : ''}`);
    },
}
