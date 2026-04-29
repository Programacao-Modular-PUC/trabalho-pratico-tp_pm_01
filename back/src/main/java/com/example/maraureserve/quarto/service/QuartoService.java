package com.example.maraureserve.quarto.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.maraureserve.common.exception.BusinessException;
import com.example.maraureserve.common.exception.ResourceNotFoundException;
import com.example.maraureserve.quarto.dto.QuartoRequest;
import com.example.maraureserve.quarto.dto.QuartoResponse;
import com.example.maraureserve.quarto.model.Quarto;
import com.example.maraureserve.quarto.repository.QuartoRepository;
import com.example.maraureserve.residencia.model.Residencia;
import com.example.maraureserve.residencia.service.ResidenciaService;

@Service
public class QuartoService {

    private final QuartoRepository quartoRepository;
    private final ResidenciaService residenciaService;

    public QuartoService(QuartoRepository quartoRepository, ResidenciaService residenciaService) {
        this.quartoRepository = quartoRepository;
        this.residenciaService = residenciaService;
    }

    @Transactional(readOnly = true)
    public List<QuartoResponse> listar() {
        return quartoRepository.findAll().stream()
                .map(QuartoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuartoResponse buscarPorId(Long id) {
        return QuartoResponse.fromEntity(buscarEntidade(id));
    }

    @Transactional
    public QuartoResponse criar(QuartoRequest request) {
        Quarto quarto = new Quarto();
        preencherCampos(quarto, request);
        return QuartoResponse.fromEntity(quartoRepository.save(quarto));
    }

    @Transactional
    public QuartoResponse atualizar(Long id, QuartoRequest request) {
        Quarto quarto = buscarEntidade(id);
        preencherCampos(quarto, request);
        return QuartoResponse.fromEntity(quartoRepository.save(quarto));
    }

    @Transactional
    public void excluir(Long id) {
        Quarto quarto = buscarEntidade(id);
        if (!quarto.getAlugueis().isEmpty()) {
            throw new BusinessException("Não é possível excluir um quarto que já possui aluguéis vinculados.");
        }
        quartoRepository.delete(quarto);
    }

    @Transactional(readOnly = true)
    public Quarto buscarEntidade(Long id) {
        return quartoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quarto", id));
    }

    private void preencherCampos(Quarto quarto, QuartoRequest request) {
        Residencia residencia = residenciaService.buscarEntidade(request.residenciaId());
        quarto.setCodigo(request.codigo());
        quarto.setTipo(request.tipo());
        quarto.setValorBase(request.valorBase());
        quarto.setPossuiArCondicionado(request.possuiArCondicionado());
        quarto.setPossuiHidromassagem(request.possuiHidromassagem());
        quarto.setCapacidadeMaxima(request.capacidadeMaxima());
        quarto.setResidencia(residencia);
    }
}
