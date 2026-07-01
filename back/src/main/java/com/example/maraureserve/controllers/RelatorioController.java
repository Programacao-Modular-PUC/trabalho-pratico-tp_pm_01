package com.example.maraureserve.controllers;

import com.example.maraureserve.services.RelatorioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/relatorios")
@Tag(name = "Relatórios", description = "Relatórios gerenciais do sistema de hospedagem")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping
    @Operation(summary = "Lista os tipos de relatório disponíveis")
    public ResponseEntity<Set<String>> tiposDisponiveis() {
        return ResponseEntity.ok(relatorioService.tiposDisponiveis());
    }

    @GetMapping("/faturamento-mensal")
    @Operation(summary = "Faturamento mensal agrupado por mês/ano",
               description = "Parâmetro opcional: ano (ex: 2025)")
    public ResponseEntity<Object> faturamentoMensal(
            @RequestParam(required = false) Integer ano) {
        Map<String, Object> params = new HashMap<>();
        if (ano != null) params.put("ano", ano);
        return ResponseEntity.ok(relatorioService.gerar("FATURAMENTO_MENSAL", params));
    }

    @GetMapping("/taxa-ocupacao")
    @Operation(summary = "Taxa de ocupação por quarto no período",
               description = "Parâmetros opcionais: dataInicio e dataFim (ISO-8601, ex: 2025-01-01T00:00:00). Padrão: últimos 30 dias.")
    public ResponseEntity<Object> taxaOcupacao(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {
        Map<String, Object> params = new HashMap<>();
        if (dataInicio != null) params.put("dataInicio", dataInicio);
        if (dataFim != null) params.put("dataFim", dataFim);
        return ResponseEntity.ok(relatorioService.gerar("TAXA_OCUPACAO", params));
    }

    @GetMapping("/clientes-frequentes")
    @Operation(summary = "Clientes com mais reservas",
               description = "Parâmetro opcional: limite (padrão 10)")
    public ResponseEntity<Object> clientesFrequentes(
            @RequestParam(required = false) Integer limite) {
        Map<String, Object> params = new HashMap<>();
        if (limite != null) params.put("limite", limite);
        return ResponseEntity.ok(relatorioService.gerar("CLIENTES_FREQUENTES", params));
    }

    @GetMapping("/quartos-mais-alugados")
    @Operation(summary = "Quartos com mais aluguéis",
               description = "Parâmetro opcional: limite (padrão 10)")
    public ResponseEntity<Object> quartosMaisAlugados(
            @RequestParam(required = false) Integer limite) {
        Map<String, Object> params = new HashMap<>();
        if (limite != null) params.put("limite", limite);
        return ResponseEntity.ok(relatorioService.gerar("QUARTOS_MAIS_ALUGADOS", params));
    }

    @GetMapping("/receita-por-tipo-quarto")
    @Operation(summary = "Receita total agrupada por tipo de quarto (apenas aluguéis finalizados)")
    public ResponseEntity<Object> receitaPorTipoQuarto() {
        return ResponseEntity.ok(relatorioService.gerar("RECEITA_POR_TIPO_QUARTO", new HashMap<>()));
    }

    @GetMapping("/historico-reservas")
    @Operation(summary = "Histórico de reservas com filtros opcionais",
               description = "Parâmetros opcionais: dataInicio, dataFim (ISO-8601), clienteId, quartoId")
    public ResponseEntity<Object> historicoReservas(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim,
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long quartoId) {
        Map<String, Object> params = new HashMap<>();
        if (dataInicio != null) params.put("dataInicio", dataInicio);
        if (dataFim != null) params.put("dataFim", dataFim);
        if (clienteId != null) params.put("clienteId", clienteId);
        if (quartoId != null) params.put("quartoId", quartoId);
        return ResponseEntity.ok(relatorioService.gerar("HISTORICO_RESERVAS", params));
    }
}
