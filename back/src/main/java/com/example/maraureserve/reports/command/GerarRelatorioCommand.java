package com.example.maraureserve.reports.command;

import java.util.Map;

import com.example.maraureserve.reports.RelatorioFactory;

/**
 * Command que encapsula a solicitação de geração de um relatório gerencial,
 * desacoplando quem invoca a operação da execução concreta da estratégia.
 */
public class GerarRelatorioCommand {

    private final String tipo;
    private final Map<String, Object> parametros;

    public GerarRelatorioCommand(String tipo, Map<String, Object> parametros) {
        this.tipo = tipo.toUpperCase();
        this.parametros = parametros != null ? parametros : Map.of();
    }

    public String getTipo() {
        return tipo;
    }

    public Map<String, Object> getParametros() {
        return parametros;
    }

    public Object executar(RelatorioFactory relatorioFactory) {
        return relatorioFactory.criar(tipo).gerar(parametros);
    }
}
