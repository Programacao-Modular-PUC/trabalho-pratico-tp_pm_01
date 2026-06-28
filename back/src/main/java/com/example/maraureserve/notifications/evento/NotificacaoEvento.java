package com.example.maraureserve.notifications.evento;

import java.time.LocalDateTime;

import com.example.maraureserve.models.Aluguel;

public class NotificacaoEvento {

    private final TipoEventoNotificacao tipo;
    private final Aluguel aluguel;
    private final LocalDateTime ocorridoEm;

    public NotificacaoEvento(TipoEventoNotificacao tipo, Aluguel aluguel) {
        this.tipo = tipo;
        this.aluguel = aluguel;
        this.ocorridoEm = LocalDateTime.now();
    }

    public TipoEventoNotificacao getTipo() {
        return tipo;
    }

    public Aluguel getAluguel() {
        return aluguel;
    }

    public LocalDateTime getOcorridoEm() {
        return ocorridoEm;
    }
}
