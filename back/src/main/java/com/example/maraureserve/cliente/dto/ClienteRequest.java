package com.example.maraureserve.cliente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClienteRequest(
        @NotBlank(message = "O nome é obrigatório.")
        String nome,

        @NotBlank(message = "O CPF é obrigatório.")
        @Pattern(regexp = "\\d{11}", message = "Informe um CPF com 11 dígitos numéricos.")
        String cpf,

        @NotBlank(message = "O endereço é obrigatório.")
        String endereco,

        @NotBlank(message = "O telefone é obrigatório.")
        @Size(min = 8, max = 20, message = "Informe um telefone válido.")
        String telefone,

        @NotBlank(message = "O email é obrigatório.")
        @Email(message = "Informe um email válido.")
        String email) {
}
