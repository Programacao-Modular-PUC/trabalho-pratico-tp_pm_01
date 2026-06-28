package com.example.maraureserve.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.maraureserve.dtos.NotificacaoResponse;
import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;
import com.example.maraureserve.services.NotificacaoService;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping
    public List<NotificacaoResponse> listar() {
        return notificacaoService.listarTodas();
    }

    @GetMapping("/evento/{tipo}")
    public List<NotificacaoResponse> listarPorEvento(@PathVariable TipoEventoNotificacao tipo) {
        return notificacaoService.listarPorEvento(tipo);
    }
}
