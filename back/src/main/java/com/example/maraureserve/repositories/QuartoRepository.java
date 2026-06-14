package com.example.maraureserve.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.TipoQuarto;

public interface QuartoRepository extends JpaRepository<Quarto, Long> {

    List<Quarto> findByTipo(TipoQuarto tipo);
}
