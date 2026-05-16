package com.example.maraureserve.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.maraureserve.models.Aluguel;

@Repository
public interface AluguelRepository extends JpaRepository<Aluguel, Long> {

    @Query("SELECT a FROM Aluguel a WHERE a.quarto.id = :quartoId " +
           "AND a.dataEntrada < :dataSaida AND a.dataSaida > :dataEntrada " +
           "AND (:aluguelIdIgnorado IS NULL OR a.id != :aluguelIdIgnorado)")
    List<Aluguel> buscarConflitos(@Param("quartoId") Long quartoId, 
                                  @Param("dataEntrada") LocalDateTime dataEntrada, 
                                  @Param("dataSaida") LocalDateTime dataSaida, 
                                  @Param("aluguelIdIgnorado") Long aluguelIdIgnorado);
}