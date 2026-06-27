package com.example.maraureserve.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.maraureserve.dtos.AluguelRequest;
import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.repositories.AluguelRepository;
import com.example.maraureserve.common.exception.CapacidadeExcedidaException;
import com.example.maraureserve.common.exception.RecursoNaoPermitidoException;
import com.example.maraureserve.common.exception.QuartoIndisponivelException;

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

    @InjectMocks
    private AluguelService aluguelService;

    private AluguelRequest requestValido;
    private Residencia residencia;
    private Quarto quarto;
    private Cliente cliente;

    @BeforeEach
    void setUp() {
        residencia = new Residencia();
        residencia.setId(1L);

        quarto = mock(Quarto.class);
        when(quarto.getResidencia()).thenReturn(residencia);
        
        cliente = new Cliente();
        cliente.setId(1L);

        requestValido = new AluguelRequest(
                1L, 
                1L, 
                1L, 
                LocalDateTime.now().plusDays(1), 
                LocalDateTime.now().plusDays(3), 
                2, 
                false
        );
    }

    @Test
    void testLimitesDeHospedes_CapacidadeExcedida_LancaExcecao() {
        when(quarto.getCapacidadeMaxima()).thenReturn(1);
        when(residenciaService.buscarEntidade(1L)).thenReturn(residencia);
        when(quartoService.buscarEntidade(1L)).thenReturn(quarto);
        when(clienteService.buscarEntidade(1L)).thenReturn(cliente);

        assertThrows(CapacidadeExcedidaException.class, () -> {
            aluguelService.criar(requestValido);
        });
    }

    @Test
    void testRegrasDeBerco_BercoSolicitadoENaoPermitido_LancaExcecao() {
        AluguelRequest requestComBerco = new AluguelRequest(
                1L, 1L, 1L, LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(3), 2, true
        );
        
        when(quarto.getCapacidadeMaxima()).thenReturn(4);
        when(quarto.getPermiteBerco()).thenReturn(false);
        when(residenciaService.buscarEntidade(1L)).thenReturn(residencia);
        when(quartoService.buscarEntidade(1L)).thenReturn(quarto);
        when(clienteService.buscarEntidade(1L)).thenReturn(cliente);

        assertThrows(RecursoNaoPermitidoException.class, () -> {
            aluguelService.criar(requestComBerco);
        });
    }

    @Test
    void testDisponibilidade_QuartoIndisponivel_LancaExcecao() {
        when(quarto.getId()).thenReturn(1L);
        when(quarto.getCapacidadeMaxima()).thenReturn(4);
        when(residenciaService.buscarEntidade(1L)).thenReturn(residencia);
        when(quartoService.buscarEntidade(1L)).thenReturn(quarto);
        when(clienteService.buscarEntidade(1L)).thenReturn(cliente);

        when(aluguelRepository.buscarConflitos(eq(1L), any(LocalDateTime.class), any(LocalDateTime.class), isNull()))
                .thenReturn(List.of(new Aluguel()));

        assertThrows(QuartoIndisponivelException.class, () -> {
            aluguelService.criar(requestValido);
        });
    }
}