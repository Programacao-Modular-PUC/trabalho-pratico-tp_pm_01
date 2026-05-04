package com.example.maraureserve.dtos;

import java.math.BigDecimal;

import com.example.maraureserve.models.TipoQuarto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuartoRequest(
        @NotBlank(message = "O código do quarto é obrigatório.")
        String codigo,

        @NotNull(message = "O tipo do quarto é obrigatório.")
        TipoQuarto tipo,

        @NotNull(message = "O valor base é obrigatório.")
        @DecimalMin(value = "0.0", inclusive = false, message = "O valor base deve ser maior que zero.")
        BigDecimal valorBase,

        @NotNull(message = "Informe se possui ar-condicionado.")
        Boolean possuiArCondicionado,

        @NotNull(message = "Informe se possui hidromassagem.")
        Boolean possuiHidromassagem,

        @NotNull(message = "A capacidade máxima é obrigatória.")
        @Min(value = 1, message = "A capacidade máxima deve ser pelo menos 1.")
        Integer capacidadeMaxima,

        @NotNull(message = "A residência vinculada é obrigatória.")
        Long residenciaId) {
}
