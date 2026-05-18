package com.example.maraureserve.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AluguelRequest(
        @NotNull(message = "A residencia e obrigatoria.")
        Long residenciaId,

        @NotNull(message = "O quarto e obrigatorio.")
        Long quartoId,

        @NotNull(message = "O cliente e obrigatorio.")
        Long clienteId,

        @NotNull(message = "A data de entrada e obrigatoria.")
        @Future(message = "A data de entrada deve estar no futuro.")
        LocalDateTime dataEntrada,

        @NotNull(message = "A data de saida e obrigatoria.")
        @Future(message = "A data de saida deve estar no futuro.")
        LocalDateTime dataSaida,

        @NotNull(message = "A quantidade de hospedes e obrigatoria.")
        @Min(value = 1, message = "A quantidade de hospedes deve ser pelo menos 1.")
        Integer quantidadeHospedes,

        Boolean bercoSolicitado) {
}