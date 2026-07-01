package com.example.maraureserve.dtos.relatorios;

import com.example.maraureserve.models.TipoQuarto;
import java.math.BigDecimal;

public record ReceitaTipoQuartoDTO(
        TipoQuarto tipoQuarto,
        long totalAlugueis,
        BigDecimal receitaTotal,
        BigDecimal ticketMedio) {
}
