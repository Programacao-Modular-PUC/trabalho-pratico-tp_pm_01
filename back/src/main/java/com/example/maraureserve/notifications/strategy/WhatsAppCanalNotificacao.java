package com.example.maraureserve.notifications.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.example.maraureserve.notifications.model.MensagemNotificacao;

@Component
public class WhatsAppCanalNotificacao implements CanalNotificacao {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppCanalNotificacao.class);

    @Override
    public String getNome() {
        return "WHATSAPP";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        log.info("[WHATSAPP] Para: {} | {}", mensagem.destinatario(), mensagem.conteudo());
    }
}
