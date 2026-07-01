package com.example.maraureserve.reports.impl;

import com.example.maraureserve.dtos.relatorios.FaturamentoMensalDTO;
import com.example.maraureserve.reports.RelatorioStrategy;
import com.example.maraureserve.repositories.AluguelRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class FaturamentoMensalStrategy implements RelatorioStrategy {

    private final AluguelRepository aluguelRepository;

    public FaturamentoMensalStrategy(AluguelRepository aluguelRepository) {
        this.aluguelRepository = aluguelRepository;
    }

    @Override
    public String getTipo() {
        return "FATURAMENTO_MENSAL";
    }

    @Override
    public Object gerar(Map<String, Object> parametros) {
        Integer anoFiltro = parametros.containsKey("ano")
                ? Integer.parseInt(parametros.get("ano").toString())
                : null;

        List<Object[]> resultados = aluguelRepository.buscarFaturamentoMensal();

        return resultados.stream()
                .filter(r -> anoFiltro == null || ((Number) r[0]).intValue() == anoFiltro)
                .map(r -> {
                    int ano = ((Number) r[0]).intValue();
                    int mes = ((Number) r[1]).intValue();
                    BigDecimal total = r[2] != null ? (BigDecimal) r[2] : BigDecimal.ZERO;
                    long quantidade = ((Number) r[3]).longValue();
                    String nomeMes = Month.of(mes).getDisplayName(TextStyle.FULL, Locale.forLanguageTag("pt-BR"));
                    return new FaturamentoMensalDTO(ano, mes, nomeMes, total, quantidade);
                })
                .collect(Collectors.toList());
    }
}
