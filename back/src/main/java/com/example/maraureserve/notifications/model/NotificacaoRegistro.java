package com.example.maraureserve.notifications.model;

import java.time.LocalDateTime;

import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;

public record NotificacaoRegistro(
        Long id,
        TipoEventoNotificacao tipoEvento,
        String destinatario,
        String titulo,
        String conteudo,
        String canal,
        LocalDateTime registradaEm) {
}
