import { forwardRef, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import { MapPin, Calendar as CalendarIcon, Users, ChevronDown, Search } from 'lucide-react'
import { DEFAULT_LOCATION, GUEST_OPTIONS } from '../utils/searchUtils'
import { usePublicTheme } from '../hooks/usePublicTheme'

registerLocale('pt-BR', ptBR)

function Searchbar({
    location: locationProp,
    onLocationChange,
    startDate: startDateProp,
    endDate: endDateProp,
    onDatesChange,
    guests: guestsProp,
    onGuestsChange,
    searchTerm: searchTermProp,
    onSearchTermChange,
    onSearch,
    buttonText = 'Buscar'
}) {
    const t = usePublicTheme()
    const [internalLocation, setInternalLocation] = useState(DEFAULT_LOCATION)
    const [internalStartDate, setInternalStartDate] = useState(null)
    const [internalEndDate, setInternalEndDate] = useState(null)
    const [internalGuests, setInternalGuests] = useState('1')
    const [internalSearchTerm, setInternalSearchTerm] = useState('')

    const location = locationProp ?? internalLocation
    const startDate = startDateProp ?? internalStartDate
    const endDate = endDateProp ?? internalEndDate
    const guests = guestsProp ?? internalGuests
    const searchTerm = searchTermProp ?? internalSearchTerm

    const showSearchField = typeof searchTermProp !== 'undefined' || typeof onSearchTermChange === 'function' || onSearch

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
                <span className={`text-sm font-medium ${value ? t.searchFieldText : t.searchPlaceholder}`}>
                    {value || placeholder}
                </span>
            </div>
            <ChevronDown size={14} className={t.searchPlaceholder} />
        </div>
    ))

    const handleLocationChange = (event) => {
        if (onLocationChange) {
            onLocationChange(event)
        } else {
            setInternalLocation(event.target.value)
        }
    }

    const handleDatesChange = (dates) => {
        if (onDatesChange) {
            onDatesChange(dates)
            return
        }
        const [start, end] = dates
        setInternalStartDate(start)
        setInternalEndDate(end)
    }

    const handleGuestsChange = (event) => {
        if (onGuestsChange) {
            onGuestsChange(event)
        } else {
            setInternalGuests(event.target.value)
        }
    }

    const handleSearchTermChange = (value) => {
        if (onSearchTermChange) {
            onSearchTermChange(value)
        } else {
            setInternalSearchTerm(value)
        }
    }

    const handleSearch = () => {
        onSearch?.({
            location,
            startDate,
            endDate,
            guests,
            searchTerm
        })
    }

    const divider = `border-b md:border-b-0 md:border-r ${t.searchDivider}`

    return (
        <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-40">
            <div className={`p-4 md:p-6 rounded-[3rem] ${t.searchShell}`}>
                <div className={`grid gap-4 ${showSearchField ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-4'} items-center`}>
                    <div className={`p-4 md:px-8 ${divider} group`}>
                        <label className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Onde</label>
                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-amber-400" />
                            <input
                                value={location}
                                onChange={handleLocationChange}
                                readOnly={!onLocationChange && locationProp !== undefined}
                                type="text"
                                placeholder="Bairro ou regiao"
                                className={`bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full outline-none ${t.searchFieldText} placeholder:${t.searchPlaceholder}`}
                            />
                        </div>
                    </div>
                    <div className={`p-4 md:px-8 ${divider}`}>
                        <DatePicker
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDatesChange}
                            locale="pt-BR"
                            minDate={new Date()}
                            placeholderText="Entrada — Saida"
                            calendarClassName="public-datepicker"
                            customInput={<CustomDateInput placeholder="Entrada — Saida" />}
                        />
                    </div>
                    <div className={`p-4 md:px-8 ${divider} group`}>
                        <label className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Quem</label>
                        <div className="flex items-center gap-3">
                            <Users size={20} className="text-amber-400" />
                            <select
                                value={guests}
                                onChange={handleGuestsChange}
                                className={`bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full outline-none appearance-none cursor-pointer ${t.searchFieldText}`}
                            >
                                {GUEST_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value} className={t.selectOption}>{label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className={t.searchPlaceholder} />
                        </div>
                    </div>
                    {showSearchField && (
                        <div className={`p-4 md:px-8 border-b md:border-b-0 ${t.searchDivider} group`}>
                            <label className="block text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Pesquisar</label>
                            <input
                                value={searchTerm}
                                onChange={(e) => handleSearchTermChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                type="text"
                                placeholder="Buscar por nome ou local"
                                className={`bg-transparent border rounded-3xl px-4 py-3 text-sm font-bold w-full outline-none ${t.searchInputBorder} ${t.searchFieldText} placeholder:${t.searchPlaceholder}`}
                            />
                        </div>
                    )}
                    <div className="p-2 md:col-span-1">
                        <button
                            onClick={handleSearch}
                            className="w-full bg-amber-400 h-16 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-amber-300 transition shadow-xl shadow-amber-500/20 active:scale-95 group"
                            type="button"
                        >
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
