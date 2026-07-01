package com.example.maraureserve.reports.impl;

import com.example.maraureserve.dtos.relatorios.QuartoMaisAlugadoDTO;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.reports.RelatorioStrategy;
import com.example.maraureserve.repositories.AluguelRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class QuartosMaisAlugadosStrategy implements RelatorioStrategy {

    private final AluguelRepository aluguelRepository;

    public QuartosMaisAlugadosStrategy(AluguelRepository aluguelRepository) {
        this.aluguelRepository = aluguelRepository;
    }

    @Override
    public String getTipo() {
        return "QUARTOS_MAIS_ALUGADOS";
    }

    @Override
    public Object gerar(Map<String, Object> parametros) {
        int limite = parametros.containsKey("limite")
                ? Integer.parseInt(parametros.get("limite").toString())
                : 10;

        List<Object[]> resultados = aluguelRepository.buscarQuartosMaisAlugados(PageRequest.of(0, limite));

        return resultados.stream().map(r -> {
            Quarto quarto = (Quarto) r[0];
            long totalAlugueis = ((Number) r[1]).longValue();
            BigDecimal receitaTotal = r[2] != null ? (BigDecimal) r[2] : BigDecimal.ZERO;
            return new QuartoMaisAlugadoDTO(
                    quarto.getId(),
                    quarto.getCodigo(),
                    quarto.getTipo(),
                    totalAlugueis,
                    receitaTotal);
        }).collect(Collectors.toList());
    }
}
