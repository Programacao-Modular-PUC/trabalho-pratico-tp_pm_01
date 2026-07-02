package com.example.maraureserve.reports.command;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.example.maraureserve.reports.RelatorioFactory;
import com.example.maraureserve.reports.RelatorioStrategy;

class GerarRelatorioCommandTest {

    @Test
    void construtor_deveNormalizarTipoParaMaiusculas() {
        GerarRelatorioCommand command = new GerarRelatorioCommand("faturamento_mensal", Map.of());

        assertEquals("FATURAMENTO_MENSAL", command.getTipo());
    }

    @Test
    void construtor_parametrosNulos_deveUsarMapaVazio() {
        GerarRelatorioCommand command = new GerarRelatorioCommand("FATURAMENTO_MENSAL", null);

        assertTrue(command.getParametros().isEmpty());
    }

    @Test
    void executar_deveDelegarParaFactoryEEstrategia() {
        List<String> esperado = List.of("linha-1");
        RelatorioFactory factory = new RelatorioFactory(List.of(estrategiaFake("FATURAMENTO_MENSAL", esperado)));
        GerarRelatorioCommand command = new GerarRelatorioCommand(
                "FATURAMENTO_MENSAL",
                Map.of("ano", 2025));

        Object resultado = command.executar(factory);

        assertEquals(esperado, resultado);
    }

    private RelatorioStrategy estrategiaFake(String tipo, Object resultado) {
        return new RelatorioStrategy() {
            @Override
            public String getTipo() {
                return tipo;
            }

            @Override
            public Object gerar(Map<String, Object> parametros) {
                return resultado;
            }
        };
    }
}
