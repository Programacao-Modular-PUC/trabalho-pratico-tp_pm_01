package com.example.maraureserve.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.maraureserve.common.exception.BusinessException;
import com.example.maraureserve.common.exception.DataInvalidaException;
import com.example.maraureserve.common.exception.QuartoIndisponivelException;
import com.example.maraureserve.dtos.AluguelRequest;
import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.models.TipoQuarto;
import com.example.maraureserve.repositories.AluguelRepository;

@ExtendWith(MockitoExtension.class)
class AluguelServiceTest {

    @Mock
    private AluguelRepository aluguelRepository;

    @Mock
    private ResidenciaService residenciaService;

    @Mock
    private QuartoService quartoService;

    @Mock
    private ClienteService clienteService;

    @Test
    void criarDeveLancarDataInvalidaExceptionQuandoCheckoutNaoForPosteriorAoCheckin() {
        AluguelService service = criarService();
        LocalDateTime dataEntrada = LocalDateTime.now().plusDays(3);
        LocalDateTime dataSaida = dataEntrada.minusHours(1);
        AluguelRequest request = criarRequest(dataEntrada, dataSaida);

        assertThrows(DataInvalidaException.class, () -> service.criar(request));
        verifyNoInteractions(residenciaService, quartoService, clienteService, aluguelRepository);
    }

    @Test
    void criarDeveLancarDataInvalidaExceptionQuandoDatasForemNulas() {
        AluguelService service = criarService();
        AluguelRequest request = criarRequest(null, null);

        assertThrows(DataInvalidaException.class, () -> service.criar(request));
        verifyNoInteractions(residenciaService, quartoService, clienteService, aluguelRepository);
    }

    @Test
    void criarDeveLancarQuartoIndisponivelExceptionQuandoExistirConflitoDePeriodo() {
        AluguelService service = criarService();
        LocalDateTime dataEntrada = LocalDateTime.now().plusDays(3);
        LocalDateTime dataSaida = dataEntrada.plusDays(2);
        AluguelRequest request = criarRequest(dataEntrada, dataSaida);
        Residencia residencia = criarResidencia();
        Quarto quarto = criarQuarto(residencia);
        Cliente cliente = criarCliente();

        when(residenciaService.buscarEntidade(1L)).thenReturn(residencia);
        when(quartoService.buscarEntidade(2L)).thenReturn(quarto);
        when(clienteService.buscarEntidade(3L)).thenReturn(cliente);
        when(aluguelRepository.buscarConflitos(2L, dataEntrada, dataSaida, null))
                .thenReturn(List.of(new Aluguel()));

        assertThrows(QuartoIndisponivelException.class, () -> service.criar(request));
    }

    @Test
    void cancelarDeveLancarBusinessExceptionQuandoReservaJaIniciou() {
        AluguelService service = criarService();
        Aluguel aluguel = new Aluguel();
        aluguel.setId(10L);
        aluguel.setDataEntrada(LocalDateTime.now().minusDays(1));
        aluguel.setDataSaida(LocalDateTime.now().plusDays(1));

        when(aluguelRepository.findById(10L)).thenReturn(java.util.Optional.of(aluguel));

        assertThrows(BusinessException.class, () -> service.cancelar(10L));
        verify(aluguelRepository).findById(10L);
        verifyNoInteractions(residenciaService, quartoService, clienteService);
    }

    private AluguelService criarService() {
        return new AluguelService(aluguelRepository, residenciaService, quartoService, clienteService);
    }

    private AluguelRequest criarRequest(LocalDateTime dataEntrada, LocalDateTime dataSaida) {
        return new AluguelRequest(1L, 2L, 3L, dataEntrada, dataSaida, 2, false);
    }

    private Residencia criarResidencia() {
        Residencia residencia = new Residencia();
        residencia.setId(1L);
        return residencia;
    }

    private Quarto criarQuarto(Residencia residencia) {
        Quarto quarto = new Quarto();
        quarto.setId(2L);
        quarto.setResidencia(residencia);
        quarto.setTipo(TipoQuarto.FAMILIA);
        quarto.setValorBase(BigDecimal.valueOf(200));
        quarto.setCapacidadeMaxima(4);
        quarto.setPermiteBerco(false);
        return quarto;
    }

    private Cliente criarCliente() {
        Cliente cliente = new Cliente();
        cliente.setId(3L);
        return cliente;
    }
}
