package com.example.maraureserve.config;

import java.math.BigDecimal;
import java.time.LocalTime;

/**
 * Singleton que centraliza as regras de negócio e configurações globais do sistema de reservas.
 * Garante que exista uma única instância compartilhada em toda a aplicação,
 * evitando inconsistências caso os parâmetros fossem definidos em múltiplos lugares.
 *
 * Thread-safe via double-checked locking.
 */
public class ConfiguracaoReservas {

    private static volatile ConfiguracaoReservas instancia;

    private final LocalTime horaCheckin;
    private final LocalTime horaCheckout;

    private final int limiteDescontoPequeno;
    private final int limiteDescontoMedio;
    private final int limiteDescontoGrande;

    private final BigDecimal percentualDescontoPequeno;
    private final BigDecimal percentualDescontoMedio;
    private final BigDecimal percentualDescontoGrande;

    private ConfiguracaoReservas() {
        this.horaCheckin = LocalTime.NOON;
        this.horaCheckout = LocalTime.NOON;

        this.limiteDescontoPequeno = 3;
        this.limiteDescontoMedio = 5;
        this.limiteDescontoGrande = 8;

        this.percentualDescontoPequeno = new BigDecimal("0.05");
        this.percentualDescontoMedio = new BigDecimal("0.10");
        this.percentualDescontoGrande = new BigDecimal("0.15");
    }

    public static ConfiguracaoReservas getInstance() {
        if (instancia == null) {
            synchronized (ConfiguracaoReservas.class) {
                if (instancia == null) {
                    instancia = new ConfiguracaoReservas();
                }
            }
        }
        return instancia;
    }

    public LocalTime getHoraCheckin() {
        return horaCheckin;
    }

    public LocalTime getHoraCheckout() {
        return horaCheckout;
    }

    public int getLimiteDescontoPequeno() {
        return limiteDescontoPequeno;
    }

    public int getLimiteDescontoMedio() {
        return limiteDescontoMedio;
    }

    public int getLimiteDescontoGrande() {
        return limiteDescontoGrande;
    }

    public BigDecimal getPercentualDescontoPequeno() {
        return percentualDescontoPequeno;
    }

    public BigDecimal getPercentualDescontoMedio() {
        return percentualDescontoMedio;
    }

    public BigDecimal getPercentualDescontoGrande() {
        return percentualDescontoGrande;
    }
}
