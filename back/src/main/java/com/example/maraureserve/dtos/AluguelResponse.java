package com.example.maraureserve.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.maraureserve.models.Aluguel;

public record AluguelResponse(
        Long id,
        Long residenciaId,
        String enderecoResidencia,
        Long quartoId,
        String codigoQuarto,
        Long clienteId,
        String nomeCliente,
        LocalDateTime dataEntrada,
        LocalDateTime dataSaida,
        Integer quantidadeHospedes,
        Integer quantidadeDiarias,
        Boolean bercoSolicitado,
        BigDecimal valorDiaria,
        BigDecimal valorFinal) {

    public static AluguelResponse fromEntity(Aluguel aluguel) {
        return new AluguelResponse(
                aluguel.getId(),
                aluguel.getResidencia().getId(),
                aluguel.getResidencia().getEndereco(),
                aluguel.getQuarto().getId(),
                aluguel.getQuarto().getCodigo(),
                aluguel.getCliente().getId(),
                aluguel.getCliente().getNome(),
                aluguel.getDataEntrada(),
                aluguel.getDataSaida(),
                aluguel.getQuantidadeHospedes(),
                aluguel.getQuantidadeDiarias(),
                aluguel.getBercoSolicitado(),
                aluguel.getValorDiaria(),
                aluguel.getValorFinal());
    }
}
