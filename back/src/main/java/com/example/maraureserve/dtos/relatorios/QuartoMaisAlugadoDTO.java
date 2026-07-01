package com.example.maraureserve.dtos.relatorios;

import com.example.maraureserve.models.TipoQuarto;
import java.math.BigDecimal;

public record QuartoMaisAlugadoDTO(
        Long quartoId,
        String codigoQuarto,
        TipoQuarto tipoQuarto,
        long totalAlugueis,
        BigDecimal receitaTotal) {
}
