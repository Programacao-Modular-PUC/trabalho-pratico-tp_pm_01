package com.example.maraureserve.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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
    public List<AluguelResponse> listar() {
        return aluguelService.listar();
    }

    @GetMapping("/{id}")
    public AluguelResponse buscarPorId(@PathVariable Long id) {
        return aluguelService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<AluguelResponse> criar(@Valid @RequestBody AluguelRequest request) {
        AluguelResponse response = aluguelService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public AluguelResponse atualizar(@PathVariable Long id, @Valid @RequestBody AluguelRequest request) {
        return aluguelService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        aluguelService.cancelar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        aluguelService.cancelar(id);
        return ResponseEntity.noContent().build();
    }
}
