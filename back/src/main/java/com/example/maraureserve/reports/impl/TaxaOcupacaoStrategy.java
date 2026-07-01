package com.example.maraureserve.reports.impl;

import com.example.maraureserve.dtos.relatorios.TaxaOcupacaoDTO;
import com.example.maraureserve.reports.RelatorioStrategy;
import com.example.maraureserve.repositories.AluguelRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class TaxaOcupacaoStrategy implements RelatorioStrategy {

    private final AluguelRepository aluguelRepository;

    public TaxaOcupacaoStrategy(AluguelRepository aluguelRepository) {
        this.aluguelRepository = aluguelRepository;
    }

    @Override
    public String getTipo() {
        return "TAXA_OCUPACAO";
    }

    @Override
    public Object gerar(Map<String, Object> parametros) {
        LocalDateTime dataInicio = parametros.containsKey("dataInicio")
                ? LocalDateTime.parse(parametros.get("dataInicio").toString())
                : LocalDateTime.now().minusDays(30);

        LocalDateTime dataFim = parametros.containsKey("dataFim")
                ? LocalDateTime.parse(parametros.get("dataFim").toString())
                : LocalDateTime.now();

        long totalDiasNoPeriodo = ChronoUnit.DAYS.between(dataInicio, dataFim);
        if (totalDiasNoPeriodo <= 0) totalDiasNoPeriodo = 1;

        List<Object[]> resultados = aluguelRepository.buscarOcupacaoPorQuarto(dataInicio, dataFim);
        final long diasPeriodo = totalDiasNoPeriodo;

        return resultados.stream().map(r -> {
            var quarto = (com.example.maraureserve.models.Quarto) r[0];
            long diasOcupados = ((Number) r[1]).longValue();
            double taxa = Math.min(100.0, (diasOcupados * 100.0) / diasPeriodo);
            return new TaxaOcupacaoDTO(
                    quarto.getId(),
                    quarto.getCodigo(),
                    quarto.getTipo(),
                    diasOcupados,
                    diasPeriodo,
                    Math.round(taxa * 100.0) / 100.0);
        }).collect(Collectors.toList());
    }
}
