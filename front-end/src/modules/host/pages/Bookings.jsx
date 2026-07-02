import { useEffect, useState } from 'react'
import { AlertCircle, Baby, Calendar, DollarSign, FileText, MapPin, RefreshCw, Users, X } from 'lucide-react'
import CancelReservationButton from '../../../components/CancelReservationButton'
import { api } from '../../../services/api'
import { ensureHostSession, filterHostResidences, getHostEmail } from '../../../services/auth'

function Bookings() {
    const hostEmail = getHostEmail()
    const [bookings, setBookings] = useState([])
    const [selectedReceipt, setSelectedReceipt] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        loadBookings()
    }, [])

    const loadBookings = async () => {
        setLoading(true)
        setError('')
        try {
            ensureHostSession()
            const email = getHostEmail()
            const [alugueis, residencias] = await Promise.all([
                api.listAlugueis(),
                api.listResidencias()
            ])
            const hostResidences = filterHostResidences(residencias, email)
            const hostResidenceIds = new Set(hostResidences.map((item) => item.id))
            setBookings(alugueis.filter((item) => hostResidenceIds.has(item.residenciaId)))
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(value || 0))

    const formatDate = (date) => new Date(date).toLocaleString('pt-BR')

    const handleCancelled = (booking) => {
        setBookings((current) => current.filter((item) => item.id !== booking.id))
        setSuccessMessage(`Reserva de ${booking.nomeCliente} (quarto ${booking.codigoQuarto}) cancelada.`)
        setError('')
    }

    return (
        <div className="min-h-screen p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Agendamentos</p>
                            <h1 className="mt-3 text-3xl font-black text-slate-900">Painel de Reservas</h1>
                            <p className="mt-2 text-slate-600">Reservas das propriedades de {hostEmail || 'sua conta'} — dados da API.</p>
                        </div>
                    <button
                        onClick={loadBookings}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <RefreshCw size={18} />
                        Atualizar
                    </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-700 mb-6">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 mb-6">
                        {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatusCard title="Total" value={bookings.length} icon={<Calendar className="text-blue-400" />} />
                    <StatusCard title="Hospedes" value={bookings.reduce((sum, item) => sum + Number(item.quantidadeHospedes || 0), 0)} icon={<Users className="text-green-400" />} color="text-green-400" />
                    <StatusCard title="Receita" value={formatCurrency(bookings.reduce((sum, item) => sum + Number(item.valorFinal || 0), 0))} icon={<DollarSign className="text-amber-400" />} color="text-amber-400" />
                </div>

                {loading ? (
                    <EmptyState text="Carregando reservas..." />
                ) : bookings.length === 0 ? (
                    <EmptyState text="Nenhum aluguel cadastrado ainda." />
                ) : (
                    <div className="grid gap-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 transition shadow-sm">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Hospede</span>
                                        <h3 className="text-lg font-bold text-slate-900">{booking.nomeCliente}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <MapPin size={14} /> {booking.enderecoResidencia}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Baby size={14} /> {booking.bercoSolicitado ? 'Berco solicitado' : 'Sem berco'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <Info label="Quarto" value={booking.codigoQuarto} />
                                        <Info label="Periodo" value={`${new Date(booking.dataEntrada).toLocaleDateString('pt-BR')} - ${new Date(booking.dataSaida).toLocaleDateString('pt-BR')}`} />
                                        <Info label="Diaria" value={formatCurrency(booking.valorDiaria)} highlight />
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedReceipt(booking)}
                                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
                                            >
                                                <FileText size={14} /> Recibo
                                            </button>
                                            <CancelReservationButton
                                                reservation={booking}
                                                onCancelled={handleCancelled}
                                                onError={setError}
                                                label="Cancelar"
                                                className="rounded-lg text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedReceipt && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
                        <div className="bg-amber-500 p-6 flex justify-between items-center text-black">
                            <h2 className="font-black text-xl uppercase tracking-tighter">Recibo de Hospedagem</h2>
                            <button onClick={() => setSelectedReceipt(null)}><X /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="border-b border-dashed border-slate-300 pb-4">
                                <p className="text-xs uppercase text-slate-500 font-bold mb-1">Cliente</p>
                                <p className="font-bold text-lg">{selectedReceipt.nomeCliente}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <ReceiptInfo label="Entrada" value={formatDate(selectedReceipt.dataEntrada)} />
                                <ReceiptInfo label="Saida" value={formatDate(selectedReceipt.dataSaida)} />
                                <ReceiptInfo label="Hospedes" value={selectedReceipt.quantidadeHospedes} />
                                <ReceiptInfo label="Berco" value={selectedReceipt.bercoSolicitado ? 'Solicitado' : 'Nao'} />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Diarias:</span>
                                    <span className="font-bold">{selectedReceipt.quantidadeDiarias}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Valor da diaria:</span>
                                    <span className="font-bold">{formatCurrency(selectedReceipt.valorDiaria)}</span>
                                </div>
                                <div className="flex justify-between text-xl border-t border-slate-200 pt-2">
                                    <span className="font-black">Total a pagar:</span>
                                    <span className="font-black text-amber-600">{formatCurrency(selectedReceipt.valorFinal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition"
                            >
                                Imprimir Recibo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatusCard({ title, value, icon, color = 'text-slate-900' }) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase">{title}</span>
                {icon}
            </div>
            <span className={`text-3xl font-black ${color}`}>{value}</span>
        </div>
    )
}

function Info({ label, value, highlight }) {
    return (
        <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold">{label}</span>
            <p className={`text-sm font-bold ${highlight ? 'text-amber-600' : 'text-slate-800'}`}>{value}</p>
        </div>
    )
}

function ReceiptInfo({ label, value }) {
    return (
        <div>
            <p className="text-slate-500 font-medium">{label}:</p>
            <p className="font-bold">{value}</p>
        </div>
    )
}

function EmptyState({ text }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-600 shadow-sm">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <p>{text}</p>
        </div>
    )
}

export default Bookings
