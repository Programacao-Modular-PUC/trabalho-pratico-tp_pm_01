package com.example.maraureserve.models;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class QuartoTest {

    @Test
    void testCalculoDiaria_QuartoIndividual_ComAdicionalDeCama() {
        QuartoIndividual quarto = new QuartoIndividual();
        quarto.setValorBase(BigDecimal.valueOf(100.0));
        quarto.setQuantidadeCamasSolteiro(2);
        quarto.setValorAdicionalPorCama(BigDecimal.valueOf(30.0));
        
        // Regra: ValorBase (100) + adicional (30) para 2ª cama
        BigDecimal valorEsperado = BigDecimal.valueOf(130.0);
        BigDecimal valorCalculado = quarto.calcularValorDiaria(2, false);
        
        assertEquals(0, valorEsperado.compareTo(valorCalculado));
    }

    @Test
    void testCalculoDiaria_QuartoDuplo_SemBerco_ComAdicionalConforto() {
        QuartoDuplo quarto = new QuartoDuplo();
        quarto.setValorBase(BigDecimal.valueOf(150.0));
        quarto.setTipoCama(TipoCamaCasal.QUEEN);
        quarto.setValorAdicionalConforto(BigDecimal.valueOf(50.0)); 
        quarto.setTaxaBerco(BigDecimal.valueOf(40.0));
        
        // Regra: ValorBase (150) + adicional conforto (50)
        BigDecimal valorEsperado = BigDecimal.valueOf(200.0);
        BigDecimal valorCalculado = quarto.calcularValorDiaria(2, false);
        
        assertEquals(0, valorEsperado.compareTo(valorCalculado));
    }

    @Test
    void testCalculoDiaria_QuartoDuplo_ComTaxaDeBerco() {
        QuartoDuplo quarto = new QuartoDuplo();
        quarto.setValorBase(BigDecimal.valueOf(150.0));
        quarto.setTipoCama(TipoCamaCasal.CASAL_PADRAO);
        quarto.setValorAdicionalConforto(BigDecimal.ZERO);
        quarto.setTaxaBerco(BigDecimal.valueOf(40.0));
        
        // Regra: ValorBase (150) + taxa berço (40)
        BigDecimal valorEsperado = BigDecimal.valueOf(190.0);
        BigDecimal valorCalculado = quarto.calcularValorDiaria(2, true);
        
        assertEquals(0, valorEsperado.compareTo(valorCalculado));
    }

    @Test
    void testCalculoDiaria_QuartoFamilia_ComDescontoParaGrupo() {
        QuartoFamilia quarto = new QuartoFamilia();
        quarto.setValorBase(BigDecimal.valueOf(200.0));
        quarto.setPercentualPorHospede(BigDecimal.valueOf(0.10)); // 10% por hóspede
        quarto.setDescontoGrupo(DescontoGrupo.A_PARTIR_5_HOSPEDES_10PORCENTO);
        
        // Regra: 5 hóspedes = +50% no valor base (200 + 100 = 300)
        // Desconto de grupo = -10% sobre 300 (300 - 30 = 270)
        BigDecimal valorEsperado = BigDecimal.valueOf(270.0);
        BigDecimal valorCalculado = quarto.calcularValorDiaria(5, false);
        
        assertEquals(0, valorEsperado.compareTo(valorCalculado));
    }
}