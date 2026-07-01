package com.example.maraureserve.reports.impl;

import com.example.maraureserve.dtos.AluguelResponse;
import com.example.maraureserve.reports.RelatorioStrategy;
import com.example.maraureserve.repositories.AluguelRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class HistoricoReservasStrategy implements RelatorioStrategy {

    private final AluguelRepository aluguelRepository;

    public HistoricoReservasStrategy(AluguelRepository aluguelRepository) {
        this.aluguelRepository = aluguelRepository;
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

        return aluguelRepository
                .buscarHistoricoReservas(dataInicio, dataFim, clienteId, quartoId)
                .stream()
                .map(AluguelResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
