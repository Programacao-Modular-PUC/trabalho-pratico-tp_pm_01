package com.example.maraureserve.reports;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;

class RelatorioFactoryTest {

    @Test
    void criar_deveRetornarEstrategiaRegistrada() {
        RelatorioStrategy faturamento = estrategiaFake("FATURAMENTO_MENSAL", List.of("item"));
        RelatorioFactory factory = new RelatorioFactory(List.of(faturamento));

        RelatorioStrategy obtida = factory.criar("FATURAMENTO_MENSAL");

        assertEquals("FATURAMENTO_MENSAL", obtida.getTipo());
        assertEquals(List.of("item"), obtida.gerar(Map.of()));
    }

    @Test
    void criar_tipoInexistente_deveLancarExcecao() {
        RelatorioFactory factory = new RelatorioFactory(List.of(estrategiaFake("FATURAMENTO_MENSAL", List.of())));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> factory.criar("TIPO_INVALIDO"));

        assertEquals(true, ex.getMessage().contains("TIPO_INVALIDO"));
    }

    @Test
    void getTiposDisponiveis_deveListarEstrategiasRegistradas() {
        RelatorioFactory factory = new RelatorioFactory(List.of(
                estrategiaFake("FATURAMENTO_MENSAL", List.of()),
                estrategiaFake("TAXA_OCUPACAO", List.of())));

        Set<String> tipos = factory.getTiposDisponiveis();

        assertEquals(Set.of("FATURAMENTO_MENSAL", "TAXA_OCUPACAO"), tipos);
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
