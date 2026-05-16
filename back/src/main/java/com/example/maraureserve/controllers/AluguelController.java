package com.example.maraureserve.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.maraureserve.dtos.AluguelRequest;
import com.example.maraureserve.dtos.AluguelResponse;
import com.example.maraureserve.services.AluguelService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/alugueis")
public class AluguelController {

    private final AluguelService aluguelService;

    public AluguelController(AluguelService aluguelService) {
        this.aluguelService = aluguelService;
    }

    @GetMapping
    public ResponseEntity<List<AluguelResponse>> listar() {
        return ResponseEntity.ok(aluguelService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AluguelResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(aluguelService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AluguelResponse> criar(@RequestBody @Valid AluguelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aluguelService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AluguelResponse> atualizar(@PathVariable Long id, @RequestBody @Valid AluguelRequest request) {
        return ResponseEntity.ok(aluguelService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        aluguelService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}