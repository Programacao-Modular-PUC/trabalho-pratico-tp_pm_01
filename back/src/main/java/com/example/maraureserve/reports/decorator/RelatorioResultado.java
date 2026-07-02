package com.example.maraureserve.reports.decorator;

import java.time.LocalDateTime;

/**
 * Estrutura base que encapsula o resultado de um relatório gerencial.
 */
public class RelatorioResultado {

    private final String tipo;
    private String titulo;
    private LocalDateTime geradoEm;
    private final Object dados;

    public RelatorioResultado(String tipo, Object dados) {
        this(tipo, null, null, dados);
    }

    public RelatorioResultado(String tipo, String titulo, LocalDateTime geradoEm, Object dados) {
        this.tipo = tipo;
        this.titulo = titulo;
        this.geradoEm = geradoEm;
        this.dados = dados;
    }

    public String getTipo() {
        return tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public LocalDateTime getGeradoEm() {
        return geradoEm;
    }

    public Object getDados() {
        return dados;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setGeradoEm(LocalDateTime geradoEm) {
        this.geradoEm = geradoEm;
    }
}
