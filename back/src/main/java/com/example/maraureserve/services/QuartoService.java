package com.example.maraureserve.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.maraureserve.common.exception.BusinessException;
import com.example.maraureserve.common.exception.ResourceNotFoundException;
import com.example.maraureserve.dtos.QuartoRequest;
import com.example.maraureserve.dtos.QuartoResponse;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.repositories.QuartoRepository;

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
        quarto.setQuantidadeCamasSolteiro(request.quantidadeCamasSolteiro());
        quarto.setQuantidadeCamasCasal(request.quantidadeCamasCasal());
        quarto.setQuantidadeCamasQueen(request.quantidadeCamasQueen());
        quarto.setQuantidadeCamasKing(request.quantidadeCamasKing());
        quarto.setQuantidadeAmbientes(request.quantidadeAmbientes());
        quarto.setValorAdicionalPorCamaSolteiro(request.valorAdicionalPorCamaSolteiro());
        quarto.setValorAdicionalCamaCasal(request.valorAdicionalCamaCasal());
        quarto.setValorAdicionalCamaQueenKing(request.valorAdicionalCamaQueenKing());
        quarto.setTaxaBerco(request.taxaBerco());
        quarto.setPercentualAdicionalPorHospede(request.percentualAdicionalPorHospede());
        quarto.setPermiteBerco(request.permiteBerco());
        quarto.setTipoCamaCasal(request.tipoCamaCasal());
        quarto.setCapacidadeMaxima(resolveCapacidadeMaxima(quarto, request.capacidadeMaxima()));
        quarto.setResidencia(residencia);
        validarConfiguracao(quarto);
    }

    private Integer resolveCapacidadeMaxima(Quarto quarto, Integer capacidadeInformada) {
        Integer capacidadeCalculada = quarto.calcularCapacidadeMaxima();
        if (capacidadeCalculada != null && capacidadeCalculada > 0) {
            return capacidadeCalculada;
        }
        return capacidadeInformada;
    }

    private void validarConfiguracao(Quarto quarto) {
        switch (quarto.getTipo()) {
            case INDIVIDUAL -> {
                if (quarto.getQuantidadeCamasSolteiro() == null || quarto.getQuantidadeCamasSolteiro() < 1) {
                    throw new BusinessException("Quarto individual deve ter pelo menos uma cama de solteiro.");
                }
                quarto.setPermiteBerco(false);
            }
            case DUPLO, CASAL -> {
                if (quarto.getTipoCamaCasal() == null) {
                    throw new BusinessException("Quarto duplo deve informar o tipo da cama de casal.");
                }
            }
            case FAMILIA -> {
                if (quarto.getCapacidadeMaxima() == null || quarto.getCapacidadeMaxima() < 1) {
                    throw new BusinessException("Quarto familia deve ter configuracao de camas com capacidade positiva.");
                }
                if (quarto.getQuantidadeAmbientes() == null || quarto.getQuantidadeAmbientes() < 1) {
                    throw new BusinessException("Quarto familia deve informar pelo menos um ambiente.");
                }
            }
        }
    }
}
