package com.example.maraureserve.reports.decorator;

import java.time.LocalDateTime;

/**
 * Decorator que adiciona cabeçalho (título e data de geração) ao resultado base.
 */
public class CabecalhoRelatorioDecorator extends RelatorioDecorator {

    public CabecalhoRelatorioDecorator(RelatorioResultado resultado) {
        super(resultado);
    }

    @Override
    public RelatorioResultado decorar() {
        RelatorioResultado enriquecido = new RelatorioResultado(
                resultado.getTipo(),
                resultado.getTitulo(),
                resultado.getGeradoEm(),
                resultado.getDados());
        enriquecido.setTitulo(tituloPorTipo(resultado.getTipo()));
        enriquecido.setGeradoEm(LocalDateTime.now());
        return enriquecido;
    }

    private String tituloPorTipo(String tipo) {
        return switch (tipo) {
            case "FATURAMENTO_MENSAL" -> "Faturamento Mensal";
            case "TAXA_OCUPACAO" -> "Taxa de Ocupação";
            case "CLIENTES_FREQUENTES" -> "Clientes Mais Frequentes";
            case "QUARTOS_MAIS_ALUGADOS" -> "Quartos Mais Alugados";
            case "RECEITA_POR_TIPO_QUARTO" -> "Receita por Tipo de Quarto";
            case "HISTORICO_RESERVAS" -> "Histórico de Reservas";
            default -> "Relatório Gerencial";
        };
    }
}
