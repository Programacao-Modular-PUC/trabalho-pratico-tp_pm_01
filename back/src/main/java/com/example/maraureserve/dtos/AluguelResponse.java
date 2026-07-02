package com.example.maraureserve.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.models.StatusAluguel;

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
        BigDecimal valorFinal,
        StatusAluguel status,
        PagamentoResponse pagamento) {

    public static AluguelResponse fromEntity(Aluguel aluguel, Pagamento pagamento) {
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
                aluguel.getValorFinal(),
                aluguel.getStatus(),
                PagamentoResponse.fromEntity(pagamento));
    }
}