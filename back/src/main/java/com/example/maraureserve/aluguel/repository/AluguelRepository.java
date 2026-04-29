package com.example.maraureserve.aluguel.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.maraureserve.aluguel.model.Aluguel;

public interface AluguelRepository extends JpaRepository<Aluguel, Long> {

    @Query("""
            select a
            from Aluguel a
            where a.quarto.id = :quartoId
              and (:aluguelIdIgnorado is null or a.id <> :aluguelIdIgnorado)
              and a.dataEntrada < :dataSaida
              and a.dataSaida > :dataEntrada
            """)
    List<Aluguel> buscarConflitos(
            @Param("quartoId") Long quartoId,
            @Param("dataEntrada") LocalDateTime dataEntrada,
            @Param("dataSaida") LocalDateTime dataSaida,
            @Param("aluguelIdIgnorado") Long aluguelIdIgnorado);
}
