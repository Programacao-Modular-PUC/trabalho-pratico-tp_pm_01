import React, { useState, useEffect, useCallback } from 'react';
import {
    DollarSign, BarChart3, Users, BedDouble,
    TrendingUp, ClipboardList, RefreshCw, Filter
} from 'lucide-react';
import { api } from '../../../services/api';

const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

const formatDate = (s) => {
    if (!s) return '—';
    return new Date(s).toLocaleDateString('pt-BR');
};

const TIPO_QUARTO_LABELS = {
    INDIVIDUAL: 'Individual',
    DUPLO: 'Duplo',
    CASAL: 'Casal',
    FAMILIA: 'Família',
};

const STATUS_COLORS = {
    RESERVADA: 'bg-blue-100 text-blue-800',
    EM_ANDAMENTO: 'bg-amber-100 text-amber-800',
    FINALIZADA: 'bg-emerald-100 text-emerald-800',
};

const STATUS_LABELS = {
    RESERVADA: 'Reservada',
    EM_ANDAMENTO: 'Em Andamento',
    FINALIZADA: 'Finalizada',
};

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
    );
}

function EmptyState({ message = 'Nenhum dado encontrado.' }) {
    return (
        <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            {message}
        </div>
    );
}

function Label({ children }) {
    return <label className="block text-xs font-semibold text-slate-500 mb-1">{children}</label>;
}

const inputClass =
    'bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500';

function TableWrapper({ children }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">{children}</table>
        </div>
    );
}

function Th({ children }) {
    return (
        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 first:rounded-tl-xl last:rounded-tr-xl">
            {children}
        </th>
    );
}

function Td({ children, className = '' }) {
    return (
        <td className={`px-4 py-3 text-slate-700 border-t border-slate-100 ${className}`}>
            {children}
        </td>
    );
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────
function BarChart({ data }) {
    const [hovered, setHovered] = useState(null);
    if (!data.length) return null;

    const VW = 560;
    const padL = 56;
    const padR = 8;
    const padTop = 28;   // espaço reservado para o label de valor
    const padB = 36;
    const plotW = VW - padL - padR;
    const plotH = 180;
    const VH = padTop + plotH + padB;

    const n = data.length;
    const slotW = plotW / n;
    const barW = Math.max(10, Math.floor(slotW * 0.6));
    const max = Math.max(...data.map(d => d.totalFaturado ?? 0), 1);
    const steps = 4;

    const fmtK = v => {
        if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
        if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
        return String(Math.round(v));
    };

    return (
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ fontFamily: 'inherit' }}>
            {/* Gridlines + Y labels */}
            {Array.from({ length: steps + 1 }, (_, i) => {
                const val = (max / steps) * (steps - i);
                const y = padTop + (i / steps) * plotH;
                return (
                    <g key={i}>
                        <line x1={padL} x2={VW - padR} y1={y} y2={y}
                            stroke={i === steps ? '#cbd5e1' : '#e2e8f0'} strokeWidth="1" />
                        <text x={padL - 6} y={y + 4} textAnchor="end" fill="#64748b" fontSize="9">
                            {fmtK(val)}
                        </text>
                    </g>
                );
            })}

            {/* Bars */}
            {data.map((d, i) => {
                const barH = Math.max(3, ((d.totalFaturado ?? 0) / max) * plotH);
                const cx = padL + i * slotW + slotW / 2;
                const x = cx - barW / 2;
                const barTop = padTop + plotH - barH;
                const isHov = hovered === i;
                const showYear = i === 0 || data[i - 1]?.ano !== d.ano;

                // label fica sempre no padTop fixo (nunca corta)
                const labelY = padTop - 6;

                return (
                    <g key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ cursor: 'pointer' }}
                    >
                        <rect x={x} y={barTop} width={barW} height={barH} rx="3"
                            fill={isHov ? '#f59e0b' : '#fbbf24'}
                            opacity={isHov ? 1 : 0.85} />

                        {/* Tooltip fixo no topo */}
                        {isHov && (
                            <g>
                                <rect x={cx - 34} y={labelY - 11} width={68} height={14}
                                    rx="3" fill="#0f172a" opacity="0.9" />
                                <text x={cx} y={labelY} textAnchor="middle"
                                    fill="#fbbf24" fontSize="9" fontWeight="bold">
                                    {formatCurrency(d.totalFaturado)}
                                </text>
                            </g>
                        )}

                        {/* Mês */}
                        <text x={cx} y={padTop + plotH + 13} textAnchor="middle" fill="#64748b" fontSize="9">
                            {(d.nomeMes ?? '').slice(0, 3)}
                        </text>
                        {/* Ano — só quando muda */}
                        {showYear && (
                            <text x={cx} y={padTop + plotH + 25} textAnchor="middle" fill="#334155" fontSize="8">
                                {d.ano}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

// ─── Faturamento Mensal ───────────────────────────────────────────────────────
function FaturamentoMensal() {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anoFiltro, setAnoFiltro] = useState('');
    const [mesFiltro, setMesFiltro] = useState('');

    useEffect(() => {
        api.getRelatorioFaturamentoMensal()
            .then(setAllData)
            .finally(() => setLoading(false));
    }, []);

    const anos = [...new Set(allData.map(r => r.ano))].sort();

    const MESES = [
        '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const filtered = allData.filter(r => {
        if (anoFiltro && r.ano !== Number(anoFiltro)) return false;
        if (mesFiltro && r.mes !== Number(mesFiltro)) return false;
        return true;
    });

    const total = filtered.reduce((s, r) => s + (r.totalFaturado ?? 0), 0);

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex flex-wrap items-end gap-3">
                <div>
                    <Label>Ano</Label>
                    <select value={anoFiltro} onChange={e => { setAnoFiltro(e.target.value); setMesFiltro(''); }}
                        className={inputClass}>
                        <option value="">Todos os anos</option>
                        {anos.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <div>
                    <Label>Mês</Label>
                    <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)}
                        className={inputClass}>
                        <option value="">Todos os meses</option>
                        {MESES.slice(1).map((nome, i) => (
                            <option key={i + 1} value={i + 1}>{nome}</option>
                        ))}
                    </select>
                </div>
                {(anoFiltro || mesFiltro) && (
                    <button onClick={() => { setAnoFiltro(''); setMesFiltro(''); }}
                        className="px-4 py-2 text-slate-500 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-lg text-sm transition-colors">
                        Limpar
                    </button>
                )}
            </div>

            {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState /> : (
                <>
                    {/* Gráfico + resumo */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Faturamento por período</p>
                            <BarChart data={filtered} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex-1">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Total</p>
                                <p className="text-xl font-black text-amber-600">{formatCurrency(total)}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex-1">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Períodos</p>
                                <p className="text-xl font-black text-slate-900">{filtered.length}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex-1">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Média/mês</p>
                                <p className="text-xl font-black text-slate-900">
                                    {formatCurrency(filtered.length ? total / filtered.length : 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabela */}
                    <TableWrapper>
                        <thead>
                            <tr>
                                <Th>Ano</Th>
                                <Th>Mês</Th>
                                <Th>Qtd. Aluguéis</Th>
                                <Th>Total Faturado</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <Td>{r.ano}</Td>
                                    <Td className="capitalize">{r.nomeMes}</Td>
                                    <Td>{r.quantidadeAlugueis}</Td>
                                    <Td className="font-bold text-amber-600">{formatCurrency(r.totalFaturado)}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </TableWrapper>
                </>
            )}
        </div>
    );
}

// ─── Taxa de Ocupação ─────────────────────────────────────────────────────────
function TaxaOcupacao() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const di = dataInicio ? `${dataInicio}T00:00:00` : null;
            const df = dataFim ? `${dataFim}T23:59:59` : null;
            const result = await api.getRelatorioTaxaOcupacao(di, df);
            setData(result);
        } finally {
            setLoading(false);
        }
    }, [dataInicio, dataFim]);

    useEffect(() => { load(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-3">
                <div>
                    <Label>Data início</Label>
                    <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
                        className={inputClass} />
                </div>
                <div>
                    <Label>Data fim</Label>
                    <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)}
                        className={inputClass} />
                </div>
                <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-sm transition-colors">
                    <Filter className="w-4 h-4" /> Filtrar
                </button>
            </div>

            {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
                <TableWrapper>
                    <thead>
                        <tr>
                            <Th>Quarto</Th>
                            <Th>Tipo</Th>
                            <Th>Dias Ocupados</Th>
                            <Th>Dias no Período</Th>
                            <Th>Taxa de Ocupação</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <Td className="font-mono font-bold text-slate-900">{r.codigoQuarto}</Td>
                                <Td>{TIPO_QUARTO_LABELS[r.tipoQuarto] ?? r.tipoQuarto}</Td>
                                <Td>{r.totalDiasOcupados}</Td>
                                <Td>{r.totalDiasNoPeriodo}</Td>
                                <Td>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-slate-200 rounded-full h-2 min-w-[80px]">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                                                style={{ width: `${Math.min(r.taxaOcupacaoPercentual, 100)}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-purple-600 w-14 text-right">
                                            {r.taxaOcupacaoPercentual.toFixed(1)}%
                                        </span>
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableWrapper>
            )}
        </div>
    );
}

// ─── Clientes Frequentes ──────────────────────────────────────────────────────
function ClientesFrequentes() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limite, setLimite] = useState(10);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const result = await api.getRelatorioClientesFrequentes(limite);
            setData(result);
        } finally {
            setLoading(false);
        }
    }, [limite]);

    useEffect(() => { load(); }, [load]);

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-3">
                <div>
                    <Label>Top N clientes</Label>
                    <select value={limite} onChange={(e) => setLimite(Number(e.target.value))}
                        className={inputClass}>
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>

            {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
                <TableWrapper>
                    <thead>
                        <tr>
                            <Th>#</Th>
                            <Th>Nome</Th>
                            <Th>CPF</Th>
                            <Th>Reservas</Th>
                            <Th>Total Gasto</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r, i) => (
                            <tr key={r.clienteId} className="hover:bg-slate-50 transition-colors">
                                <Td>
                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                                        i === 0 ? 'bg-amber-500 text-black' :
                                        i === 1 ? 'bg-slate-400 text-black' :
                                        i === 2 ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>{i + 1}</span>
                                </Td>
                                <Td className="font-bold text-slate-900">{r.nomeCliente}</Td>
                                <Td className="font-mono text-slate-500">{r.cpf}</Td>
                                <Td>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                        {r.totalReservas}
                                    </span>
                                </Td>
                                <Td className="font-bold text-amber-600">{formatCurrency(r.totalGasto)}</Td>
                            </tr>
                        ))}
                    </tbody>
                </TableWrapper>
            )}
        </div>
    );
}

// ─── Quartos Mais Alugados ────────────────────────────────────────────────────
function QuartosMaisAlugados() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limite, setLimite] = useState(10);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const result = await api.getRelatorioQuartosMaisAlugados(limite);
            setData(result);
        } finally {
            setLoading(false);
        }
    }, [limite]);

    useEffect(() => { load(); }, [load]);

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-3">
                <div>
                    <Label>Top N quartos</Label>
                    <select value={limite} onChange={(e) => setLimite(Number(e.target.value))}
                        className={inputClass}>
                        {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>

            {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
                <TableWrapper>
                    <thead>
                        <tr>
                            <Th>#</Th>
                            <Th>Código</Th>
                            <Th>Tipo</Th>
                            <Th>Total Aluguéis</Th>
                            <Th>Receita Total</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r, i) => (
                            <tr key={r.quartoId} className="hover:bg-slate-50 transition-colors">
                                <Td>
                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                                        i === 0 ? 'bg-amber-500 text-black' :
                                        i === 1 ? 'bg-slate-400 text-black' :
                                        i === 2 ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>{i + 1}</span>
                                </Td>
                                <Td className="font-mono font-bold text-slate-900">{r.codigoQuarto}</Td>
                                <Td>{TIPO_QUARTO_LABELS[r.tipoQuarto] ?? r.tipoQuarto}</Td>
                                <Td>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                        {r.totalAlugueis}
                                    </span>
                                </Td>
                                <Td className="font-bold text-amber-600">{formatCurrency(r.receitaTotal)}</Td>
                            </tr>
                        ))}
                    </tbody>
                </TableWrapper>
            )}
        </div>
    );
}

// ─── Receita por Tipo de Quarto ───────────────────────────────────────────────
function ReceitaPorTipoQuarto() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getRelatorioReceitaPorTipoQuarto()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    const total = data.reduce((s, r) => s + (r.receitaTotal ?? 0), 0);

    return (
        <div className="space-y-6">
            {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.map((r) => (
                            <div key={r.tipoQuarto} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-amber-400 transition-all">
                                <p className="text-slate-500 text-sm mb-1">{TIPO_QUARTO_LABELS[r.tipoQuarto] ?? r.tipoQuarto}</p>
                                <p className="text-2xl font-black text-slate-900 mb-3">{formatCurrency(r.receitaTotal)}</p>
                                <div className="space-y-1 text-xs text-slate-500">
                                    <div className="flex justify-between">
                                        <span>Reservas</span>
                                        <span className="text-slate-700 font-semibold">{r.totalAlugueis}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ticket médio</span>
                                        <span className="text-amber-600 font-semibold">{formatCurrency(r.ticketMedio)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-right text-lg font-black text-slate-900">
                        Receita total: <span className="text-amber-600">{formatCurrency(total)}</span>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Histórico de Reservas ────────────────────────────────────────────────────
function HistoricoReservas() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [quartoId, setQuartoId] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const result = await api.getRelatorioHistoricoReservas({
                dataInicio: dataInicio ? `${dataInicio}T00:00:00` : null,
                dataFim: dataFim ? `${dataFim}T23:59:59` : null,
                clienteId: clienteId || null,
                quartoId: quartoId || null,
            });
            setData(result);
        } finally {
            setLoading(false);
        }
    }, [dataInicio, dataFim, clienteId, quartoId]);

    useEffect(() => { load(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-3">
                <div>
                    <Label>Data início</Label>
                    <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
                        className={inputClass} />
                </div>
                <div>
                    <Label>Data fim</Label>
                    <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)}
                        className={inputClass} />
                </div>
                <div>
                    <Label>ID do cliente</Label>
                    <input type="number" placeholder="Ex: 1" value={clienteId} onChange={(e) => setClienteId(e.target.value)}
                        className={`${inputClass} w-28`} />
                </div>
                <div>
                    <Label>ID do quarto</Label>
                    <input type="number" placeholder="Ex: 1" value={quartoId} onChange={(e) => setQuartoId(e.target.value)}
                        className={`${inputClass} w-28`} />
                </div>
                <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-sm transition-colors">
                    <Filter className="w-4 h-4" /> Filtrar
                </button>
            </div>

            {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
                <TableWrapper>
                    <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Cliente</Th>
                            <Th>Quarto</Th>
                            <Th>Check-in</Th>
                            <Th>Check-out</Th>
                            <Th>Diárias</Th>
                            <Th>Valor</Th>
                            <Th>Status</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                <Td className="text-slate-500 font-mono">#{r.id}</Td>
                                <Td className="font-semibold text-slate-900">{r.nomeCliente}</Td>
                                <Td className="font-mono">{r.codigoQuarto}</Td>
                                <Td>{formatDate(r.dataEntrada)}</Td>
                                <Td>{formatDate(r.dataSaida)}</Td>
                                <Td>{r.quantidadeDiarias}</Td>
                                <Td className="font-bold text-amber-600">{formatCurrency(r.valorFinal)}</Td>
                                <Td>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[r.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                        {STATUS_LABELS[r.status] ?? r.status}
                                    </span>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableWrapper>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'faturamento', label: 'Faturamento Mensal', icon: DollarSign, component: FaturamentoMensal },
    { id: 'ocupacao', label: 'Taxa de Ocupação', icon: BarChart3, component: TaxaOcupacao },
    { id: 'clientes', label: 'Clientes Frequentes', icon: Users, component: ClientesFrequentes },
    { id: 'quartos', label: 'Quartos Mais Alugados', icon: BedDouble, component: QuartosMaisAlugados },
    { id: 'receita-tipo', label: 'Receita por Tipo', icon: TrendingUp, component: ReceitaPorTipoQuarto },
    { id: 'historico', label: 'Histórico', icon: ClipboardList, component: HistoricoReservas },
];

function Relatorios() {
    const [activeTab, setActiveTab] = useState('faturamento');

    const current = TABS.find((t) => t.id === activeTab);
    const ActiveSection = current?.component;

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Relatorios gerenciais</p>
                    <h1 className="mt-3 text-3xl font-black text-slate-900 mb-2">Desempenho do negocio</h1>
                    <p className="text-slate-600">Dados carregados da API. Se o backend estiver indisponivel, exibimos relatorios de demonstracao alinhados ao seed de teste.</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 mb-8 scrollbar-hide">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        {current && <current.icon className="w-5 h-5 text-amber-600" />}
                        {current?.label}
                    </h2>
                    {ActiveSection && <ActiveSection />}
                </div>
            </div>
        </div>
    );
}

export default Relatorios;
