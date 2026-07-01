package com.example.maraureserve.services;

import com.example.maraureserve.reports.GerenciadorRelatorios;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class RelatorioService {

    private final GerenciadorRelatorios gerenciador;

    public RelatorioService(GerenciadorRelatorios gerenciador) {
        this.gerenciador = gerenciador;
    }

    public Object gerar(String tipo, Map<String, Object> parametros) {
        return gerenciador.gerarRelatorio(tipo.toUpperCase(), parametros);
    }

    public Set<String> tiposDisponiveis() {
        return gerenciador.getTiposDisponiveis();
    }
}
