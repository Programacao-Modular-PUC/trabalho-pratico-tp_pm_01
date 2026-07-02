package com.example.maraureserve.reports;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Factory responsável por resolver a {@link RelatorioStrategy} correta
 * conforme o tipo solicitado, centralizando o registro das estratégias.
 */
@Component
public class RelatorioFactory {

    private final Map<String, RelatorioStrategy> estrategias = new HashMap<>();

    public RelatorioFactory(List<RelatorioStrategy> todasEstrategias) {
        todasEstrategias.forEach(estrategia -> estrategias.put(estrategia.getTipo(), estrategia));
    }

    public RelatorioStrategy criar(String tipo) {
        RelatorioStrategy estrategia = estrategias.get(tipo);
        if (estrategia == null) {
            throw new IllegalArgumentException("Tipo de relatório não encontrado: " + tipo
                    + ". Tipos disponíveis: " + estrategias.keySet());
        }
        return estrategia;
    }

    public Set<String> getTiposDisponiveis() {
        return estrategias.keySet();
    }
}
