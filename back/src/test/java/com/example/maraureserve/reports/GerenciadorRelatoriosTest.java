package com.example.maraureserve.reports;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.maraureserve.reports.command.GerarRelatorioCommand;
import com.example.maraureserve.reports.decorator.RelatorioResultado;

class GerenciadorRelatoriosTest {

    private GerenciadorRelatorios gerenciador;

    @BeforeEach
    void setUp() {
        GerenciadorRelatorios.resetInstance();
        RelatorioFactory factory = new RelatorioFactory(List.of(
                estrategiaFake("FATURAMENTO_MENSAL", List.of("dado-1")),
                estrategiaFake("TAXA_OCUPACAO", List.of("dado-2"))));
        gerenciador = new GerenciadorRelatorios(factory);
    }

    @AfterEach
    void tearDown() {
        GerenciadorRelatorios.resetInstance();
    }

    @Test
    void getInstance_deveRetornarMesmaInstancia() {
        GerenciadorRelatorios primeira = GerenciadorRelatorios.getInstance();
        GerenciadorRelatorios segunda = GerenciadorRelatorios.getInstance();

        assertSame(primeira, segunda);
    }

    @Test
    void executar_deveAplicarDecoratorComCabecalho() {
        GerarRelatorioCommand command = new GerarRelatorioCommand("FATURAMENTO_MENSAL", Map.of());

        RelatorioResultado resultado = gerenciador.executar(command);

        assertEquals("FATURAMENTO_MENSAL", resultado.getTipo());
        assertEquals("Faturamento Mensal", resultado.getTitulo());
        assertNotNull(resultado.getGeradoEm());
        assertEquals(List.of("dado-1"), resultado.getDados());
    }

    @Test
    void getTiposDisponiveis_deveRetornarTiposRegistrados() {
        Set<String> tipos = gerenciador.getTiposDisponiveis();

        assertEquals(Set.of("FATURAMENTO_MENSAL", "TAXA_OCUPACAO"), tipos);
    }

    @Test
    void executar_tipoInvalido_deveLancarExcecao() {
        GerarRelatorioCommand command = new GerarRelatorioCommand("INEXISTENTE", Map.of());

        assertThrows(IllegalArgumentException.class, () -> gerenciador.executar(command));
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
