package com.example.maraureserve.dtos.relatorios;

import com.example.maraureserve.models.TipoQuarto;

public record TaxaOcupacaoDTO(
        Long quartoId,
        String codigoQuarto,
        TipoQuarto tipoQuarto,
        long totalDiasOcupados,
        long totalDiasNoPeriodo,
        double taxaOcupacaoPercentual) {
}
