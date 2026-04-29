package com.example.maraureserve.cliente.dto;

import com.example.maraureserve.cliente.model.Cliente;

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
