package com.example.maraureserve.reports.decorator;

/**
 * Classe base do padrão Decorator para enriquecer a apresentação de relatórios
 * sem alterar as strategies de cálculo.
 */
public abstract class RelatorioDecorator {

    protected final RelatorioResultado resultado;

    protected RelatorioDecorator(RelatorioResultado resultado) {
        this.resultado = resultado;
    }

    public abstract RelatorioResultado decorar();
}
