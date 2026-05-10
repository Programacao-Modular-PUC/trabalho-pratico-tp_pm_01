package com.example.maraureserve.dtos;

import java.math.BigDecimal;

import com.example.maraureserve.models.TipoCamaCasal;
import com.example.maraureserve.models.TipoQuarto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuartoRequest(
        @NotBlank(message = "O codigo do quarto e obrigatorio.")
        String codigo,

        @NotNull(message = "O tipo do quarto e obrigatorio.")
        TipoQuarto tipo,

        @NotNull(message = "O valor base e obrigatorio.")
        @DecimalMin(value = "0.0", inclusive = false, message = "O valor base deve ser maior que zero.")
        BigDecimal valorBase,

        @NotNull(message = "Informe se possui ar-condicionado.")
        Boolean possuiArCondicionado,

        @NotNull(message = "Informe se possui hidromassagem.")
        Boolean possuiHidromassagem,

        @Min(value = 1, message = "A capacidade maxima deve ser pelo menos 1.")
        Integer capacidadeMaxima,

        @Min(value = 0, message = "A quantidade de camas de solteiro nao pode ser negativa.")
        Integer quantidadeCamasSolteiro,

        @Min(value = 0, message = "A quantidade de camas de casal nao pode ser negativa.")
        Integer quantidadeCamasCasal,

        @Min(value = 0, message = "A quantidade de camas queen nao pode ser negativa.")
        Integer quantidadeCamasQueen,

        @Min(value = 0, message = "A quantidade de camas king nao pode ser negativa.")
        Integer quantidadeCamasKing,

        @Min(value = 0, message = "A quantidade de ambientes nao pode ser negativa.")
        Integer quantidadeAmbientes,

        BigDecimal valorAdicionalPorCamaSolteiro,
        BigDecimal valorAdicionalCamaCasal,
        BigDecimal valorAdicionalCamaQueenKing,
        BigDecimal taxaBerco,
        BigDecimal percentualAdicionalPorHospede,
        Boolean permiteBerco,
        TipoCamaCasal tipoCamaCasal,

        @NotNull(message = "A residencia vinculada e obrigatoria.")
        Long residenciaId) {
}
