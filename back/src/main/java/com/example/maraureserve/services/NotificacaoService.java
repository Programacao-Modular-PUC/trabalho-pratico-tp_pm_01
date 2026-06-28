package com.example.maraureserve.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.maraureserve.dtos.NotificacaoResponse;
import com.example.maraureserve.notifications.GerenciadorNotificacoes;
import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;

@Service
public class NotificacaoService {

    private final GerenciadorNotificacoes gerenciador = GerenciadorNotificacoes.getInstance();

    public List<NotificacaoResponse> listarTodas() {
        return gerenciador.listarHistoricoInterno().stream()
                .map(NotificacaoResponse::fromRegistro)
                .toList();
    }

    public List<NotificacaoResponse> listarPorEvento(TipoEventoNotificacao tipo) {
        return gerenciador.listarPorEvento(tipo).stream()
                .map(NotificacaoResponse::fromRegistro)
                .toList();
    }
}
