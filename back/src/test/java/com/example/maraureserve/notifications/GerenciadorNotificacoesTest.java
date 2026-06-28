package com.example.maraureserve.notifications;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.notifications.evento.NotificacaoEvento;
import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;
import com.example.maraureserve.notifications.model.MensagemNotificacao;
import com.example.maraureserve.notifications.factory.FabricaMensagensNotificacaoPadrao;
import com.example.maraureserve.notifications.observer.DespachanteNotificacaoObserver;
import com.example.maraureserve.notifications.observer.ObservadorNotificacao;
import com.example.maraureserve.notifications.strategy.CanalNotificacao;

class GerenciadorNotificacoesTest {

    private GerenciadorNotificacoes gerenciador;

    @BeforeEach
    void setUp() {
        GerenciadorNotificacoes.resetInstance();
        gerenciador = GerenciadorNotificacoes.getInstance();
        gerenciador.limparHistoricoInterno();
    }

    @AfterEach
    void tearDown() {
        GerenciadorNotificacoes.resetInstance();
    }

    @Test
    void getInstance_deveRetornarMesmaInstancia() {
        GerenciadorNotificacoes primeira = GerenciadorNotificacoes.getInstance();
        GerenciadorNotificacoes segunda = GerenciadorNotificacoes.getInstance();
        assertSame(primeira, segunda);
    }

    @Test
    void publicar_deveNotificarObservadoresRegistrados() {
        AtomicInteger contador = new AtomicInteger();
        ObservadorNotificacao observador = evento -> contador.incrementAndGet();
        gerenciador.registrarObservador(observador);

        gerenciador.publicar(new NotificacaoEvento(TipoEventoNotificacao.RESERVA_CRIADA, criarAluguelMock()));

        assertEquals(1, contador.get());
    }

    @Test
    void enviarPorCanais_deveUsarTodosCanaisRegistrados() {
        AtomicInteger envios = new AtomicInteger();
        gerenciador.registrarCanal(criarCanalFake("FAKE_A", envios));
        gerenciador.registrarCanal(criarCanalFake("FAKE_B", envios));

        MensagemNotificacao mensagem = new MensagemNotificacao(
                TipoEventoNotificacao.RESERVA_CRIADA,
                "cliente@teste.com",
                "Titulo",
                "Conteudo",
                LocalDateTime.now());

        gerenciador.enviarPorCanais(mensagem);

        assertEquals(2, envios.get());
    }

    private CanalNotificacao criarCanalFake(String nome, AtomicInteger envios) {
        return new CanalNotificacao() {
            @Override
            public String getNome() {
                return nome;
            }

            @Override
            public void enviar(MensagemNotificacao mensagem) {
                envios.incrementAndGet();
            }
        };
    }

    @Test
    void fluxoCompleto_deveRegistrarNotificacaoInterna() {
        gerenciador.registrarCanal(new com.example.maraureserve.notifications.strategy.NotificacaoInternaCanal());
        gerenciador.registrarObservador(new DespachanteNotificacaoObserver(
                gerenciador,
                new FabricaMensagensNotificacaoPadrao()));

        gerenciador.publicar(new NotificacaoEvento(TipoEventoNotificacao.RESERVA_CRIADA, criarAluguelMock()));

        assertTrue(gerenciador.listarHistoricoInterno().size() >= 2);
    }

    private Aluguel criarAluguelMock() {
        Residencia residencia = new Residencia();
        residencia.setId(1L);
        residencia.setEndereco("Rua das Palmeiras");
        residencia.setEmail("proprietario@teste.com");

        Quarto quarto = new Quarto();
        quarto.setId(10L);
        quarto.setCodigo("Q-101");
        quarto.setResidencia(residencia);

        Cliente cliente = new Cliente();
        cliente.setId(2L);
        cliente.setNome("Maria Silva");
        cliente.setEmail("maria@teste.com");

        Aluguel aluguel = new Aluguel();
        aluguel.setId(99L);
        aluguel.setResidencia(residencia);
        aluguel.setQuarto(quarto);
        aluguel.setCliente(cliente);
        aluguel.setDataEntrada(LocalDateTime.now().plusDays(2));
        aluguel.setDataSaida(LocalDateTime.now().plusDays(5));
        aluguel.setValorFinal(new BigDecimal("900.00"));
        return aluguel;
    }
}
