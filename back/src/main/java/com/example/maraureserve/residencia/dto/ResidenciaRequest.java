package com.example.maraureserve.residencia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResidenciaRequest(
        @NotBlank(message = "O endereço é obrigatório.")
        String endereco,

        @NotBlank(message = "O número é obrigatório.")
        String numero,

        @NotBlank(message = "O bairro é obrigatório.")
        String bairro,

        @NotBlank(message = "O CEP é obrigatório.")
        @Pattern(regexp = "\\d{8}|\\d{5}-\\d{3}", message = "Informe um CEP válido.")
        String cep,

        @NotBlank(message = "O telefone é obrigatório.")
        @Size(min = 8, max = 20, message = "Informe um telefone válido.")
        String telefone,

        @NotBlank(message = "O email é obrigatório.")
        @Email(message = "Informe um email válido.")
        String email) {
}
