package com.example.maraureserve.residencia.controller;

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

import com.example.maraureserve.residencia.dto.ResidenciaRequest;
import com.example.maraureserve.residencia.dto.ResidenciaResponse;
import com.example.maraureserve.residencia.service.ResidenciaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/residencias")
public class ResidenciaController {

    private final ResidenciaService residenciaService;

    public ResidenciaController(ResidenciaService residenciaService) {
        this.residenciaService = residenciaService;
    }

    @GetMapping
    public List<ResidenciaResponse> listar() {
        return residenciaService.listar();
    }

    @GetMapping("/{id}")
    public ResidenciaResponse buscarPorId(@PathVariable Long id) {
        return residenciaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<ResidenciaResponse> criar(@Valid @RequestBody ResidenciaRequest request) {
        ResidenciaResponse response = residenciaService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public ResidenciaResponse atualizar(@PathVariable Long id, @Valid @RequestBody ResidenciaRequest request) {
        return residenciaService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        residenciaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
