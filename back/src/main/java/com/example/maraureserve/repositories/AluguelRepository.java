package com.example.maraureserve.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.maraureserve.models.Aluguel;

public interface AluguelRepository extends JpaRepository<Aluguel, Long> {

    List<Aluguel> findByClienteIdOrderByDataEntradaDesc(Long clienteId);

    @Query("select count(a) from Aluguel a where year(a.dataSaida) = :ano")
    long countBySaidaAno(@Param("ano") int ano);

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

    // ── Relatórios ────────────────────────────────────────────────────────────

    @Query("""
            select year(a.dataSaida), month(a.dataSaida), sum(a.valorFinal), count(a)
            from Aluguel a
            group by year(a.dataSaida), month(a.dataSaida)
            order by year(a.dataSaida), month(a.dataSaida)
            """)
    List<Object[]> buscarFaturamentoMensal();

    @Query("""
            select a.cliente, count(a), coalesce(sum(a.valorFinal), 0)
            from Aluguel a
            group by a.cliente
            order by count(a) desc
            """)
    List<Object[]> buscarClientesFrequentes(Pageable pageable);

    @Query("""
            select a.quarto, count(a), coalesce(sum(a.valorFinal), 0)
            from Aluguel a
            group by a.quarto
            order by count(a) desc
            """)
    List<Object[]> buscarQuartosMaisAlugados(Pageable pageable);

    @Query("""
            select a.quarto.tipo, count(a), coalesce(sum(a.valorFinal), 0)
            from Aluguel a
            group by a.quarto.tipo
            order by sum(a.valorFinal) desc
            """)
    List<Object[]> buscarReceitaPorTipoQuarto();

    @Query("""
            select a.quarto, coalesce(sum(a.quantidadeDiarias), 0)
            from Aluguel a
            where (:dataInicio is null or a.dataEntrada >= :dataInicio)
              and (:dataFim is null or a.dataSaida <= :dataFim)
            group by a.quarto
            order by sum(a.quantidadeDiarias) desc
            """)
    List<Object[]> buscarOcupacaoPorQuarto(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim);

    @Query("""
            select a from Aluguel a
            where (:dataInicio is null or a.dataEntrada >= :dataInicio)
              and (:dataFim is null or a.dataSaida <= :dataFim)
              and (:clienteId is null or a.cliente.id = :clienteId)
              and (:quartoId is null or a.quarto.id = :quartoId)
            order by a.dataEntrada desc
            """)
    List<Aluguel> buscarHistoricoReservas(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            @Param("clienteId") Long clienteId,
            @Param("quartoId") Long quartoId);
}
