package com.example.maraureserve.notifications.strategy;

import org.springframework.stereotype.Component;

import com.example.maraureserve.notifications.GerenciadorNotificacoes;
import com.example.maraureserve.notifications.model.MensagemNotificacao;

@Component
public class NotificacaoInternaCanal implements CanalNotificacao {

    private final GerenciadorNotificacoes gerenciador = GerenciadorNotificacoes.getInstance();

    @Override
    public String getNome() {
        return "INTERNA";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        gerenciador.registrarNotificacaoInterna(mensagem, getNome());
    }
}
