package com.example.maraureserve.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.maraureserve.common.exception.BusinessException;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "aluguel_id", unique = true)
    private Aluguel aluguel;

    private BigDecimal valorTotal;
    private LocalDateTime dataRegistro;
    private LocalDateTime dataProcessamento;
    private LocalDateTime dataConfirmacao;

    @Enumerated(EnumType.STRING)
    private StatusPagamento status = StatusPagamento.PENDENTE;

    public void processar() {
        if (status != StatusPagamento.PENDENTE) {
            throw new BusinessException(
                    "Pagamento so pode ser processado quando esta pendente. Status atual: " + status + ".");
        }
        status = StatusPagamento.EM_PROCESSAMENTO;
        dataProcessamento = LocalDateTime.now();
    }

    public void confirmar() {
        if (status != StatusPagamento.EM_PROCESSAMENTO) {
            throw new BusinessException(
                    "Pagamento so pode ser confirmado apos ser processado. Status atual: " + status + ".");
        }
        status = StatusPagamento.CONFIRMADO;
        dataConfirmacao = LocalDateTime.now();
    }

    public void recusar() {
        if (status != StatusPagamento.EM_PROCESSAMENTO) {
            throw new BusinessException(
                    "Pagamento so pode ser recusado enquanto esta em processamento. Status atual: " + status + ".");
        }
        status = StatusPagamento.RECUSADO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Aluguel getAluguel() {
        return aluguel;
    }

    public void setAluguel(Aluguel aluguel) {
        this.aluguel = aluguel;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDateTime dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public LocalDateTime getDataProcessamento() {
        return dataProcessamento;
    }

    public void setDataProcessamento(LocalDateTime dataProcessamento) {
        this.dataProcessamento = dataProcessamento;
    }

    public LocalDateTime getDataConfirmacao() {
        return dataConfirmacao;
    }

    public void setDataConfirmacao(LocalDateTime dataConfirmacao) {
        this.dataConfirmacao = dataConfirmacao;
    }

    public StatusPagamento getStatus() {
        return status;
    }

    public void setStatus(StatusPagamento status) {
        this.status = status;
    }
}
