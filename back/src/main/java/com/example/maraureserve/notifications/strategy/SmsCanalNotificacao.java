package com.example.maraureserve.notifications.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.example.maraureserve.notifications.model.MensagemNotificacao;

@Component
public class SmsCanalNotificacao implements CanalNotificacao {

    private static final Logger log = LoggerFactory.getLogger(SmsCanalNotificacao.class);

    @Override
    public String getNome() {
        return "SMS";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        log.info("[SMS] Para: {} | {}", mensagem.destinatario(), mensagem.conteudo());
    }
}
