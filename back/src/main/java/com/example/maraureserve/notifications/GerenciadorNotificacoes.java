package com.example.maraureserve.notifications;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

import com.example.maraureserve.notifications.evento.NotificacaoEvento;
import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;
import com.example.maraureserve.notifications.model.MensagemNotificacao;
import com.example.maraureserve.notifications.model.NotificacaoRegistro;
import com.example.maraureserve.notifications.observer.ObservadorNotificacao;
import com.example.maraureserve.notifications.strategy.CanalNotificacao;

/**
 * Singleton central da Central de Notificacoes.
 * Publica eventos para observadores (Observer) e coordena canais (Strategy).
 */
public class GerenciadorNotificacoes {

    private static volatile GerenciadorNotificacoes instancia;

    private final List<ObservadorNotificacao> observadores = new CopyOnWriteArrayList<>();
    private final List<CanalNotificacao> canais = new CopyOnWriteArrayList<>();
    private final List<NotificacaoRegistro> historicoInterno = new CopyOnWriteArrayList<>();
    private final AtomicLong sequenciaId = new AtomicLong(1);

    private GerenciadorNotificacoes() {
    }

    public static GerenciadorNotificacoes getInstance() {
        if (instancia == null) {
            synchronized (GerenciadorNotificacoes.class) {
                if (instancia == null) {
                    instancia = new GerenciadorNotificacoes();
                }
            }
        }
        return instancia;
    }

    static void resetInstance() {
        synchronized (GerenciadorNotificacoes.class) {
            instancia = null;
        }
    }

    public void registrarObservador(ObservadorNotificacao observador) {
        if (observador != null && !observadores.contains(observador)) {
            observadores.add(observador);
        }
    }

    public void registrarCanal(CanalNotificacao canal) {
        if (canal != null && canais.stream().noneMatch(c -> c.getNome().equals(canal.getNome()))) {
            canais.add(canal);
        }
    }

    public List<CanalNotificacao> getCanais() {
        return Collections.unmodifiableList(canais);
    }

    public void publicar(NotificacaoEvento evento) {
        for (ObservadorNotificacao observador : observadores) {
            observador.atualizar(evento);
        }
    }

    public void enviarPorCanais(MensagemNotificacao mensagem) {
        for (CanalNotificacao canal : canais) {
            canal.enviar(mensagem);
        }
    }

    public void registrarNotificacaoInterna(MensagemNotificacao mensagem, String canal) {
        historicoInterno.add(new NotificacaoRegistro(
                sequenciaId.getAndIncrement(),
                mensagem.tipoEvento(),
                mensagem.destinatario(),
                mensagem.titulo(),
                mensagem.conteudo(),
                canal,
                LocalDateTime.now()));
    }

    public List<NotificacaoRegistro> listarHistoricoInterno() {
        return new ArrayList<>(historicoInterno);
    }

    public List<NotificacaoRegistro> listarPorEvento(TipoEventoNotificacao tipo) {
        return historicoInterno.stream()
                .filter(registro -> registro.tipoEvento() == tipo)
                .toList();
    }

    public void limparHistoricoInterno() {
        historicoInterno.clear();
        sequenciaId.set(1);
    }
}
