package com.example.maraureserve.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.maraureserve.models.Pagamento;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    Optional<Pagamento> findByAluguelId(Long aluguelId);

    List<Pagamento> findByAluguelIdIn(List<Long> aluguelIds);
}
