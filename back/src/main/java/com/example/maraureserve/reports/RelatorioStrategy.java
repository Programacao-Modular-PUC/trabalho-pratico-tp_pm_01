package com.example.maraureserve.reports;

import java.util.Map;

public interface RelatorioStrategy {

    String getTipo();

    Object gerar(Map<String, Object> parametros);
}
