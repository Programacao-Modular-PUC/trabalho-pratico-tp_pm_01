package com.example.maraureserve.residencia.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.maraureserve.common.exception.BusinessException;
import com.example.maraureserve.common.exception.ResourceNotFoundException;
import com.example.maraureserve.residencia.dto.ResidenciaRequest;
import com.example.maraureserve.residencia.dto.ResidenciaResponse;
import com.example.maraureserve.residencia.model.Residencia;
import com.example.maraureserve.residencia.repository.ResidenciaRepository;

@Service
public class ResidenciaService {

    private final ResidenciaRepository residenciaRepository;

    public ResidenciaService(ResidenciaRepository residenciaRepository) {
        this.residenciaRepository = residenciaRepository;
    }

    @Transactional(readOnly = true)
    public List<ResidenciaResponse> listar() {
        return residenciaRepository.findAll().stream()
                .map(ResidenciaResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResidenciaResponse buscarPorId(Long id) {
        return ResidenciaResponse.fromEntity(buscarEntidade(id));
    }

    @Transactional
    public ResidenciaResponse criar(ResidenciaRequest request) {
        Residencia residencia = new Residencia();
        preencherCampos(residencia, request);
        return ResidenciaResponse.fromEntity(residenciaRepository.save(residencia));
    }

    @Transactional
    public ResidenciaResponse atualizar(Long id, ResidenciaRequest request) {
        Residencia residencia = buscarEntidade(id);
        preencherCampos(residencia, request);
        return ResidenciaResponse.fromEntity(residenciaRepository.save(residencia));
    }

    @Transactional
    public void excluir(Long id) {
        Residencia residencia = buscarEntidade(id);
        if (!residencia.getHistoricoAlugueis().isEmpty()) {
            throw new BusinessException("Não é possível excluir uma residência com histórico de aluguéis.");
        }
        residenciaRepository.delete(residencia);
    }

    @Transactional(readOnly = true)
    public Residencia buscarEntidade(Long id) {
        return residenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Residência", id));
    }

    private void preencherCampos(Residencia residencia, ResidenciaRequest request) {
        residencia.setEndereco(request.endereco());
        residencia.setNumero(request.numero());
        residencia.setBairro(request.bairro());
        residencia.setCep(request.cep());
        residencia.setTelefone(request.telefone());
        residencia.setEmail(request.email());
    }
}
