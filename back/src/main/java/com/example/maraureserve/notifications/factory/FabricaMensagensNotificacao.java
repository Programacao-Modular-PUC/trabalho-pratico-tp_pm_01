package com.example.maraureserve.notifications.factory;

import java.util.List;

import com.example.maraureserve.notifications.evento.NotificacaoEvento;
import com.example.maraureserve.notifications.model.MensagemNotificacao;

public interface FabricaMensagensNotificacao {

    List<MensagemNotificacao> criarMensagens(NotificacaoEvento evento);
}
