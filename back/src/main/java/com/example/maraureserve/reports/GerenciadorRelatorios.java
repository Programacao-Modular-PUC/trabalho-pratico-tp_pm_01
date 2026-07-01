package com.example.maraureserve.reports;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Gerenciador centralizado de relatórios — Singleton.
 *
 * Justificativa: um único registro de estratégias garante consistência em toda
 * a aplicação. Múltiplas instâncias poderiam levar a registros diferentes e
 * comportamento imprevisível.
 */
@Component
public class GerenciadorRelatorios {

    private static volatile GerenciadorRelatorios instancia;

    private final Map<String, RelatorioStrategy> estrategias = new HashMap<>();

    public GerenciadorRelatorios(List<RelatorioStrategy> todasEstrategias) {
        if (instancia != null) {
            throw new IllegalStateException("GerenciadorRelatorios já foi instanciado — use getInstance()");
        }
        todasEstrategias.forEach(e -> estrategias.put(e.getTipo(), e));
        instancia = this;
    }

    public static GerenciadorRelatorios getInstance() {
        if (instancia == null) {
            throw new IllegalStateException("GerenciadorRelatorios ainda não foi inicializado pelo Spring");
        }
        return instancia;
    }

    public Object gerarRelatorio(String tipo, Map<String, Object> parametros) {
        RelatorioStrategy estrategia = estrategias.get(tipo);
        if (estrategia == null) {
            throw new IllegalArgumentException("Tipo de relatório não encontrado: " + tipo
                    + ". Tipos disponíveis: " + estrategias.keySet());
        }
        return estrategia.gerar(parametros);
    }

    public Set<String> getTiposDisponiveis() {
        return estrategias.keySet();
    }
}
