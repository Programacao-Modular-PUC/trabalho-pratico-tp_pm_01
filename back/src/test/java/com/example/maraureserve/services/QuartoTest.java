package com.example.maraureserve.services;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.TipoCamaCasal;
import com.example.maraureserve.models.TipoQuarto;

class QuartoTest {

    @Test
    void testCalculoDiaria_QuartoIndividual_ComAdicionalDeCama() {
        Quarto quarto = new Quarto();
        quarto.setTipo(TipoQuarto.INDIVIDUAL);
        quarto.setValorBase(BigDecimal.valueOf(100.0));
        quarto.setQuantidadeCamasSolteiro(2);
        quarto.setValorAdicionalPorCamaSolteiro(BigDecimal.valueOf(30.0));

        // Regra: ValorBase (100) + adicional (30) para 2ª cama
        BigDecimal valorEsperado = BigDecimal.valueOf(130.0);
        BigDecimal valorCalculado = quarto.calcularValorDiaria(2, false);

        assertEquals(0, valorEsperado.compareTo(valorCalculado));
    }

    @Test
    void testCalculoDiaria_QuartoDuplo_SemBerco_ComAdicionalConforto() {
        Quarto quarto = new Quarto();
        quarto.setTipo(TipoQuarto.DUPLO);
        quarto.setValorBase(BigDecimal.valueOf(150.0));
        quarto.setTipoCamaCasal(TipoCamaCasal.QUEEN);
        quarto.setValorAdicionalCamaQueenKing(BigDecimal.valueOf(50.0));
        quarto.setTaxaBerco(BigDecimal.valueOf(40.0));

        // Regra: ValorBase (150) + adicional conforto (50)
        BigDecimal valorEsperado = BigDecimal.valueOf(200.0);
        BigDecimal valorCalculado = quarto.calcularValorDiaria(2, false);

        assertEquals(0, valorEsperado.compareTo(valorCalculado));
    }

    @Test
    void testCalculoDiaria_QuartoDuplo_ComTaxaDeBerco() {
        Quarto quarto = new Quarto();
        quarto.setTipo(TipoQuarto.DUPLO);
        quarto.setValorBase(BigDecimal.valueOf(150.0));
        quarto.setTipoCamaCasal(TipoCamaCasal.CASAL_PADRAO);
        quarto.setValorAdicionalCamaCasal(BigDecimal.ZERO);
        quarto.setTaxaBerco(BigDecimal.valueOf(40.0));

        // Regra: ValorBase (150) + taxa berço (40)
        BigDecimal valorEsperado = BigDecimal.valueOf(190.0);
        BigDecimal valorCalculado = quarto.calcularValorDiaria(2, true);

        assertEquals(0, valorEsperado.compareTo(valorCalculado));
    }

    @Test
    void testCalculoDiaria_QuartoFamilia_ComDescontoParaGrupo() {
        Quarto quarto = new Quarto();
        quarto.setTipo(TipoQuarto.FAMILIA);
        quarto.setValorBase(BigDecimal.valueOf(200.0));
        quarto.setPercentualAdicionalPorHospede(BigDecimal.valueOf(10)); // 10% por hóspede

        // Regra: 5 hóspedes = +50% no valor base (200 + 100 = 300)
        // Desconto de grupo (≥5 hóspedes) = -10% sobre 300 (300 - 30 = 270)
        BigDecimal valorEsperado = BigDecimal.valueOf(270.0);
        BigDecimal valorCalculado = quarto.calcularValorDiaria(5, false);

        assertEquals(0, valorEsperado.compareTo(valorCalculado));
    }
}
