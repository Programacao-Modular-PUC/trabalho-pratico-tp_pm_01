package com.example.maraureserve.dtos;

import java.math.BigDecimal;

import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.TipoCamaCasal;
import com.example.maraureserve.models.TipoQuarto;

public record QuartoResponse(
        Long id,
        String codigo,
        TipoQuarto tipo,
        BigDecimal valorBase,
        Boolean possuiArCondicionado,
        Boolean possuiHidromassagem,
        Integer capacidadeMaxima,
        Integer quantidadeCamasSolteiro,
        Integer quantidadeCamasCasal,
        Integer quantidadeCamasQueen,
        Integer quantidadeCamasKing,
        Integer quantidadeAmbientes,
        BigDecimal valorAdicionalPorCamaSolteiro,
        BigDecimal valorAdicionalCamaCasal,
        BigDecimal valorAdicionalCamaQueenKing,
        BigDecimal taxaBerco,
        BigDecimal percentualAdicionalPorHospede,
        Boolean permiteBerco,
        TipoCamaCasal tipoCamaCasal,
        Long residenciaId,
        String enderecoResidencia) {

    public static QuartoResponse fromEntity(Quarto quarto) {
        return new QuartoResponse(
                quarto.getId(),
                quarto.getCodigo(),
                quarto.getTipo(),
                quarto.getValorBase(),
                quarto.getPossuiArCondicionado(),
                quarto.getPossuiHidromassagem(),
                quarto.getCapacidadeMaxima(),
                quarto.getQuantidadeCamasSolteiro(),
                quarto.getQuantidadeCamasCasal(),
                quarto.getQuantidadeCamasQueen(),
                quarto.getQuantidadeCamasKing(),
                quarto.getQuantidadeAmbientes(),
                quarto.getValorAdicionalPorCamaSolteiro(),
                quarto.getValorAdicionalCamaCasal(),
                quarto.getValorAdicionalCamaQueenKing(),
                quarto.getTaxaBerco(),
                quarto.getPercentualAdicionalPorHospede(),
                quarto.getPermiteBerco(),
                quarto.getTipoCamaCasal(),
                quarto.getResidencia().getId(),
                quarto.getResidencia().getEndereco());
    }
}
