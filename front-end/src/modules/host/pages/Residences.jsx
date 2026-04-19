import React, { useState } from 'react';
import {
    Home, Star, MapPin, Users, Trash2, Edit, Eye, 
    ArrowLeft, BedDouble, CheckCircle2
} from 'lucide-react';

function Residences() {
    const amenitiesList = [
        'Wi-Fi', 'Estacionamento', 'Piscina', 'Café da Manhã',
        'Vista para o Mar', 'Churrasqueira'
    ];

    const [viewingResidence, setViewingResidence] = useState(null);
    const [showNewRoomForm, setShowNewRoomForm] = useState(false);
    const [newRoomForm, setNewRoomForm] = useState({
        number: '',
        type: '',
        price: '',
        amenities: [],
        status: 'Disponível',
        extrasEnabled: false,
        extras: [],
        extraName: '',
        extraPrice: ''
    });
    const [imageErrors, setImageErrors] = useState({});
    const [residences, setResidences] = useState([
        {
            id: 1,
            name: 'Casa à Beira-Mar Premium',
            location: 'Praia de Taipipe, Maraú',
            guests: 6,
            price: 450.00,
            rating: 4.8,
            reviews: 23,
            occupancy: 85,
            image: 'casa_beira_mar.jpg',
            rooms: [
                { id: 101, type: 'Casal Master', price: 250, amenities: ['Wi-Fi', 'Vista para o Mar'], status: 'Ocupado', extras: [] },
                { id: 102, type: 'Solteiro Luxo', price: 150, amenities: ['Wi-Fi'], status: 'Disponível', extras: [] },
                { id: 103, type: 'Casal Standard', price: 200, amenities: ['Wi-Fi'], status: 'Disponível', extras: [] }
            ]
        },
        {
            id: 2,
            name: 'Chalé Aconchegante',
            location: 'Zona Rural, Maraú',
            guests: 4,
            price: 280.00,
            rating: 4.9,
            reviews: 18,
            occupancy: 70,
            image: 'chale_marau.jpg',
            rooms: [
                { id: 201, type: 'Casal', price: 180, amenities: ['Wi-Fi'], status: 'Disponível', extras: [] },
                { id: 202, type: 'Solteiro', price: 100, amenities: ['Wi-Fi'], status: 'Ocupado', extras: [] }
            ]
        }
    ]);

    const handleImageError = (residenceId) => {
        setImageErrors(prev => ({
            ...prev,
            [residenceId]: true
        }));
    };

    const handleNewRoomInput = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRoomForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleToggleAmenity = (amenity) => {
        setNewRoomForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleAddNewExtra = () => {
        if (!newRoomForm.extraName || !newRoomForm.extraPrice) {
            return;
        }

        setNewRoomForm(prev => ({
            ...prev,
            extras: [
                ...prev.extras,
                {
                    id: Date.now(),
                    name: prev.extraName,
                    price: Number(prev.extraPrice)
                }
            ],
            extraName: '',
            extraPrice: ''
        }));
    };

    const handleRemoveNewExtra = (extraId) => {
        setNewRoomForm(prev => ({
            ...prev,
            extras: prev.extras.filter((extra) => extra.id !== extraId)
        }));
    };

    const handleAddNewRoom = () => {
        if (!newRoomForm.number || !newRoomForm.type || !newRoomForm.price) {
            return;
        }

        const newRoom = {
            id: Date.now(),
            number: newRoomForm.number,
            type: newRoomForm.type,
            price: Number(newRoomForm.price),
            amenities: newRoomForm.amenities,
            status: newRoomForm.status,
            extras: newRoomForm.extras
        };

        setResidences(prev => prev.map(residence => {
            if (residence.id === viewingResidence.id) {
                return {
                    ...residence,
                    rooms: [...residence.rooms, newRoom]
                };
            }
            return residence;
        }));

        setViewingResidence(prev => ({
            ...prev,
            rooms: [...prev.rooms, newRoom]
        }));

        setNewRoomForm({
            number: '',
            type: '',
            price: '',
            amenities: [],
            status: 'Disponível',
            extrasEnabled: false,
            extras: [],
            extraName: '',
            extraPrice: ''
        });
        setShowNewRoomForm(false);
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // --- TELA DE DETALHES (QUARTOS) ---
    if (viewingResidence) {
        return (
            <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 min-h-screen pt-8 pb-12 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <button 
                        onClick={() => setViewingResidence(null)}
                        className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold mb-8 transition"
                    >
                        <ArrowLeft size={20} /> Voltar para Residências
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-black mb-2">{viewingResidence.name}</h1>
                            <p className="text-gray-400 flex items-center gap-2"><MapPin size={18}/> {viewingResidence.location}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold">Ocupação Geral</p>
                            <p className="text-2xl font-black text-amber-500">{viewingResidence.occupancy}%</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BedDouble className="text-amber-500" /> Gerenciamento de Quartos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {viewingResidence.rooms.map(room => (
                            <div key={room.id} className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6 hover:border-amber-500/30 transition shadow-xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-black">Quarto {room.id}</h3>
                                        <p className="text-amber-500 font-bold">{room.type}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${room.status === 'Disponível' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                        {room.status}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase font-bold mb-2">Comodidades inclusas</p>
                                        {room.amenities && room.amenities.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {room.amenities.map((amenity) => (
                                                    <span key={amenity} className="bg-slate-700/50 text-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-600 text-sm">Nenhuma comodidade inclusa</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-400 uppercase font-bold mb-2">Comodidades extras</p>
                                        {room.extras && room.extras.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {room.extras.map((extra) => (
                                                    <span key={extra.id} className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
                                                        {extra.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-600 text-sm">Nenhuma</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-700/50">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Diária Base</p>
                                            <p className="text-xl font-black">{formatCurrency(room.price)}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mt-2">Valor Extra</p>
                                            <p className="text-lg font-bold text-amber-400">
                                                {formatCurrency(room.extras ? room.extras.reduce((sum, item) => sum + item.price, 0) : 0)}
                                            </p>
                                        </div>
                                        <button className="p-3 bg-slate-700/50 hover:bg-slate-600 rounded-xl transition">
                                            <Edit size={18} />
                                        </button>
                                    </div>
                                    {room.extras && room.extras.length > 0 && (
                                        <div className="mt-4 bg-slate-900/70 border border-slate-700 rounded-2xl p-4 space-y-2">
                                            <p className="text-sm text-gray-400 uppercase font-bold">Detalhes dos Extras</p>
                                            {room.extras.map((extra) => (
                                                <div key={extra.id} className="flex items-center justify-between text-sm text-white">
                                                    <span>{extra.name}</span>
                                                    <span className="text-amber-400">R$ {extra.price.toFixed(2)}</span>
                                                </div>
                                            ))}
                                            <div className="flex items-center justify-between text-sm text-amber-200 font-bold pt-2 border-t border-slate-700/50">
                                                <span>Total Extras</span>
                                                <span>R$ {room.extras.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* Card Adicionar Quarto (RF10) */}
                        <button
                            onClick={() => setShowNewRoomForm(true)}
                            className="border-2 border-dashed border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-amber-500/50 hover:text-amber-500 transition group"
                        >
                            <div className="p-4 bg-slate-800/50 rounded-full mb-3 group-hover:bg-amber-500/10 transition">
                                <BedDouble size={32} />
                            </div>
                            <span className="font-bold">Adicionar Novo Quarto</span>
                        </button>
                    </div>

                    {showNewRoomForm && (
                        <div className="mt-8 bg-slate-900/70 border border-amber-500/30 rounded-3xl p-6">
                            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-white">Novo Quarto</h3>
                                    <p className="text-gray-400 text-sm">Preencha os dados do quarto e clique em salvar.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-white font-bold mb-2">Número do Quarto</label>
                                    <input
                                        type="text"
                                        name="number"
                                        value={newRoomForm.number}
                                        onChange={handleNewRoomInput}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                                        placeholder="Ex: 104"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-bold mb-2">Tipo de Quarto</label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={newRoomForm.type}
                                        onChange={handleNewRoomInput}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                                        placeholder="Ex: Casal Standard"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-bold mb-2">Preço por Noite</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newRoomForm.price}
                                        onChange={handleNewRoomInput}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                                        placeholder="Ex: 220"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-bold mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={newRoomForm.status}
                                        onChange={handleNewRoomInput}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                                    >
                                        <option value="Disponível">Disponível</option>
                                        <option value="Ocupado">Indisponível</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-white font-bold mb-3">Comodidades inclusas</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {amenitiesList.map((amenity) => (
                                            <label key={amenity} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 cursor-pointer hover:border-amber-500/50 transition">
                                                <input
                                                    type="checkbox"
                                                    checked={newRoomForm.amenities.includes(amenity)}
                                                    onChange={() => handleToggleAmenity(amenity)}
                                                    className="accent-amber-500"
                                                />
                                                <span>{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 text-white font-bold cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="extrasEnabled"
                                        checked={newRoomForm.extrasEnabled}
                                        onChange={handleNewRoomInput}
                                        className="accent-amber-500"
                                    />
                                    Adicionar comodidades extras?
                                </label>

                                {newRoomForm.extrasEnabled && (
                                    <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-white font-bold mb-2">Nome da Extra</label>
                                                <input
                                                    type="text"
                                                    name="extraName"
                                                    value={newRoomForm.extraName}
                                                    onChange={handleNewRoomInput}
                                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                                                    placeholder="Ex: Hidromassagem"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white font-bold mb-2">Valor da Extra</label>
                                                <input
                                                    type="number"
                                                    name="extraPrice"
                                                    value={newRoomForm.extraPrice}
                                                    onChange={handleNewRoomInput}
                                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                                                    placeholder="Ex: 100"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddNewExtra}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-bold transition"
                                        >
                                            Adicionar Extra
                                        </button>

                                        {newRoomForm.extras.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-400 font-semibold">Extras adicionados</p>
                                                {newRoomForm.extras.map((extra) => (
                                                    <div key={extra.id} className="flex items-center justify-between bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3">
                                                        <span className="text-white">{extra.name}</span>
                                                        <span className="text-amber-400">R$ {extra.price.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddNewRoom}
                                    className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-2xl font-bold transition"
                                >
                                    Adicionar Quarto
                                </button>
                                <button
                                    onClick={() => setShowNewRoomForm(false)}
                                    className="bg-slate-700/50 hover:bg-slate-600 text-white px-6 py-3 rounded-2xl font-bold transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- LISTA PRINCIPAL DE RESIDÊNCIAS ---
    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-8 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Minhas Residências</h1>
                    <p className="text-gray-400">{residences.length} propriedades ativas no sistema</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {residences.map((residence) => (
                        <div key={residence.id} className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all group">
                            <div className="h-52 bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                {!imageErrors[residence.id] ? (
                                    <img
                                        src={`/img/${residence.image}`}
                                        alt={residence.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        onError={() => handleImageError(residence.id)}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                        <Home size={48} className="text-slate-600" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-black">
                                    {residence.occupancy}% OCUPADO
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">{residence.name}</h3>
                                <div className="flex items-center gap-1 text-gray-400 text-sm mb-6">
                                    <MapPin size={16} className="text-amber-500" /> {residence.location}
                                </div>

                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700/50">
                                    <div className="flex items-center gap-1 text-white font-bold">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" /> {residence.rating}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm italic">
                                        <Users size={16} /> {residence.guests} hóspedes
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setViewingResidence(residence)}
                                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-black transition flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                                    >
                                        <Eye size={18} /> Visualizar Detalhes
                                    </button>
                                    <button className="px-4 bg-slate-700/50 hover:bg-slate-600 text-white rounded-xl transition">
                                        <Edit size={18} />
                                    </button>
                                    <button className="px-4 bg-red-500/10 hover:bg-red-500 text-red-500 rounded-xl transition border border-red-500/20">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Residences;