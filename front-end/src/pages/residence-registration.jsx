import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, MapPin, DollarSign, Users, FileText, ArrowRight } from 'lucide-react'

function ResidenceRegistration() {
    const [propertyName, setPropertyName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [maxGuests, setMaxGuests] = useState('')
    const [amenities, setAmenities] = useState([])

    const handleAmenityChange = (amenity) => {
        setAmenities(prev => 
            prev.includes(amenity) 
                ? prev.filter(a => a !== amenity) 
                : [...prev, amenity]
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('Residence Registration:', { 
            propertyName, 
            address, 
            city, 
            state, 
            country, 
            description, 
            price, 
            maxGuests, 
            amenities 
        })
        // Here you would typically send the data to the backend
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-400 selection:text-black antialiased">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                    <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-blue-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[5%] right-[-5%] w-[45%] h-[45%] bg-amber-600/10 blur-[150px] rounded-full" />
                </div>
            </div>

            <div className="min-h-screen flex items-center justify-center px-6 py-24">
                <div className="w-full max-w-4xl">
                    <div className="rounded-[3rem] bg-[#0d0d0f]/90 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl p-10 sm:p-12">
                        <div className="mb-8">
                            <img src="/icons/icon.png" alt="" className="w-16 h-16 mx-auto" />
                            <h2 className="mt-4 text-3xl font-black">Cadastrar Residência</h2>
                            <p className="text-gray-400 mt-3">Preencha os dados da sua propriedade para cadastrá-la na plataforma.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <label className="block space-y-3">
                                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                                    <Home size={16} /> Nome da Propriedade
                                </span>
                                <input
                                    type="text"
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    placeholder="Ex: Casa de Praia em Maraú"
                                    className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                    required
                                />
                            </label>

                            <label className="block space-y-3">
                                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                                    <MapPin size={16} /> Endereço
                                </span>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Rua, número, bairro"
                                    className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                    required
                                />
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <label className="block space-y-3">
                                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Cidade</span>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Cidade"
                                        className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                        required
                                    />
                                </label>

                                <label className="block space-y-3">
                                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Estado</span>
                                    <input
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="Estado"
                                        className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                        required
                                    />
                                </label>

                                <label className="block space-y-3">
                                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">País</span>
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="País"
                                        className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                        required
                                    />
                                </label>
                            </div>

                            <label className="block space-y-3">
                                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                                    <FileText size={16} /> Descrição
                                </span>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descreva a propriedade, comodidades, etc."
                                    rows="4"
                                    className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                    required
                                />
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block space-y-3">
                                    <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                                        <DollarSign size={16} /> Preço por Noite (R$)
                                    </span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="Ex: 150"
                                        className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                        required
                                    />
                                </label>

                                <label className="block space-y-3">
                                    <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                                        <Users size={16} /> Máximo de Hóspedes
                                    </span>
                                    <input
                                        type="number"
                                        value={maxGuests}
                                        onChange={(e) => setMaxGuests(e.target.value)}
                                        placeholder="Ex: 4"
                                        className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                                        required
                                    />
                                </label>
                            </div>

                            <div className="space-y-3">
                                <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Comodidades</span>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {['Wi-Fi', 'Piscina', 'Ar Condicionado', 'Cozinha', 'Estacionamento', 'Pet Friendly'].map(amenity => (
                                        <label key={amenity} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={amenities.includes(amenity)}
                                                onChange={() => handleAmenityChange(amenity)}
                                                className="rounded border-white/10 bg-[#111] text-amber-400 focus:ring-amber-400"
                                            />
                                            <span className="text-white">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-3xl bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-4 font-bold text-black transition hover:from-amber-500 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0d0d0f]"
                            >
                                Cadastrar Residência
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-gray-400 hover:text-amber-400 transition">
                                Já tem uma conta? Faça login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResidenceRegistration