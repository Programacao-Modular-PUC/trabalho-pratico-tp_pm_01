package com.example.maraureserve.services;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.maraureserve.config.ConfiguracaoReservas;
import com.example.maraureserve.dtos.AluguelRequest;
import com.example.maraureserve.dtos.AluguelResponse;
import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.models.StatusAluguel;
import com.example.maraureserve.repositories.AluguelRepository;
import com.example.maraureserve.notifications.GerenciadorNotificacoes;
import com.example.maraureserve.notifications.evento.NotificacaoEvento;
import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;
import com.example.maraureserve.common.exception.BusinessException;
import com.example.maraureserve.common.exception.CapacidadeExcedidaException;
import com.example.maraureserve.common.exception.RecursoNaoPermitidoException;
import com.example.maraureserve.common.exception.DataInvalidaException;
import com.example.maraureserve.common.exception.QuartoIndisponivelException;
import com.example.maraureserve.common.exception.ResourceNotFoundException;

@Service
public class AluguelService {

    private final ConfiguracaoReservas configuracao = ConfiguracaoReservas.getInstance();
    private final GerenciadorNotificacoes gerenciadorNotificacoes = GerenciadorNotificacoes.getInstance();

    private final AluguelRepository aluguelRepository;
    private final ResidenciaService residenciaService;
    private final QuartoService quartoService;
    private final ClienteService clienteService;
    private final PagamentoService pagamentoService;

    public AluguelService(
            AluguelRepository aluguelRepository,
            ResidenciaService residenciaService,
            QuartoService quartoService,
            ClienteService clienteService,
            PagamentoService pagamentoService) {
        this.aluguelRepository = aluguelRepository;
        this.residenciaService = residenciaService;
        this.quartoService = quartoService;
        this.clienteService = clienteService;
        this.pagamentoService = pagamentoService;
    }

    @Transactional(readOnly = true)
    public List<AluguelResponse> listar() {
        List<Aluguel> alugueis = aluguelRepository.findAll();
        Map<Long, Pagamento> pagamentos = pagamentoService.buscarPorAlugueis(
                alugueis.stream().map(Aluguel::getId).toList());
        return alugueis.stream()
                .map(aluguel -> AluguelResponse.fromEntity(aluguel, pagamentos.get(aluguel.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public AluguelResponse buscarPorId(Long id) {
        Aluguel aluguel = buscarEntidade(id);
        return AluguelResponse.fromEntity(aluguel, pagamentoService.buscarPorAluguel(id));
    }

    @Transactional
    public AluguelResponse criar(AluguelRequest request) {
        Aluguel aluguel = new Aluguel();
        preencherCampos(aluguel, request, null);
        aluguel.setStatus(StatusAluguel.RESERVADA);
        Aluguel salvo = aluguelRepository.save(aluguel);
        Pagamento pagamento = pagamentoService.registrar(salvo);
        publicarEvento(TipoEventoNotificacao.RESERVA_CRIADA, salvo);
        return AluguelResponse.fromEntity(salvo, pagamento);
    }

    @Transactional
    public AluguelResponse atualizar(Long id, AluguelRequest request) {
        Aluguel aluguel = buscarEntidade(id);
        preencherCampos(aluguel, request, id);
        Aluguel salvo = aluguelRepository.save(aluguel);
        return AluguelResponse.fromEntity(salvo, pagamentoService.buscarPorAluguel(id));
    }

    @Transactional(readOnly = true)
    public List<AluguelResponse> listarPorCliente(Long clienteId) {
        clienteService.buscarEntidade(clienteId);
        List<Aluguel> alugueis = aluguelRepository.findByClienteIdOrderByDataEntradaDesc(clienteId);
        Map<Long, Pagamento> pagamentos = pagamentoService.buscarPorAlugueis(
                alugueis.stream().map(Aluguel::getId).toList());
        return alugueis.stream()
                .map(aluguel -> AluguelResponse.fromEntity(aluguel, pagamentos.get(aluguel.getId())))
                .toList();
    }

    @Transactional
    public void cancelar(Long id) {
        Aluguel aluguel = buscarEntidade(id);
        validarCancelamento(aluguel);
        publicarEvento(TipoEventoNotificacao.RESERVA_CANCELADA, aluguel);
        aluguelRepository.delete(aluguel);
    }

    @Transactional
    public AluguelResponse realizarCheckIn(Long id) {
        Aluguel aluguel = buscarEntidade(id);
        if (aluguel.getStatus() != StatusAluguel.RESERVADA) {
            throw new BusinessException("Check-in permitido apenas para reservas confirmadas.");
        }
        aluguel.setStatus(StatusAluguel.EM_ANDAMENTO);
        Aluguel salvo = aluguelRepository.save(aluguel);
        publicarEvento(TipoEventoNotificacao.CHECKIN_REALIZADO, salvo);
        return AluguelResponse.fromEntity(salvo, pagamentoService.buscarPorAluguel(id));
    }

    @Transactional
    public AluguelResponse realizarCheckOut(Long id) {
        Aluguel aluguel = buscarEntidade(id);
        if (aluguel.getStatus() != StatusAluguel.EM_ANDAMENTO) {
            throw new BusinessException("Check-out permitido apenas para hospedagens em andamento.");
        }
        aluguel.setStatus(StatusAluguel.FINALIZADA);
        Aluguel salvo = aluguelRepository.save(aluguel);
        publicarEvento(TipoEventoNotificacao.CHECKOUT_REALIZADO, salvo);
        return AluguelResponse.fromEntity(salvo, pagamentoService.buscarPorAluguel(id));
    }

    @Transactional
    public AluguelResponse processarPagamento(Long id) {
        Aluguel aluguel = buscarEntidade(id);
        Pagamento pagamento = pagamentoService.processar(id);
        return AluguelResponse.fromEntity(aluguel, pagamento);
    }

    @Transactional
    public AluguelResponse confirmarPagamento(Long id) {
        Aluguel aluguel = buscarEntidade(id);
        Pagamento pagamento = pagamentoService.confirmar(id);
        publicarEvento(TipoEventoNotificacao.PAGAMENTO_CONFIRMADO, aluguel);
        return AluguelResponse.fromEntity(aluguel, pagamento);
    }

    private void publicarEvento(TipoEventoNotificacao tipo, Aluguel aluguel) {
        gerenciadorNotificacoes.publicar(new NotificacaoEvento(tipo, aluguel));
    }

    @Transactional
    public void excluir(Long id) {
        cancelar(id);
    }

    private void validarCancelamento(Aluguel aluguel) {
        if (!aluguel.getDataEntrada().isAfter(LocalDateTime.now())) {
            throw new BusinessException(
                    "Não é possível cancelar um aluguel ou reserva já iniciado ou finalizado.");
        }
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

        validarCapacidadeHospedes(request.quantidadeHospedes(), quarto);
        validarSolicitacaoBerco(request.bercoSolicitado(), quarto);

        validarDisponibilidadeQuarto(quarto, request.dataEntrada(), request.dataSaida(), aluguelIdIgnorado);

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
        if (dataEntrada == null || dataSaida == null) {
            throw new DataInvalidaException("As datas de entrada e saida sao obrigatorias.");
        }

        LocalDateTime agora = LocalDateTime.now();
        if (!dataEntrada.isAfter(agora) || !dataSaida.isAfter(agora)) {
            throw new DataInvalidaException("As datas de entrada e saida devem estar no futuro.");
        }

        if (!dataSaida.isAfter(dataEntrada)) {
            throw new DataInvalidaException("A data de saida deve ser posterior a data de entrada.");
        }
    }

    private void validarDisponibilidadeQuarto(
            Quarto quarto,
            LocalDateTime dataEntrada,
            LocalDateTime dataSaida,
            Long aluguelIdIgnorado) {
        boolean possuiConflito = !aluguelRepository.buscarConflitos(
                quarto.getId(),
                dataEntrada,
                dataSaida,
                aluguelIdIgnorado).isEmpty();

        if (possuiConflito) {
            throw new QuartoIndisponivelException("O quarto ja esta reservado para o periodo informado.");
        }
    }

    private void validarCapacidadeHospedes(Integer quantidadeHospedes, Quarto quarto) {
        if (quantidadeHospedes > quarto.getCapacidadeMaxima()) {
            throw new CapacidadeExcedidaException(
                    "A quantidade de hóspedes excede a capacidade máxima do quarto.");
        }
    }

    private void validarSolicitacaoBerco(Boolean bercoSolicitado, Quarto quarto) {
        if (Boolean.TRUE.equals(bercoSolicitado) && !Boolean.TRUE.equals(quarto.getPermiteBerco())) {
            throw new RecursoNaoPermitidoException("O quarto informado não permite solicitação de berço.");
        }
    }

    private int calcularDiarias(LocalDateTime dataEntrada, LocalDateTime dataSaida) {
        LocalDate dataBaseEntrada = ajustarDataParaDiaria(dataEntrada, configuracao.getHoraCheckin());
        LocalDate dataBaseSaida = ajustarDataParaDiaria(dataSaida, configuracao.getHoraCheckout());

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
