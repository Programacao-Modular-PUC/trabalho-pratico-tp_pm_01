import React, { forwardRef } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import { MapPin, Calendar as CalendarIcon, Users, ChevronDown, Search } from 'lucide-react'

registerLocale('pt-BR', ptBR)

const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div
        className="flex items-center gap-3 w-full text-left cursor-pointer group"
        onClick={onClick}
        ref={ref}
    >
        <CalendarIcon size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
        <div className="flex-grow">
            <span className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-0.5">
                Estadia
            </span>
            <span className={`text-sm font-medium ${value ? 'text-white' : 'text-gray-500'}`}>
                {value || placeholder}
            </span>
        </div>
        <ChevronDown size={14} className="text-gray-600" />
    </div>
))

function Searchbar({
    location = "Peninsula de Maraú, Bahia",
    onLocationChange,
    startDate,
    endDate,
    onDatesChange,
    guests,
    onGuestsChange,
    searchTerm,
    onSearchTermChange,
    buttonText = 'Buscar'
}) {
    const showSearchField = typeof searchTerm !== 'undefined' && typeof onSearchTermChange === 'function'

    return (
        <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-40">
            <div className="bg-[#111] border border-white/10 p-4 md:p-6 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
                <div className={`grid gap-4 ${showSearchField ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-4'} items-center`}>
                    <div className="p-4 md:px-8 border-b md:border-b-0 md:border-r border-white/5 group">
                        <label className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Onde</label>
                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-amber-400" />
                            <input
                                value={location}
                                onChange={onLocationChange}
                                readOnly={!onLocationChange}
                                type="text"
                                className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-white placeholder:text-gray-600 w-full outline-none"
                            />
                        </div>
                    </div>
                    <div className="p-4 md:px-8 border-b md:border-b-0 md:border-r border-white/5">
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={onDatesChange}
                            locale="pt-BR"
                            minDate={new Date()}
                            placeholderText="Entrada — Saída"
                            customInput={<CustomDateInput placeholder="Entrada — Saída" />}
                        />
                    </div>
                    <div className="p-4 md:px-8 border-b md:border-b-0 md:border-r border-white/5 group">
                        <label className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Quem</label>
                        <div className="flex items-center gap-3">
                            <Users size={20} className="text-amber-400" />
                            <select
                                value={guests}
                                onChange={(e) => onGuestsChange?.(e.target.value)}
                                className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-white w-full outline-none appearance-none cursor-pointer"
                            >
                                <option className="bg-black">1 Pessoa</option>
                                <option className="bg-black">2 Pessoas</option>
                                <option className="bg-black">3 Pessoas</option>
                                <option className="bg-black">4+ Pessoas</option>
                            </select>
                            <ChevronDown size={14} className="text-gray-600" />
                        </div>
                    </div>
                    {showSearchField && (
                        <div className="p-4 md:px-8 border-b md:border-b-0 border-white/5 group">
                            <label className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Pesquisar</label>
                            <input
                                value={searchTerm}
                                onChange={(e) => onSearchTermChange(e.target.value)}
                                type="text"
                                placeholder="Buscar por nome ou local"
                                className="bg-transparent border border-white/10 rounded-3xl px-4 py-3 text-sm font-bold text-white w-full outline-none placeholder:text-gray-500"
                            />
                        </div>
                    )}
                    <div className="p-2 md:col-span-1">
                        <button className="w-full bg-amber-400 h-16 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-amber-300 transition shadow-xl shadow-amber-500/20 active:scale-95 group" type="button">
                            <Search size={24} className="text-black group-hover:scale-110 transition" />
                            <span className="text-black font-black text-sm uppercase tracking-widest">{buttonText}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Searchbar
