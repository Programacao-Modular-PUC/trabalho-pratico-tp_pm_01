package com.example.maraureserve.models;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PagamentoTest {

    private Pagamento pagamento;
    private Aluguel aluguel;

    @BeforeEach
    void setUp() {
        aluguel = new Aluguel();
        aluguel.setValorFinal(BigDecimal.valueOf(1500.00));

        pagamento = new Pagamento();
        pagamento.setAluguel(aluguel);
    }

    @Test
    void testProcessarPagamento_InicializaValoresEStatusPendente() {
        pagamento.processarPagamento();

        assertNotNull(pagamento.getDataRegistro(), "A data de registro deve ser preenchida ao processar.");
        assertEquals("PENDENTE", pagamento.getStatus(), "O status inicial deve ser PENDENTE.");
        assertEquals(aluguel.getValorFinal(), pagamento.getValorTotal(), "O valor do pagamento deve ser igual ao valor final do aluguel.");
    }

    @Test
    void testConfirmarPagamento_AlteraStatusParaConfirmado() {
        pagamento.processarPagamento();
        pagamento.confirmarPagamento();

        assertEquals("CONFIRMADO", pagamento.getStatus(), "O status deve ser alterado para CONFIRMADO após a confirmação.");
    }

    @Test
    void testConfirmarPagamento_SemProcessar_LancaExcecao() {
        // Regra de negócio: não é possível confirmar um pagamento que não tenha sido processado anteriormente
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            pagamento.confirmarPagamento();
        });

        String mensagemEsperada = "O pagamento precisa ser processado antes de ser confirmado";
        assertTrue(exception.getMessage().contains(mensagemEsperada));
    }
}