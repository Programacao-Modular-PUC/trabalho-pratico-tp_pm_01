package com.example.maraureserve.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.models.StatusPagamento;

public record PagamentoResponse(
        Long id,
        StatusPagamento status,
        BigDecimal valorTotal,
        LocalDateTime dataRegistro,
        LocalDateTime dataProcessamento,
        LocalDateTime dataConfirmacao) {

    public static PagamentoResponse fromEntity(Pagamento pagamento) {
        if (pagamento == null) {
            return null;
        }
        return new PagamentoResponse(
                pagamento.getId(),
                pagamento.getStatus(),
                pagamento.getValorTotal(),
                pagamento.getDataRegistro(),
                pagamento.getDataProcessamento(),
                pagamento.getDataConfirmacao());
    }
}
