package com.example.maraureserve.reports;

import org.springframework.stereotype.Component;

import com.example.maraureserve.reports.command.GerarRelatorioCommand;

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

    private final RelatorioFactory relatorioFactory;

    public GerenciadorRelatorios(RelatorioFactory relatorioFactory) {
        if (instancia != null) {
            throw new IllegalStateException("GerenciadorRelatorios já foi instanciado — use getInstance()");
        }
        this.relatorioFactory = relatorioFactory;
        instancia = this;
    }

    public static GerenciadorRelatorios getInstance() {
        if (instancia == null) {
            throw new IllegalStateException("GerenciadorRelatorios ainda não foi inicializado pelo Spring");
        }
        return instancia;
    }

    public Object executar(GerarRelatorioCommand command) {
        return command.executar(relatorioFactory);
    }

    public Object gerarRelatorio(String tipo, Map<String, Object> parametros) {
        return executar(new GerarRelatorioCommand(tipo, parametros));
    }

    public Set<String> getTiposDisponiveis() {
        return relatorioFactory.getTiposDisponiveis();
    }
}
