package com.example.maraureserve.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.example.maraureserve.common.exception.BusinessException;
import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.models.StatusPagamento;

class PagamentoTest {

    @Test
    void testRegistro_PagamentoNovo_IniciaPendente() {
        Pagamento pagamento = new Pagamento();
        pagamento.setValorTotal(BigDecimal.valueOf(500.0));

        assertEquals(StatusPagamento.PENDENTE, pagamento.getStatus());
    }

    @Test
    void testProcessamento_PagamentoPendente_TransicionaParaEmProcessamento() {
        Pagamento pagamento = new Pagamento();

        pagamento.processar();

        assertEquals(StatusPagamento.EM_PROCESSAMENTO, pagamento.getStatus());
        assertNotNull(pagamento.getDataProcessamento());
    }

    @Test
    void testProcessamento_PagamentoJaProcessado_LancaExcecao() {
        Pagamento pagamento = new Pagamento();
        pagamento.processar();

        assertThrows(BusinessException.class, pagamento::processar);
    }

    @Test
    void testConfirmacao_PagamentoProcessado_TransicionaParaConfirmado() {
        Pagamento pagamento = new Pagamento();
        pagamento.processar();

        pagamento.confirmar();

        assertEquals(StatusPagamento.CONFIRMADO, pagamento.getStatus());
        assertNotNull(pagamento.getDataConfirmacao());
    }

    @Test
    void testConfirmacao_PagamentoAindaPendente_LancaExcecao() {
        Pagamento pagamento = new Pagamento();

        assertThrows(BusinessException.class, pagamento::confirmar);
    }

    @Test
    void testConfirmacao_PagamentoJaConfirmado_LancaExcecao() {
        Pagamento pagamento = new Pagamento();
        pagamento.processar();
        pagamento.confirmar();

        assertThrows(BusinessException.class, pagamento::confirmar);
    }

    @Test
    void testRecusa_PagamentoProcessado_TransicionaParaRecusado() {
        Pagamento pagamento = new Pagamento();
        pagamento.processar();

        pagamento.recusar();

        assertEquals(StatusPagamento.RECUSADO, pagamento.getStatus());
    }

    @Test
    void testRecusa_PagamentoAindaPendente_LancaExcecao() {
        Pagamento pagamento = new Pagamento();

        assertThrows(BusinessException.class, pagamento::recusar);
    }
}
