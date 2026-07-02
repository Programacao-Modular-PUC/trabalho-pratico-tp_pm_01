package com.example.maraureserve.services;

import com.example.maraureserve.reports.GerenciadorRelatorios;
import com.example.maraureserve.reports.command.GerarRelatorioCommand;
import com.example.maraureserve.reports.decorator.RelatorioResultado;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class RelatorioService {

    private final GerenciadorRelatorios gerenciador;

    public RelatorioService(GerenciadorRelatorios gerenciador) {
        this.gerenciador = gerenciador;
    }

    public RelatorioResultado gerar(String tipo, Map<String, Object> parametros) {
        GerarRelatorioCommand command = new GerarRelatorioCommand(tipo, parametros);
        return gerenciador.executar(command);
    }

    public Set<String> tiposDisponiveis() {
        return gerenciador.getTiposDisponiveis();
    }
}
