package com.example.maraureserve.quarto.dto;

import java.math.BigDecimal;

import com.example.maraureserve.quarto.model.Quarto;
import com.example.maraureserve.quarto.model.TipoQuarto;

public record QuartoResponse(
        Long id,
        String codigo,
        TipoQuarto tipo,
        BigDecimal valorBase,
        Boolean possuiArCondicionado,
        Boolean possuiHidromassagem,
        Integer capacidadeMaxima,
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
                quarto.getResidencia().getId(),
                quarto.getResidencia().getEndereco());
    }
}
