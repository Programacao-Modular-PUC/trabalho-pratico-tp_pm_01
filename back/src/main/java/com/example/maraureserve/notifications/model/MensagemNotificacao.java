package com.example.maraureserve.notifications.model;

import java.time.LocalDateTime;

import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;

public record MensagemNotificacao(
        TipoEventoNotificacao tipoEvento,
        String destinatario,
        String titulo,
        String conteudo,
        LocalDateTime enviadaEm) {
}
