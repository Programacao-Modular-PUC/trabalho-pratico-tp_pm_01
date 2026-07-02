package com.example.maraureserve.notifications;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.maraureserve.dtos.AluguelRequest;
import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.models.TipoQuarto;
import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;
import com.example.maraureserve.repositories.AluguelRepository;
import com.example.maraureserve.repositories.ClienteRepository;
import com.example.maraureserve.repositories.PagamentoRepository;
import com.example.maraureserve.repositories.QuartoRepository;
import com.example.maraureserve.repositories.ResidenciaRepository;
import com.example.maraureserve.services.AluguelService;
import com.example.maraureserve.services.ClienteService;
import com.example.maraureserve.services.PagamentoService;
import com.example.maraureserve.services.QuartoService;
import com.example.maraureserve.services.ResidenciaService;

class AluguelServiceNotificacaoIntegrationTest {

    @BeforeEach
    void setUp() {
        GerenciadorNotificacoes.resetInstance();
    }

    @AfterEach
    void tearDown() {
        GerenciadorNotificacoes.resetInstance();
    }

    @Test
    void criarReserva_devePublicarEventoReservaCriada() {
        Residencia residencia = new Residencia();
        residencia.setId(1L);

        Quarto quarto = new Quarto();
        quarto.setId(1L);
        quarto.setResidencia(residencia);
        quarto.setCapacidadeMaxima(4);
        quarto.setPermiteBerco(false);
        quarto.setTipo(TipoQuarto.INDIVIDUAL);
        quarto.setValorBase(new BigDecimal("100.00"));

        Cliente cliente = new Cliente();
        cliente.setId(1L);

        AluguelRequest request = new AluguelRequest(
                1L, 1L, 1L,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(3),
                2, false);

        AtomicReference<TipoEventoNotificacao> tipoPublicado = new AtomicReference<>();
        GerenciadorNotificacoes.getInstance().registrarObservador(
                evento -> tipoPublicado.set(evento.getTipo()));

        AluguelService aluguelService = new AluguelService(
                criarRepositorio(),
                new ResidenciaServiceStub(residencia),
                new QuartoServiceStub(quarto),
                new ClienteServiceStub(cliente),
                new PagamentoService(criarPagamentoRepositorio()));

        aluguelService.criar(request);

        assertEquals(TipoEventoNotificacao.RESERVA_CRIADA, tipoPublicado.get());
    }

    private AluguelRepository criarRepositorio() {
        return (AluguelRepository) Proxy.newProxyInstance(
                AluguelRepository.class.getClassLoader(),
                new Class[]{AluguelRepository.class},
                (proxy, method, args) -> {
                    if ("buscarConflitos".equals(method.getName())) {
                        return List.of();
                    }
                    if ("save".equals(method.getName()) && args != null && args.length == 1) {
                        Aluguel aluguel = (Aluguel) args[0];
                        if (aluguel.getId() == null) {
                            aluguel.setId(99L);
                        }
                        return aluguel;
                    }
                    return null;
                });
    }

    private PagamentoRepository criarPagamentoRepositorio() {
        return (PagamentoRepository) Proxy.newProxyInstance(
                PagamentoRepository.class.getClassLoader(),
                new Class[]{PagamentoRepository.class},
                (proxy, method, args) -> {
                    if ("save".equals(method.getName()) && args != null && args.length == 1) {
                        Pagamento pagamento = (Pagamento) args[0];
                        if (pagamento.getId() == null) {
                            pagamento.setId(1L);
                        }
                        return pagamento;
                    }
                    if (method.getReturnType().equals(java.util.Optional.class)) {
                        return java.util.Optional.empty();
                    }
                    if (method.getReturnType().equals(List.class)) {
                        return List.of();
                    }
                    return null;
                });
    }

    private static class ResidenciaServiceStub extends ResidenciaService {
        private final Residencia residencia;

        ResidenciaServiceStub(Residencia residencia) {
            super((ResidenciaRepository) null);
            this.residencia = residencia;
        }

        @Override
        public Residencia buscarEntidade(Long id) {
            return residencia;
        }
    }

    private static class QuartoServiceStub extends QuartoService {
        private final Quarto quarto;

        QuartoServiceStub(Quarto quarto) {
            super((QuartoRepository) null, null);
            this.quarto = quarto;
        }

        @Override
        public Quarto buscarEntidade(Long id) {
            return quarto;
        }
    }

    private static class ClienteServiceStub extends ClienteService {
        private final Cliente cliente;

        ClienteServiceStub(Cliente cliente) {
            super((ClienteRepository) null);
            this.cliente = cliente;
        }

        @Override
        public Cliente buscarEntidade(Long id) {
            return cliente;
        }
    }
}
