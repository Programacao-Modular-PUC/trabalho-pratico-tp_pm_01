package com.example.maraureserve.dtos;

import java.time.LocalDateTime;

import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;
import com.example.maraureserve.notifications.model.NotificacaoRegistro;

public record NotificacaoResponse(
        Long id,
        TipoEventoNotificacao tipoEvento,
        String destinatario,
        String titulo,
        String conteudo,
        String canal,
        LocalDateTime registradaEm) {

    public static NotificacaoResponse fromRegistro(NotificacaoRegistro registro) {
        return new NotificacaoResponse(
                registro.id(),
                registro.tipoEvento(),
                registro.destinatario(),
                registro.titulo(),
                registro.conteudo(),
                registro.canal(),
                registro.registradaEm());
    }
}
