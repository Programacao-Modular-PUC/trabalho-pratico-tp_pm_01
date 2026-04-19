import React, { useState } from 'react';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Edit,
    X,
    AlertCircle,
    Zap
} from 'lucide-react';

function EditResidence({ residenceId, onBack }) {
    // Dados da residência (em produção virá de uma API)
    const [residence] = useState({
        id: residenceId,
        name: 'Casa à Beira-Mar Premium',
        location: 'Praia de Taipipe, Maraú',
        description: 'Uma linda casa à beira-mar com vista para o oceano',
        price: 450.00
    });

    const [rooms, setRooms] = useState([
        {
            id: 1,
            number: '101',
            type: 'Suíte Master',
            basePrice: 450.00,
            additionals: [
                { id: 1, name: 'Hidromasagem', price: 50.00 },
                { id: 2, name: 'Ar Condicionado Premium', price: 30.00 }
            ]
        },
        {
            id: 2,
            number: '102',
            type: 'Quarto Casal',
            basePrice: 350.00,
            additionals: []
        }
    ]);

    const [showRoomForm, setShowRoomForm] = useState(false);
    const [showAdditionalForm, setShowAdditionalForm] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const [formData, setFormData] = useState({
        number: '',
        type: '',
        basePrice: ''
    });

    const [additionalData, setAdditionalData] = useState({
        name: '',
        price: ''
    });

    const handleAddRoom = () => {
        if (!formData.number || !formData.type || !formData.basePrice) {
            alert('Preencha todos os campos');
            return;
        }

        const newRoom = {
            id: Date.now(),
            number: formData.number,
            type: formData.type,
            basePrice: parseFloat(formData.basePrice),
            additionals: []
        };

        setRooms([...rooms, newRoom]);
        setFormData({ number: '', type: '', basePrice: '' });
        setShowRoomForm(false);
    };

    const handleDeleteRoom = (roomId) => {
        setRooms(rooms.filter(room => room.id !== roomId));
    };

    const handleAddAdditional = () => {
        if (!additionalData.name || !additionalData.price) {
            alert('Preencha todos os campos');
            return;
        }

        const updatedRooms = rooms.map(room => {
            if (room.id === selectedRoomId) {
                return {
                    ...room,
                    additionals: [
                        ...room.additionals,
                        {
                            id: Date.now(),
                            name: additionalData.name,
                            price: parseFloat(additionalData.price)
                        }
                    ]
                };
            }
            return room;
        });

        setRooms(updatedRooms);
        setAdditionalData({ name: '', price: '' });
        setShowAdditionalForm(false);
    };

    const handleDeleteAdditional = (roomId, additionalId) => {
        const updatedRooms = rooms.map(room => {
            if (room.id === roomId) {
                return {
                    ...room,
                    additionals: room.additionals.filter(add => add.id !== additionalId)
                };
            }
            return room;
        });
        setRooms(updatedRooms);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const selectedRoom = rooms.find(room => room.id === selectedRoomId);

    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 min-h-screen pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-white">{residence.name}</h1>
                        <p className="text-gray-400">{residence.location}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Rooms */}
                    <div className="lg:col-span-2">
                        {/* Informações da Residência */}
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
                            <h2 className="text-2xl font-black text-white mb-4">Informações da Residência</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-400 text-sm">Descrição</label>
                                    <p className="text-white mt-2">{residence.description}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Preço Base</label>
                                    <p className="text-amber-400 font-black text-2xl mt-2">{formatCurrency(residence.price)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rooms Section */}
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-white">Quartos</h2>
                                <button
                                    onClick={() => setShowRoomForm(true)}
                                    className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-xl font-bold transition flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Adicionar Quarto
                                </button>
                            </div>

                            {/* Room Form */}
                            {showRoomForm && (
                                <div className="bg-slate-900/50 border border-amber-500/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-white">Novo Quarto</h3>
                                        <button
                                            onClick={() => setShowRoomForm(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-white font-bold mb-2">Número/Código do Quarto</label>
                                                <input
                                                    type="text"
                                                    value={formData.number}
                                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                                    placeholder="Ex: 101"
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white font-bold mb-2">Tipo de Quarto</label>
                                                <input
                                                    type="text"
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                    placeholder="Ex: Suíte Master"
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-white font-bold mb-2">Diária Base (R$)</label>
                                            <input
                                                type="number"
                                                value={formData.basePrice}
                                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                                placeholder="450.00"
                                                step="0.01"
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleAddRoom}
                                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-2 rounded-lg font-bold transition"
                                            >
                                                Salvar Quarto
                                            </button>
                                            <button
                                                onClick={() => setShowRoomForm(false)}
                                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-bold transition"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rooms List */}
                            {rooms.length === 0 ? (
                                <div className="text-center py-12">
                                    <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                    <p className="text-gray-400">Nenhum quarto cadastrado</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rooms.map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() => setSelectedRoomId(room.id)}
                                            className={`border rounded-xl p-4 transition cursor-pointer ${
                                                selectedRoomId === room.id
                                                    ? 'bg-amber-500/10 border-amber-500/50'
                                                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <p className="text-sm text-gray-400">Quarto {room.number}</p>
                                                    <h3 className="text-lg font-bold text-white">{room.type}</h3>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteRoom(room.id);
                                                        setSelectedRoomId(null);
                                                    }}
                                                    className="text-red-400 hover:text-red-300 transition"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                                                <p className="text-gray-400 text-xs">Diária Base</p>
                                                <p className="text-amber-400 font-black text-lg">{formatCurrency(room.basePrice)}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400 mb-2">
                                                    {room.additionals.length} adicional(is)
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRoomId(room.id);
                                                        setShowAdditionalForm(true);
                                                    }}
                                                    className="w-full text-center py-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white text-sm font-bold rounded-lg transition"
                                                >
                                                    + Adicionar Extra
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Additionals */}
                    <div>
                        {selectedRoom && (
                            <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sticky top-8">
                                <h2 className="text-xl font-black text-white mb-4">Adicionais</h2>
                                <p className="text-gray-400 text-sm mb-6">
                                    Quarto {selectedRoom.number} - {selectedRoom.type}
                                </p>

                                {/* Additional Form */}
                                {showAdditionalForm && (
                                    <div className="bg-slate-900/50 border border-amber-500/30 rounded-xl p-4 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-white text-sm">Novo Adicional</h3>
                                            <button
                                                onClick={() => setShowAdditionalForm(false)}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-gray-400 text-xs font-bold mb-1">Nome do adicional</label>
                                                <input
                                                    type="text"
                                                    value={additionalData.name}
                                                    onChange={(e) => setAdditionalData({ ...additionalData, name: e.target.value })}
                                                    placeholder="Ex: Hidromasagem"
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-amber-500 focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-gray-400 text-xs font-bold mb-1">Valor adicional (R$)</label>
                                                <input
                                                    type="number"
                                                    value={additionalData.price}
                                                    onChange={(e) => setAdditionalData({ ...additionalData, price: e.target.value })}
                                                    placeholder="50.00"
                                                    step="0.01"
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-amber-500 focus:outline-none"
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleAddAdditional}
                                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-2 rounded-lg font-bold text-sm transition"
                                                >
                                                    Adicionar
                                                </button>
                                                <button
                                                    onClick={() => setShowAdditionalForm(false)}
                                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-bold text-sm transition"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Additionals List */}
                                {selectedRoom.additionals.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Zap className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
                                        <p className="text-gray-500 text-sm">Nenhum adicional</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 mb-6">
                                        {selectedRoom.additionals.map((additional) => (
                                            <div
                                                key={additional.id}
                                                className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="text-white font-semibold text-sm">{additional.name}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteAdditional(selectedRoom.id, additional.id)}
                                                        className="text-red-400 hover:text-red-300 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-amber-400 font-bold text-sm">+{formatCurrency(additional.price)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowAdditionalForm(!showAdditionalForm)}
                                    className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Novo Adicional
                                </button>
                            </div>
                        )}

                        {!selectedRoom && rooms.length > 0 && (
                            <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sticky top-8 text-center">
                                <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-400">Selecione um quarto para gerenciar adicionais</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-8 bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-black text-white mb-4">Resumo de Quartos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total de Quartos</p>
                            <p className="text-amber-400 font-black text-2xl">{rooms.length}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Diária Média</p>
                            <p className="text-amber-400 font-black text-2xl">
                                {rooms.length > 0 
                                    ? formatCurrency(rooms.reduce((sum, r) => sum + r.basePrice, 0) / rooms.length)
                                    : 'N/A'
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Adicionais Cadastrados</p>
                            <p className="text-amber-400 font-black text-2xl">
                                {rooms.reduce((sum, r) => sum + r.additionals.length, 0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Valor Médio de Extras</p>
                            <p className="text-amber-400 font-black text-2xl">
                                {(() => {
                                    const totalAdditionals = rooms.reduce((sum, r) => sum + r.additionals.length, 0);
                                    const totalAdditionalValue = rooms.reduce((sum, r) => 
                                        sum + r.additionals.reduce((s, a) => s + a.price, 0), 0
                                    );
                                    return totalAdditionals > 0 
                                        ? formatCurrency(totalAdditionalValue / totalAdditionals)
                                        : 'N/A';
                                })()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditResidence;
