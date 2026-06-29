import { useEffect, useMemo, useState } from 'react'
import {
    AlertCircle,
    ArrowLeft,
    Baby,
    Bed,
    BedDouble,
    CheckCircle2,
    Home,
    MapPin,
    Plus,
    RefreshCw,
    Trash2,
    Users
} from 'lucide-react'
import { api } from '../../../services/api'
import {
    ensureHostSession,
    filterHostResidences,
    filterRoomsByResidences,
    getHostEmail
} from '../../../services/auth'

const initialRoomForm = {
    codigo: '',
    tipo: 'INDIVIDUAL',
    valorBase: '',
    possuiArCondicionado: false,
    possuiHidromassagem: false,
    quantidadeCamasSolteiro: 1,
    quantidadeCamasCasal: 0,
    quantidadeCamasQueen: 0,
    quantidadeCamasKing: 0,
    quantidadeAmbientes: 1,
    valorAdicionalPorCamaSolteiro: 0,
    valorAdicionalCamaCasal: 0,
    valorAdicionalCamaQueenKing: 0,
    taxaBerco: 0,
    percentualAdicionalPorHospede: 8,
    permiteBerco: false,
    tipoCamaCasal: 'CASAL_PADRAO'
}

function Residences() {
    const hostEmail = getHostEmail()
    const [residences, setResidences] = useState([])
    const [rooms, setRooms] = useState([])
    const [selectedResidence, setSelectedResidence] = useState(null)
    const [showNewRoomForm, setShowNewRoomForm] = useState(false)
    const [newRoomForm, setNewRoomForm] = useState(initialRoomForm)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        setError('')
        try {
            ensureHostSession()
            const email = getHostEmail()
            const [residenciasData, quartosData] = await Promise.all([
                api.listResidencias(),
                api.listQuartos()
            ])
            const hostResidences = filterHostResidences(residenciasData, email)
            setResidences(hostResidences)
            setRooms(filterRoomsByResidences(quartosData, hostResidences))
            setSelectedResidence((current) => {
                if (!current) return null
                return hostResidences.find((item) => item.id === current.id) || null
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const selectedRooms = useMemo(() => {
        if (!selectedResidence) return []
        return rooms.filter((room) => room.residenciaId === selectedResidence.id)
    }, [rooms, selectedResidence])

    const handleRoomInput = (e) => {
        const { name, value, type, checked } = e.target
        setNewRoomForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleAddRoom = async () => {
        if (!selectedResidence || !newRoomForm.codigo || !newRoomForm.valorBase) {
            setError('Informe codigo e valor base do quarto.')
            return
        }

        setSaving(true)
        setError('')
        setMessage('')

        try {
            await api.createQuarto(buildRoomPayload(newRoomForm, selectedResidence.id))
            setNewRoomForm(initialRoomForm)
            setShowNewRoomForm(false)
            setMessage('Quarto cadastrado com sucesso.')
            await loadData()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteRoom = async (roomId) => {
        setError('')
        setMessage('')
        try {
            await api.deleteQuarto(roomId)
            setMessage('Quarto removido.')
            await loadData()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDeleteResidence = async (residenceId) => {
        setError('')
        setMessage('')
        try {
            await api.deleteResidencia(residenceId)
            setSelectedResidence(null)
            setMessage('Residencia removida.')
            await loadData()
        } catch (err) {
            setError(err.message)
        }
    }

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(value || 0))

    if (selectedResidence) {
        return (
            <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 min-h-screen pt-8 pb-12 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <button
                        onClick={() => setSelectedResidence(null)}
                        className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold mb-8 transition"
                    >
                        <ArrowLeft size={20} /> Voltar para Residencias
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-black mb-2">
                                {selectedResidence.endereco}, {selectedResidence.numero}
                            </h1>
                            <p className="text-gray-400 flex items-center gap-2">
                                <MapPin size={18} /> {selectedResidence.bairro} - CEP {selectedResidence.cep}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowNewRoomForm(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-3 rounded-xl font-black transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Novo Quarto
                        </button>
                    </div>

                    <Feedback error={error} message={message} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <SummaryCard title="Quartos" value={selectedRooms.length} icon={<BedDouble className="text-amber-400" />} />
                        <SummaryCard title="Capacidade Total" value={selectedRooms.reduce((sum, room) => sum + Number(room.capacidadeMaxima || 0), 0)} icon={<Users className="text-blue-400" />} />
                        <SummaryCard title="Diaria Media" value={selectedRooms.length ? formatCurrency(selectedRooms.reduce((sum, room) => sum + Number(room.valorBase || 0), 0) / selectedRooms.length) : 'N/A'} icon={<Bed className="text-green-400" />} />
                    </div>

                    {showNewRoomForm && (
                        <RoomForm
                            form={newRoomForm}
                            onChange={handleRoomInput}
                            onCancel={() => setShowNewRoomForm(false)}
                            onSave={handleAddRoom}
                            saving={saving}
                        />
                    )}

                    {selectedRooms.length === 0 ? (
                        <EmptyState text="Nenhum quarto cadastrado para esta residencia." />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {selectedRooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    onDelete={() => handleDeleteRoom(room.id)}
                                    formatCurrency={formatCurrency}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-8 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Minhas Residencias</h1>
                        <p className="text-gray-400">{residences.length} propriedades vinculadas a {hostEmail || 'sua conta'}</p>
                    </div>
                    <button
                        onClick={loadData}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl font-bold transition flex items-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Atualizar
                    </button>
                </div>

                <Feedback error={error} message={message} />

                {loading ? (
                    <EmptyState text="Carregando residencias..." />
                ) : residences.length === 0 ? (
                    <EmptyState text="Nenhuma residencia cadastrada. Use a aba Adicionar Residencia." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {residences.map((residence) => {
                            const totalRooms = rooms.filter((room) => room.residenciaId === residence.id).length
                            return (
                                <div key={residence.id} className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group">
                                    <div className="h-40 bg-slate-800 flex items-center justify-center">
                                        <Home size={48} className="text-slate-600" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                                            {residence.endereco}, {residence.numero}
                                        </h3>
                                        <div className="flex items-center gap-1 text-gray-400 text-sm mb-6">
                                            <MapPin size={16} className="text-amber-500" />
                                            {residence.bairro}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <InfoPill label="Quartos" value={totalRooms} />
                                            <InfoPill label="Alugueis" value={residence.quantidadeAlugueis || 0} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedResidence(residence)}
                                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-black transition uppercase text-xs tracking-widest"
                                            >
                                                Gerenciar Quartos
                                            </button>
                                            <button
                                                onClick={() => handleDeleteResidence(residence.id)}
                                                className="px-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition border border-red-500/20"
                                                title="Excluir residencia"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

function buildRoomPayload(form, residenciaId) {
    const tipo = form.tipo
    const payload = {
        codigo: form.codigo,
        tipo,
        valorBase: numberOrZero(form.valorBase),
        possuiArCondicionado: Boolean(form.possuiArCondicionado),
        possuiHidromassagem: Boolean(form.possuiHidromassagem),
        residenciaId
    }

    if (tipo === 'INDIVIDUAL') {
        return {
            ...payload,
            quantidadeCamasSolteiro: numberOrZero(form.quantidadeCamasSolteiro),
            valorAdicionalPorCamaSolteiro: numberOrZero(form.valorAdicionalPorCamaSolteiro),
            permiteBerco: false
        }
    }

    if (tipo === 'DUPLO' || tipo === 'CASAL') {
        return {
            ...payload,
            tipoCamaCasal: form.tipoCamaCasal,
            permiteBerco: Boolean(form.permiteBerco),
            taxaBerco: numberOrZero(form.taxaBerco),
            valorAdicionalCamaCasal: numberOrZero(form.valorAdicionalCamaCasal),
            valorAdicionalCamaQueenKing: numberOrZero(form.valorAdicionalCamaQueenKing)
        }
    }

    return {
        ...payload,
        quantidadeCamasSolteiro: numberOrZero(form.quantidadeCamasSolteiro),
        quantidadeCamasCasal: numberOrZero(form.quantidadeCamasCasal),
        quantidadeCamasQueen: numberOrZero(form.quantidadeCamasQueen),
        quantidadeCamasKing: numberOrZero(form.quantidadeCamasKing),
        quantidadeAmbientes: numberOrZero(form.quantidadeAmbientes),
        percentualAdicionalPorHospede: numberOrZero(form.percentualAdicionalPorHospede)
    }
}

function numberOrZero(value) {
    return Number(value || 0)
}

function RoomForm({ form, onChange, onCancel, onSave, saving }) {
    const isIndividual = form.tipo === 'INDIVIDUAL'
    const isDouble = form.tipo === 'DUPLO' || form.tipo === 'CASAL'
    const isFamily = form.tipo === 'FAMILIA'

    return (
        <div className="bg-slate-900/70 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-2xl font-black text-white mb-6">Novo Quarto</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Codigo" name="codigo" value={form.codigo} onChange={onChange} placeholder="Ex: 101" />
                <Select label="Tipo" name="tipo" value={form.tipo} onChange={onChange}>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="DUPLO">Duplo / Casal</option>
                    <option value="FAMILIA">Familia</option>
                </Select>
                <Field label="Valor base" name="valorBase" type="number" value={form.valorBase} onChange={onChange} placeholder="250.00" step="0.01" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <Checkbox label="Possui ar-condicionado" name="possuiArCondicionado" checked={form.possuiArCondicionado} onChange={onChange} />
                <Checkbox label="Possui hidromassagem" name="possuiHidromassagem" checked={form.possuiHidromassagem} onChange={onChange} />
            </div>

            {isIndividual && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Field label="Camas de solteiro" name="quantidadeCamasSolteiro" type="number" value={form.quantidadeCamasSolteiro} onChange={onChange} min="1" />
                    <Field label="Adicional por cama extra" name="valorAdicionalPorCamaSolteiro" type="number" value={form.valorAdicionalPorCamaSolteiro} onChange={onChange} step="0.01" />
                </div>
            )}

            {isDouble && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Select label="Cama do casal" name="tipoCamaCasal" value={form.tipoCamaCasal} onChange={onChange}>
                        <option value="CASAL_PADRAO">Casal padrao</option>
                        <option value="QUEEN">Queen</option>
                        <option value="KING">King</option>
                    </Select>
                    <Field label="Adicional cama casal" name="valorAdicionalCamaCasal" type="number" value={form.valorAdicionalCamaCasal} onChange={onChange} step="0.01" />
                    <Field label="Adicional queen/king" name="valorAdicionalCamaQueenKing" type="number" value={form.valorAdicionalCamaQueenKing} onChange={onChange} step="0.01" />
                    <Checkbox label="Permite solicitar berco" name="permiteBerco" checked={form.permiteBerco} onChange={onChange} />
                    <Field label="Taxa de berco" name="taxaBerco" type="number" value={form.taxaBerco} onChange={onChange} step="0.01" />
                </div>
            )}

            {isFamily && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Field label="Camas solteiro" name="quantidadeCamasSolteiro" type="number" value={form.quantidadeCamasSolteiro} onChange={onChange} min="0" />
                    <Field label="Camas casal" name="quantidadeCamasCasal" type="number" value={form.quantidadeCamasCasal} onChange={onChange} min="0" />
                    <Field label="Camas queen" name="quantidadeCamasQueen" type="number" value={form.quantidadeCamasQueen} onChange={onChange} min="0" />
                    <Field label="Camas king" name="quantidadeCamasKing" type="number" value={form.quantidadeCamasKing} onChange={onChange} min="0" />
                    <Field label="Ambientes" name="quantidadeAmbientes" type="number" value={form.quantidadeAmbientes} onChange={onChange} min="1" />
                    <Field label="% adicional por hospede" name="percentualAdicionalPorHospede" type="number" value={form.percentualAdicionalPorHospede} onChange={onChange} step="0.01" />
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-3">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-black px-6 py-3 rounded-xl font-black transition"
                >
                    {saving ? 'Salvando...' : 'Salvar Quarto'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-slate-700/50 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}

function RoomCard({ room, onDelete, formatCurrency }) {
    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition">
            <div className="flex items-start justify-between mb-5">
                <div>
                    <p className="text-sm text-gray-400">Quarto {room.codigo}</p>
                    <h3 className="text-xl font-black text-white">{labelTipo(room.tipo)}</h3>
                </div>
                <button onClick={onDelete} className="text-red-400 hover:text-red-300 transition" title="Excluir quarto">
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
                <InfoPill label="Base" value={formatCurrency(room.valorBase)} />
                <InfoPill label="Capacidade" value={`${room.capacidadeMaxima || 0} hosp.`} />
            </div>

            <div className="space-y-2 text-sm text-slate-300">
                {room.tipo === 'INDIVIDUAL' && (
                    <Line icon={<Bed size={16} />} text={`${room.quantidadeCamasSolteiro || 0} cama(s) de solteiro`} />
                )}
                {(room.tipo === 'DUPLO' || room.tipo === 'CASAL') && (
                    <>
                        <Line icon={<BedDouble size={16} />} text={`Cama ${labelCama(room.tipoCamaCasal)}`} />
                        <Line icon={<Baby size={16} />} text={room.permiteBerco ? `Berco disponivel: ${formatCurrency(room.taxaBerco)}` : 'Sem berco'} />
                    </>
                )}
                {room.tipo === 'FAMILIA' && (
                    <>
                        <Line icon={<Users size={16} />} text={`${room.quantidadeAmbientes || 0} ambiente(s)`} />
                        <Line icon={<Bed size={16} />} text={`${totalCamas(room)} cama(s) configuradas`} />
                    </>
                )}
                <Line icon={<CheckCircle2 size={16} />} text={`${room.possuiArCondicionado ? 'Com' : 'Sem'} ar-condicionado`} />
                <Line icon={<CheckCircle2 size={16} />} text={`${room.possuiHidromassagem ? 'Com' : 'Sem'} hidromassagem`} />
            </div>
        </div>
    )
}

function labelTipo(tipo) {
    const labels = { INDIVIDUAL: 'Individual', DUPLO: 'Duplo / Casal', CASAL: 'Casal', FAMILIA: 'Familia' }
    return labels[tipo] || tipo
}

function labelCama(tipo) {
    const labels = { CASAL_PADRAO: 'casal padrao', QUEEN: 'queen', KING: 'king' }
    return labels[tipo] || 'casal'
}

function totalCamas(room) {
    return Number(room.quantidadeCamasSolteiro || 0)
        + Number(room.quantidadeCamasCasal || 0)
        + Number(room.quantidadeCamasQueen || 0)
        + Number(room.quantidadeCamasKing || 0)
}

function Field({ label, name, value, onChange, placeholder, type = 'text', step, min }) {
    return (
        <div>
            <label className="block text-white font-bold mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                step={step}
                min={min}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
            />
        </div>
    )
}

function Select({ label, name, value, onChange, children }) {
    return (
        <div>
            <label className="block text-white font-bold mb-2">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
            >
                {children}
            </select>
        </div>
    )
}

function Checkbox({ label, name, checked, onChange }) {
    return (
        <label className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold cursor-pointer hover:border-amber-500/50 transition">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} className="accent-amber-500" />
            <span>{label}</span>
        </label>
    )
}

function SummaryCard({ title, value, icon }) {
    return (
        <div className="bg-slate-800/30 border border-slate-700/50 p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">{title}</span>
                {icon}
            </div>
            <span className="text-2xl font-black text-white">{value}</span>
        </div>
    )
}

function InfoPill({ label, value }) {
    return (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3">
            <p className="text-[10px] text-slate-500 uppercase font-bold">{label}</p>
            <p className="text-white font-black mt-1">{value}</p>
        </div>
    )
}

function Line({ icon, text }) {
    return (
        <div className="flex items-center gap-2 text-slate-300">
            <span className="text-amber-400">{icon}</span>
            <span>{text}</span>
        </div>
    )
}

function Feedback({ error, message }) {
    return (
        <>
            {message && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex gap-3 text-green-300 mb-6">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{message}</span>
                </div>
            )}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3 text-red-300 mb-6">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
        </>
    )
}

function EmptyState({ text }) {
    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-10 text-center text-slate-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-500" />
            <p>{text}</p>
        </div>
    )
}

export default Residences
