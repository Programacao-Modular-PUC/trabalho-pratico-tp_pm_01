package com.example.maraureserve.reports.impl;

import com.example.maraureserve.dtos.relatorios.ReceitaTipoQuartoDTO;
import com.example.maraureserve.models.TipoQuarto;
import com.example.maraureserve.reports.RelatorioStrategy;
import com.example.maraureserve.repositories.AluguelRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ReceitaPorTipoQuartoStrategy implements RelatorioStrategy {

    private final AluguelRepository aluguelRepository;

    public ReceitaPorTipoQuartoStrategy(AluguelRepository aluguelRepository) {
        this.aluguelRepository = aluguelRepository;
    }

    @Override
    public String getTipo() {
        return "RECEITA_POR_TIPO_QUARTO";
    }

    @Override
    public Object gerar(Map<String, Object> parametros) {
        List<Object[]> resultados = aluguelRepository.buscarReceitaPorTipoQuarto();

        return resultados.stream().map(r -> {
            TipoQuarto tipo = (TipoQuarto) r[0];
            long totalAlugueis = ((Number) r[1]).longValue();
            BigDecimal receitaTotal = r[2] != null ? (BigDecimal) r[2] : BigDecimal.ZERO;
            BigDecimal ticketMedio = totalAlugueis > 0
                    ? receitaTotal.divide(BigDecimal.valueOf(totalAlugueis), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            return new ReceitaTipoQuartoDTO(tipo, totalAlugueis, receitaTotal, ticketMedio);
        }).collect(Collectors.toList());
    }
}
