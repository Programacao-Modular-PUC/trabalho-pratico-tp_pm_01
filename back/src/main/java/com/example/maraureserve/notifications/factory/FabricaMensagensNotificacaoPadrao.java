package com.example.maraureserve.notifications.factory;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.notifications.evento.NotificacaoEvento;
import com.example.maraureserve.notifications.evento.TipoEventoNotificacao;
import com.example.maraureserve.notifications.model.MensagemNotificacao;

@Component
public class FabricaMensagensNotificacaoPadrao implements FabricaMensagensNotificacao {

    private static final DateTimeFormatter FORMATADOR = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Override
    public List<MensagemNotificacao> criarMensagens(NotificacaoEvento evento) {
        List<MensagemNotificacao> mensagens = new ArrayList<>();
        Aluguel aluguel = evento.getAluguel();
        Cliente cliente = aluguel.getCliente();
        Residencia residencia = aluguel.getResidencia();

        mensagens.add(criarParaCliente(evento.getTipo(), aluguel, cliente));
        mensagens.add(criarParaProprietario(evento.getTipo(), aluguel, residencia));

        return mensagens;
    }

    private MensagemNotificacao criarParaCliente(
            TipoEventoNotificacao tipo,
            Aluguel aluguel,
            Cliente cliente) {
        String titulo = tituloCliente(tipo);
        String conteudo = conteudoComum(tipo, aluguel, "cliente");
        String destinatario = resolverContatoCliente(cliente);

        return new MensagemNotificacao(tipo, destinatario, titulo, conteudo, LocalDateTime.now());
    }

    private MensagemNotificacao criarParaProprietario(
            TipoEventoNotificacao tipo,
            Aluguel aluguel,
            Residencia residencia) {
        String titulo = tituloProprietario(tipo);
        String conteudo = conteudoComum(tipo, aluguel, "proprietario");
        String destinatario = resolverContatoProprietario(residencia);

        return new MensagemNotificacao(tipo, destinatario, titulo, conteudo, LocalDateTime.now());
    }

    private String tituloCliente(TipoEventoNotificacao tipo) {
        return switch (tipo) {
            case RESERVA_CRIADA -> "Reserva confirmada";
            case RESERVA_CANCELADA -> "Reserva cancelada";
            case CHECKIN_REALIZADO -> "Check-in realizado";
            case CHECKOUT_REALIZADO -> "Check-out realizado";
            case PAGAMENTO_CONFIRMADO -> "Pagamento confirmado";
        };
    }

    private String tituloProprietario(TipoEventoNotificacao tipo) {
        return switch (tipo) {
            case RESERVA_CRIADA -> "Nova reserva recebida";
            case RESERVA_CANCELADA -> "Reserva cancelada pelo cliente";
            case CHECKIN_REALIZADO -> "Check-in de hospede";
            case CHECKOUT_REALIZADO -> "Check-out de hospede";
            case PAGAMENTO_CONFIRMADO -> "Pagamento de reserva confirmado";
        };
    }

    private String conteudoComum(TipoEventoNotificacao tipo, Aluguel aluguel, String perfil) {
        String acao = switch (tipo) {
            case RESERVA_CRIADA -> "foi criada";
            case RESERVA_CANCELADA -> "foi cancelada";
            case CHECKIN_REALIZADO -> "teve check-in realizado";
            case CHECKOUT_REALIZADO -> "teve check-out realizado";
            case PAGAMENTO_CONFIRMADO -> "teve pagamento confirmado";
        };

        return String.format(
                "A reserva #%d do quarto %s (%s) %s. Cliente: %s. Periodo: %s ate %s. Valor: R$ %s. Perfil: %s.",
                aluguel.getId(),
                aluguel.getQuarto().getCodigo(),
                aluguel.getResidencia().getEndereco(),
                acao,
                aluguel.getCliente().getNome(),
                aluguel.getDataEntrada().format(FORMATADOR),
                aluguel.getDataSaida().format(FORMATADOR),
                aluguel.getValorFinal(),
                perfil);
    }

    private String resolverContatoCliente(Cliente cliente) {
        if (cliente.getEmail() != null && !cliente.getEmail().isBlank()) {
            return cliente.getEmail();
        }
        if (cliente.getTelefone() != null && !cliente.getTelefone().isBlank()) {
            return cliente.getTelefone();
        }
        return "cliente-" + cliente.getId();
    }

    private String resolverContatoProprietario(Residencia residencia) {
        if (residencia.getEmail() != null && !residencia.getEmail().isBlank()) {
            return residencia.getEmail();
        }
        if (residencia.getTelefone() != null && !residencia.getTelefone().isBlank()) {
            return residencia.getTelefone();
        }
        return "residencia-" + residencia.getId();
    }
}
