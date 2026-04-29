package com.example.maraureserve.residencia.dto;

import com.example.maraureserve.residencia.model.Residencia;

public record ResidenciaResponse(
        Long id,
        String endereco,
        String numero,
        String bairro,
        String cep,
        String telefone,
        String email,
        int quantidadeQuartos,
        int quantidadeAlugueis) {

    public static ResidenciaResponse fromEntity(Residencia residencia) {
        return new ResidenciaResponse(
                residencia.getId(),
                residencia.getEndereco(),
                residencia.getNumero(),
                residencia.getBairro(),
                residencia.getCep(),
                residencia.getTelefone(),
                residencia.getEmail(),
                residencia.getQuartos().size(),
                residencia.getHistoricoAlugueis().size());
    }
}
