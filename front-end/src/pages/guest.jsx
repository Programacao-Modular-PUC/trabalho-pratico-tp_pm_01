import React from 'react'

function Guest() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-black mb-4">Área do Hóspede</h1>
                <p className="text-gray-400">Bem-vindo à sua área pessoal!</p>
                <p className="text-gray-400 mt-2">Aqui você poderá gerenciar suas reservas e explorar acomodações.</p>
            </div>
        </div>
    )
}

export default Guest