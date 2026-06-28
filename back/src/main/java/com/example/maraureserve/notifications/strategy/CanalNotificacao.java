package com.example.maraureserve.notifications.strategy;

import com.example.maraureserve.notifications.model.MensagemNotificacao;

public interface CanalNotificacao {

    String getNome();

    void enviar(MensagemNotificacao mensagem);
}
