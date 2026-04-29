package com.example.maraureserve.cliente.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.maraureserve.cliente.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByCpf(String cpf);
}
