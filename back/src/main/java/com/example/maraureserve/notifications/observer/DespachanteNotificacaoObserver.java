package com.example.maraureserve.notifications.observer;

import com.example.maraureserve.notifications.GerenciadorNotificacoes;
import com.example.maraureserve.notifications.evento.NotificacaoEvento;
import com.example.maraureserve.notifications.factory.FabricaMensagensNotificacao;
import com.example.maraureserve.notifications.model.MensagemNotificacao;

/**
 * Observador concreto que reage a eventos e delega o envio aos canais registrados no gerenciador.
 */
public class DespachanteNotificacaoObserver implements ObservadorNotificacao {

    private final GerenciadorNotificacoes gerenciador;
    private final FabricaMensagensNotificacao fabricaMensagens;

    public DespachanteNotificacaoObserver(
            GerenciadorNotificacoes gerenciador,
            FabricaMensagensNotificacao fabricaMensagens) {
        this.gerenciador = gerenciador;
        this.fabricaMensagens = fabricaMensagens;
    }

    @Override
    public void atualizar(NotificacaoEvento evento) {
        for (MensagemNotificacao mensagem : fabricaMensagens.criarMensagens(evento)) {
            gerenciador.enviarPorCanais(mensagem);
        }
    }
}
