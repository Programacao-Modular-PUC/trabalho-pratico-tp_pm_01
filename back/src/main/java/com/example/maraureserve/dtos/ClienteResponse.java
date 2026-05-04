package com.example.maraureserve.dtos;

import com.example.maraureserve.models.Cliente;

public record ClienteResponse(
        Long id,
        String nome,
        String cpf,
        String endereco,
        String telefone,
        String email) {

    public static ClienteResponse fromEntity(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpf(),
                cliente.getEndereco(),
                cliente.getTelefone(),
                cliente.getEmail());
    }
}
