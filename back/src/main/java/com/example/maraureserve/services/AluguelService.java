package com.example.maraureserve.services;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.maraureserve.dtos.AluguelRequest;
import com.example.maraureserve.dtos.AluguelResponse;
import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.repositories.AluguelRepository;
import com.example.maraureserve.common.exception.BusinessException;
import com.example.maraureserve.common.exception.ResourceNotFoundException;

@Service
public class AluguelService {

    private static final LocalTime HORA_PADRAO_CHECKIN = LocalTime.NOON;
    private static final LocalTime HORA_PADRAO_CHECKOUT = LocalTime.NOON;

    private final AluguelRepository aluguelRepository;
    private final ResidenciaService residenciaService;
    private final QuartoService quartoService;
    private final ClienteService clienteService;

    public AluguelService(
            AluguelRepository aluguelRepository,
            ResidenciaService residenciaService,
            QuartoService quartoService,
            ClienteService clienteService) {
        this.aluguelRepository = aluguelRepository;
        this.residenciaService = residenciaService;
        this.quartoService = quartoService;
        this.clienteService = clienteService;
    }

    @Transactional(readOnly = true)
    public List<AluguelResponse> listar() {
        return aluguelRepository.findAll().stream()
                .map(AluguelResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public AluguelResponse buscarPorId(Long id) {
        return AluguelResponse.fromEntity(buscarEntidade(id));
    }

    @Transactional
    public AluguelResponse criar(AluguelRequest request) {
        Aluguel aluguel = new Aluguel();
        preencherCampos(aluguel, request, null);
        return AluguelResponse.fromEntity(aluguelRepository.save(aluguel));
    }

    @Transactional
    public AluguelResponse atualizar(Long id, AluguelRequest request) {
        Aluguel aluguel = buscarEntidade(id);
        preencherCampos(aluguel, request, id);
        return AluguelResponse.fromEntity(aluguelRepository.save(aluguel));
    }

    @Transactional
    public void excluir(Long id) {
        Aluguel aluguel = buscarEntidade(id);
        aluguelRepository.delete(aluguel);
    }

    @Transactional(readOnly = true)
    public Aluguel buscarEntidade(Long id) {
        return aluguelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluguel", id));
    }

    private void preencherCampos(Aluguel aluguel, AluguelRequest request, Long aluguelIdIgnorado) {
        validarDatas(request.dataEntrada(), request.dataSaida());

        Residencia residencia = residenciaService.buscarEntidade(request.residenciaId());
        Quarto quarto = quartoService.buscarEntidade(request.quartoId());
        Cliente cliente = clienteService.buscarEntidade(request.clienteId());

        if (!quarto.getResidencia().getId().equals(residencia.getId())) {
            throw new BusinessException("O quarto informado não pertence à residência selecionada.");
        }

        if (request.quantidadeHospedes() > quarto.getCapacidadeMaxima()) {
            throw new BusinessException("A quantidade de hóspedes excede a capacidade máxima do quarto.");
        }

        if (Boolean.TRUE.equals(request.bercoSolicitado()) && !Boolean.TRUE.equals(quarto.getPermiteBerco())) {
            throw new BusinessException("O quarto informado não permite solicitação de berço.");
        }

        boolean possuiConflito = !aluguelRepository.buscarConflitos(
                quarto.getId(),
                request.dataEntrada(),
                request.dataSaida(),
                aluguelIdIgnorado).isEmpty();

        if (possuiConflito) {
            throw new BusinessException("O quarto já está reservado para o período informado.");
        }

        int quantidadeDiarias = calcularDiarias(request.dataEntrada(), request.dataSaida());
        BigDecimal valorDiaria = quarto.calcularValorDiaria(request.quantidadeHospedes(), request.bercoSolicitado());
        BigDecimal valorFinal = valorDiaria.multiply(BigDecimal.valueOf(quantidadeDiarias));

        aluguel.setResidencia(residencia);
        aluguel.setQuarto(quarto);
        aluguel.setCliente(cliente);
        aluguel.setDataEntrada(request.dataEntrada());
        aluguel.setDataSaida(request.dataSaida());
        aluguel.setQuantidadeHospedes(request.quantidadeHospedes());
        aluguel.setQuantidadeDiarias(quantidadeDiarias);
        aluguel.setBercoSolicitado(Boolean.TRUE.equals(request.bercoSolicitado()));
        aluguel.setValorDiaria(valorDiaria);
        aluguel.setValorFinal(valorFinal);
    }

    private void validarDatas(LocalDateTime dataEntrada, LocalDateTime dataSaida) {
        if (!dataSaida.isAfter(dataEntrada)) {
            throw new BusinessException("A data de saída deve ser posterior à data de entrada.");
        }
    }

    private int calcularDiarias(LocalDateTime dataEntrada, LocalDateTime dataSaida) {
        LocalDate dataBaseEntrada = ajustarDataParaDiaria(dataEntrada, HORA_PADRAO_CHECKIN);
        LocalDate dataBaseSaida = ajustarDataParaDiaria(dataSaida, HORA_PADRAO_CHECKOUT);

        long diarias = Duration.between(
                dataBaseEntrada.atStartOfDay(),
                dataBaseSaida.atStartOfDay()).toDays();

        return Math.max(1, (int) diarias);
    }

    private LocalDate ajustarDataParaDiaria(LocalDateTime dataHora, LocalTime horarioCorte) {
        LocalDate data = dataHora.toLocalDate();
        if (dataHora.toLocalTime().isAfter(horarioCorte)) {
            return data.plusDays(1);
        }
        return data;
    }
}
