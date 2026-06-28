package com.example.maraureserve.notifications.observer;

import com.example.maraureserve.notifications.evento.NotificacaoEvento;

public interface ObservadorNotificacao {

    void atualizar(NotificacaoEvento evento);
}
