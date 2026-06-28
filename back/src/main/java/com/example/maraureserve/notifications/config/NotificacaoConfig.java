package com.example.maraureserve.notifications.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;

import com.example.maraureserve.notifications.GerenciadorNotificacoes;
import com.example.maraureserve.notifications.factory.FabricaMensagensNotificacao;
import com.example.maraureserve.notifications.observer.DespachanteNotificacaoObserver;
import com.example.maraureserve.notifications.strategy.CanalNotificacao;

import jakarta.annotation.PostConstruct;

@Configuration
public class NotificacaoConfig {

    private final List<CanalNotificacao> canaisDisponiveis;
    private final FabricaMensagensNotificacao fabricaMensagens;

    public NotificacaoConfig(
            List<CanalNotificacao> canaisDisponiveis,
            FabricaMensagensNotificacao fabricaMensagens) {
        this.canaisDisponiveis = canaisDisponiveis;
        this.fabricaMensagens = fabricaMensagens;
    }

    @PostConstruct
    void inicializarCentralNotificacoes() {
        GerenciadorNotificacoes gerenciador = GerenciadorNotificacoes.getInstance();

        canaisDisponiveis.forEach(gerenciador::registrarCanal);
        gerenciador.registrarObservador(new DespachanteNotificacaoObserver(gerenciador, fabricaMensagens));
    }
}
