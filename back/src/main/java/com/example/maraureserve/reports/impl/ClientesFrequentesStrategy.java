package com.example.maraureserve.reports.impl;

import com.example.maraureserve.dtos.relatorios.ClienteFrequenteDTO;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.reports.RelatorioStrategy;
import com.example.maraureserve.repositories.AluguelRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ClientesFrequentesStrategy implements RelatorioStrategy {

    private final AluguelRepository aluguelRepository;

    public ClientesFrequentesStrategy(AluguelRepository aluguelRepository) {
        this.aluguelRepository = aluguelRepository;
    }

    @Override
    public String getTipo() {
        return "CLIENTES_FREQUENTES";
    }

    @Override
    public Object gerar(Map<String, Object> parametros) {
        int limite = parametros.containsKey("limite")
                ? Integer.parseInt(parametros.get("limite").toString())
                : 10;

        List<Object[]> resultados = aluguelRepository.buscarClientesFrequentes(PageRequest.of(0, limite));

        return resultados.stream().map(r -> {
            Cliente cliente = (Cliente) r[0];
            long totalReservas = ((Number) r[1]).longValue();
            BigDecimal totalGasto = r[2] != null ? (BigDecimal) r[2] : BigDecimal.ZERO;
            return new ClienteFrequenteDTO(
                    cliente.getId(),
                    cliente.getNome(),
                    cliente.getCpf(),
                    totalReservas,
                    totalGasto);
        }).collect(Collectors.toList());
    }
}
