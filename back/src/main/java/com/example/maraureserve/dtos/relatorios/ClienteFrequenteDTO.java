package com.example.maraureserve.dtos.relatorios;

import java.math.BigDecimal;

public record ClienteFrequenteDTO(
        Long clienteId,
        String nomeCliente,
        String cpf,
        long totalReservas,
        BigDecimal totalGasto) {
}
