package com.example.maraureserve.dtos.relatorios;

import java.math.BigDecimal;

public record FaturamentoMensalDTO(
        int ano,
        int mes,
        String nomeMes,
        BigDecimal totalFaturado,
        long quantidadeAlugueis) {
}
