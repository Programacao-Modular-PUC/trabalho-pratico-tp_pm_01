package com.example.maraureserve.services;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.maraureserve.common.exception.CapacidadeExcedidaException;
import com.example.maraureserve.common.exception.QuartoIndisponivelException;
import com.example.maraureserve.common.exception.RecursoNaoPermitidoException;
import com.example.maraureserve.dtos.AluguelRequest;
import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.models.TipoQuarto;
import com.example.maraureserve.repositories.AluguelRepository;
import com.example.maraureserve.repositories.ClienteRepository;
import com.example.maraureserve.repositories.PagamentoRepository;
import com.example.maraureserve.repositories.QuartoRepository;
import com.example.maraureserve.repositories.ResidenciaRepository;

class AluguelServiceTest {

    private Residencia residencia;
    private Quarto quarto;
    private Cliente cliente;
    private AluguelRequest requestValido;
    private List<Aluguel> conflitos;
    private AluguelService aluguelService;

    @BeforeEach
    void setUp() {
        residencia = new Residencia();
        residencia.setId(1L);

        quarto = new Quarto();
        quarto.setId(1L);
        quarto.setResidencia(residencia);
        quarto.setCapacidadeMaxima(4);
        quarto.setPermiteBerco(false);
        quarto.setTipo(TipoQuarto.INDIVIDUAL);
        quarto.setValorBase(new BigDecimal("100.00"));

        cliente = new Cliente();
        cliente.setId(1L);

        requestValido = new AluguelRequest(
                1L,
                1L,
                1L,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(3),
                2,
                false);

        conflitos = List.of();
        aluguelService = new AluguelService(
                criarRepositorio(),
                new ResidenciaServiceStub(residencia),
                new QuartoServiceStub(quarto),
                new ClienteServiceStub(cliente),
                new PagamentoService(criarPagamentoRepositorio()));
    }

    @Test
    void testLimitesDeHospedes_CapacidadeExcedida_LancaExcecao() {
        quarto.setCapacidadeMaxima(1);

        assertThrows(CapacidadeExcedidaException.class, () -> aluguelService.criar(requestValido));
    }

    @Test
    void testRegrasDeBerco_BercoSolicitadoENaoPermitido_LancaExcecao() {
        AluguelRequest requestComBerco = new AluguelRequest(
                1L, 1L, 1L,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(3),
                2, true);

        assertThrows(RecursoNaoPermitidoException.class, () -> aluguelService.criar(requestComBerco));
    }

    @Test
    void testDisponibilidade_QuartoIndisponivel_LancaExcecao() {
        conflitos = List.of(new Aluguel());

        assertThrows(QuartoIndisponivelException.class, () -> aluguelService.criar(requestValido));
    }

    private AluguelRepository criarRepositorio() {
        return (AluguelRepository) Proxy.newProxyInstance(
                AluguelRepository.class.getClassLoader(),
                new Class[]{AluguelRepository.class},
                (proxy, method, args) -> {
                    if ("buscarConflitos".equals(method.getName())) {
                        return conflitos;
                    }
                    if ("save".equals(method.getName()) && args != null && args.length == 1) {
                        Aluguel aluguel = (Aluguel) args[0];
                        if (aluguel.getId() == null) {
                            aluguel.setId(99L);
                        }
                        return aluguel;
                    }
                    return valorPadrao(method.getReturnType());
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
                    return valorPadrao(method.getReturnType());
                });
    }

    private static Object valorPadrao(Class<?> returnType) {
        if (returnType.equals(Void.TYPE)) {
            return null;
        }
        if (returnType.equals(List.class)) {
            return List.of();
        }
        if (returnType.equals(java.util.Optional.class)) {
            return java.util.Optional.empty();
        }
        if (returnType.equals(long.class) || returnType.equals(Long.class)) {
            return 0L;
        }
        if (returnType.equals(int.class) || returnType.equals(Integer.class)) {
            return 0;
        }
        if (returnType.equals(boolean.class) || returnType.equals(Boolean.class)) {
            return false;
        }
        return null;
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
