import React, { useState } from 'react';
import { Upload, Plus, Trash2, AlertCircle } from 'lucide-react';

function AddResidence() {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        guestCapacity: 1,
        nightPrice: '',
        description: '',
        amenities: [],
        photos: []
    });

    const [amenityInput, setAmenityInput] = useState('');

    const amenitiesList = [
        'WiFi',
        'Piscina',
        'Churrasqueira',
        'Cozinha Equipada',
        'Oferecimento de Café da Manhã',
        'TV',
        'Garagem',
        'Jardim',
        'Vista para o Mar'
    ];

    const handleAddAmenity = (amenity) => {
        if (!formData.amenities.includes(amenity)) {
            setFormData({
                ...formData,
                amenities: [...formData.amenities, amenity]
            });
        }
    };

    const handleRemoveAmenity = (amenity) => {
        setFormData({
            ...formData,
            amenities: formData.amenities.filter(a => a !== amenity)
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-8 pb-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2">Adicionar Nova Residência</h1>
                    <p className="text-gray-400">Preencha os detalhes da sua nova propriedade</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                        <h2 className="text-2xl font-black text-white mb-6">Informações Básicas</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white font-bold mb-2">Nome da Residência *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Casa à Beira-Mar Premium"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white font-bold mb-2">Localização *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Praia de Taipipe, Maraú"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white font-bold mb-2">Capacidade de Hóspedes *</label>
                                    <select
                                        name="guestCapacity"
                                        value={formData.guestCapacity}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                                        required
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <option key={n} value={n}>{n} hóspede(s)</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-bold mb-2">Preço por Noite (R$) *</label>
                                    <input
                                        type="number"
                                        name="nightPrice"
                                        value={formData.nightPrice}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 450.00"
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-bold mb-2">Descrição</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Descreva sua propriedade..."
                                    rows="5"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                        <h2 className="text-2xl font-black text-white mb-6">Comodidades</h2>

                        <div>
                            <p className="text-gray-400 text-sm mb-4">Selecione as comodidades disponíveis na propriedade</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {amenitiesList.map((amenity) => (
                                    <button
                                        key={amenity}
                                        type="button"
                                        onClick={() => handleAddAmenity(amenity)}
                                        className={`px-4 py-3 rounded-xl font-semibold transition ${
                                            formData.amenities.includes(amenity)
                                                ? 'bg-amber-500 text-black'
                                                : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 hover:text-white'
                                        }`}
                                    >
                                        {amenity}
                                    </button>
                                ))}
                            </div>

                            {formData.amenities.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-gray-400 text-sm mb-3">Selecionados:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.amenities.map((amenity) => (
                                            <div
                                                key={amenity}
                                                className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold"
                                            >
                                                {amenity}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAmenity(amenity)}
                                                    className="hover:text-amber-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Photos */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                        <h2 className="text-2xl font-black text-white mb-6">Fotos da Propriedade</h2>

                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition cursor-pointer">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-white font-bold mb-1">Arraste fotos ou clique para selecionar</p>
                            <p className="text-gray-400 text-sm">PNG, JPG até 10MB</p>
                            <input type="file" multiple accept="image/*" className="hidden" />
                        </div>
                    </div>

                    {/* Alert */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-blue-400 font-bold text-sm">Informação Importante</p>
                            <p className="text-blue-300 text-sm mt-1">
                                Tenha certeza de que todas as informações estão corretas. Você poderá editá-las depois no painel de propriedades.
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black py-3 rounded-xl font-black text-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Adicionar Residência
                        </button>
                        <button
                            type="button"
                            className="px-8 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl font-bold transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddResidence;
