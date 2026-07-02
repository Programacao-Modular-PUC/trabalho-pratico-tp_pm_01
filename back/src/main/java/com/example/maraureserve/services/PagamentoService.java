package com.example.maraureserve.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.maraureserve.common.exception.ResourceNotFoundException;
import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.models.StatusPagamento;
import com.example.maraureserve.repositories.PagamentoRepository;

@Service
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;

    public PagamentoService(PagamentoRepository pagamentoRepository) {
        this.pagamentoRepository = pagamentoRepository;
    }

    @Transactional
    public Pagamento registrar(Aluguel aluguel) {
        Pagamento pagamento = new Pagamento();
        pagamento.setAluguel(aluguel);
        pagamento.setValorTotal(aluguel.getValorFinal());
        pagamento.setDataRegistro(LocalDateTime.now());
        pagamento.setStatus(StatusPagamento.PENDENTE);
        return pagamentoRepository.save(pagamento);
    }

    @Transactional
    public Pagamento processar(Long aluguelId) {
        Pagamento pagamento = buscarPorAluguel(aluguelId);
        pagamento.processar();
        return pagamentoRepository.save(pagamento);
    }

    @Transactional
    public Pagamento confirmar(Long aluguelId) {
        Pagamento pagamento = buscarPorAluguel(aluguelId);
        pagamento.confirmar();
        return pagamentoRepository.save(pagamento);
    }

    @Transactional(readOnly = true)
    public Pagamento buscarPorAluguel(Long aluguelId) {
        return pagamentoRepository.findByAluguelId(aluguelId)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento do aluguel", aluguelId));
    }

    @Transactional(readOnly = true)
    public Map<Long, Pagamento> buscarPorAlugueis(List<Long> aluguelIds) {
        return pagamentoRepository.findByAluguelIdIn(aluguelIds).stream()
                .collect(Collectors.toMap(
                        pagamento -> pagamento.getAluguel().getId(),
                        Function.identity()));
    }
}
