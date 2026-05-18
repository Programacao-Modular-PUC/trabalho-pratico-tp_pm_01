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
        throw new Error(message)
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

    listQuartos: () => request('/quartos'),
    createQuarto: (data) => request('/quartos', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    deleteQuarto: (id) => request(`/quartos/${id}`, { method: 'DELETE' }),

    listAlugueis: () => request('/alugueis'),
    createAluguel: (data) => request('/alugueis', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}
