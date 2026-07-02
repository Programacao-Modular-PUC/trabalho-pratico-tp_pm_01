package com.example.maraureserve.reports.impl;

import com.example.maraureserve.dtos.AluguelResponse;
import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.reports.RelatorioStrategy;
import com.example.maraureserve.repositories.AluguelRepository;
import com.example.maraureserve.services.PagamentoService;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class HistoricoReservasStrategy implements RelatorioStrategy {

    private final AluguelRepository aluguelRepository;
    private final PagamentoService pagamentoService;

    public HistoricoReservasStrategy(AluguelRepository aluguelRepository, PagamentoService pagamentoService) {
        this.aluguelRepository = aluguelRepository;
        this.pagamentoService = pagamentoService;
    }

    @Override
    public String getTipo() {
        return "HISTORICO_RESERVAS";
    }

    @Override
    public Object gerar(Map<String, Object> parametros) {
        LocalDateTime dataInicio = parametros.containsKey("dataInicio")
                ? LocalDateTime.parse(parametros.get("dataInicio").toString())
                : null;

        LocalDateTime dataFim = parametros.containsKey("dataFim")
                ? LocalDateTime.parse(parametros.get("dataFim").toString())
                : null;

        Long clienteId = parametros.containsKey("clienteId")
                ? Long.parseLong(parametros.get("clienteId").toString())
                : null;

        Long quartoId = parametros.containsKey("quartoId")
                ? Long.parseLong(parametros.get("quartoId").toString())
                : null;

        List<Aluguel> alugueis = aluguelRepository
                .buscarHistoricoReservas(dataInicio, dataFim, clienteId, quartoId);
        Map<Long, Pagamento> pagamentos = pagamentoService.buscarPorAlugueis(
                alugueis.stream().map(Aluguel::getId).toList());

        return alugueis.stream()
                .map(aluguel -> AluguelResponse.fromEntity(aluguel, pagamentos.get(aluguel.getId())))
                .collect(Collectors.toList());
    }
}
