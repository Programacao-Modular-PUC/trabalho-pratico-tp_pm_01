package com.example.maraureserve.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AluguelRequest(
        @NotNull(message = "A residência é obrigatória.")
        Long residenciaId,

        @NotNull(message = "O quarto é obrigatório.")
        Long quartoId,

        @NotNull(message = "O cliente é obrigatório.")
        Long clienteId,

        @NotNull(message = "A data de entrada é obrigatória.")
        @Future(message = "A data de entrada deve estar no futuro.")
        LocalDateTime dataEntrada,

        @NotNull(message = "A data de saída é obrigatória.")
        @Future(message = "A data de saída deve estar no futuro.")
        LocalDateTime dataSaida,

        @NotNull(message = "A quantidade de hóspedes é obrigatória.")
        @Min(value = 1, message = "A quantidade de hóspedes deve ser pelo menos 1.")
        Integer quantidadeHospedes) {
}
