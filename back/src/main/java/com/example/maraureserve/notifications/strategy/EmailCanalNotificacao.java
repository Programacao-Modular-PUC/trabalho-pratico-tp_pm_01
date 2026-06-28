package com.example.maraureserve.notifications.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.example.maraureserve.notifications.model.MensagemNotificacao;

@Component
public class EmailCanalNotificacao implements CanalNotificacao {

    private static final Logger log = LoggerFactory.getLogger(EmailCanalNotificacao.class);

    @Override
    public String getNome() {
        return "EMAIL";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        log.info("[EMAIL] Para: {} | Assunto: {} | {}", mensagem.destinatario(), mensagem.titulo(), mensagem.conteudo());
    }
}
