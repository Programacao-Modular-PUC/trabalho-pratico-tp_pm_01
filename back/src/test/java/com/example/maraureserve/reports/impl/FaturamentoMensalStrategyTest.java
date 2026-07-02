package com.example.maraureserve.reports.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.example.maraureserve.dtos.relatorios.FaturamentoMensalDTO;
import com.example.maraureserve.repositories.AluguelRepository;

class FaturamentoMensalStrategyTest {

    @Test
    void gerar_semFiltro_deveRetornarTodosRegistros() {
        AluguelRepository repository = repositorioComDados(
                linha(2025, 6, "1500.00", 3),
                linha(2024, 12, "800.00", 2));
        FaturamentoMensalStrategy strategy = new FaturamentoMensalStrategy(repository);

        @SuppressWarnings("unchecked")
        List<FaturamentoMensalDTO> resultado = (List<FaturamentoMensalDTO>) strategy.gerar(Map.of());

        assertEquals(2, resultado.size());
        assertEquals(2025, resultado.get(0).ano());
        assertEquals(6, resultado.get(0).mes());
        assertEquals("junho", resultado.get(0).nomeMes());
        assertEquals(new BigDecimal("1500.00"), resultado.get(0).totalFaturado());
        assertEquals(3, resultado.get(0).quantidadeAlugueis());
    }

    @Test
    void gerar_comFiltroAno_deveRetornarApenasAnoInformado() {
        AluguelRepository repository = repositorioComDados(
                linha(2025, 6, "1500.00", 3),
                linha(2024, 12, "800.00", 2));
        FaturamentoMensalStrategy strategy = new FaturamentoMensalStrategy(repository);

        @SuppressWarnings("unchecked")
        List<FaturamentoMensalDTO> resultado = (List<FaturamentoMensalDTO>) strategy.gerar(Map.of("ano", 2025));

        assertEquals(1, resultado.size());
        assertEquals(2025, resultado.get(0).ano());
    }

    @Test
    void getTipo_deveRetornarIdentificadorCorreto() {
        FaturamentoMensalStrategy strategy = new FaturamentoMensalStrategy(repositorioComDados());

        assertEquals("FATURAMENTO_MENSAL", strategy.getTipo());
    }

    private Object[] linha(int ano, int mes, String total, long quantidade) {
        return new Object[]{ano, mes, new BigDecimal(total), quantidade};
    }

    private AluguelRepository repositorioComDados(Object[]... linhas) {
        List<Object[]> dados = List.of(linhas);
        return (AluguelRepository) Proxy.newProxyInstance(
                AluguelRepository.class.getClassLoader(),
                new Class[]{AluguelRepository.class},
                (proxy, method, args) -> {
                    if ("buscarFaturamentoMensal".equals(method.getName())) {
                        return dados;
                    }
                    Class<?> returnType = method.getReturnType();
                    if (returnType.equals(List.class)) {
                        return List.of();
                    }
                    if (returnType.equals(long.class) || returnType.equals(Long.class)) {
                        return 0L;
                    }
                    if (returnType.equals(int.class) || returnType.equals(Integer.class)) {
                        return 0;
                    }
                    if (returnType.equals(boolean.class) || returnType.equals(Boolean.class)) {
                        return false;
                    }
                    return null;
                });
    }
}
