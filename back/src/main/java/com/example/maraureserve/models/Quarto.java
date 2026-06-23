package com.example.maraureserve.models;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import com.example.maraureserve.config.ConfiguracaoReservas;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "quartos")
public class Quarto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;

    @Enumerated(EnumType.STRING)
    private TipoQuarto tipo;

    private BigDecimal valorBase;
    private Boolean possuiArCondicionado;
    private Boolean possuiHidromassagem;
    private Integer capacidadeMaxima;
    private Integer quantidadeCamasSolteiro;
    private Integer quantidadeCamasCasal;
    private Integer quantidadeCamasQueen;
    private Integer quantidadeCamasKing;
    private Integer quantidadeAmbientes;
    private BigDecimal valorAdicionalPorCamaSolteiro;
    private BigDecimal valorAdicionalCamaCasal;
    private BigDecimal valorAdicionalCamaQueenKing;
    private BigDecimal taxaBerco;
    private BigDecimal percentualAdicionalPorHospede;
    private Boolean permiteBerco;

    @Enumerated(EnumType.STRING)
    private TipoCamaCasal tipoCamaCasal;

    @ManyToOne(optional = false)
    @JoinColumn(name = "residencia_id")
    private Residencia residencia;

    @OneToMany(mappedBy = "quarto")
    private List<Aluguel> alugueis = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public TipoQuarto getTipo() {
        return tipo;
    }

    public void setTipo(TipoQuarto tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getValorBase() {
        return valorBase;
    }

    public void setValorBase(BigDecimal valorBase) {
        this.valorBase = valorBase;
    }

    public Boolean getPossuiArCondicionado() {
        return possuiArCondicionado;
    }

    public void setPossuiArCondicionado(Boolean possuiArCondicionado) {
        this.possuiArCondicionado = possuiArCondicionado;
    }

    public Boolean getPossuiHidromassagem() {
        return possuiHidromassagem;
    }

    public void setPossuiHidromassagem(Boolean possuiHidromassagem) {
        this.possuiHidromassagem = possuiHidromassagem;
    }

    public Integer getCapacidadeMaxima() {
        return capacidadeMaxima;
    }

    public void setCapacidadeMaxima(Integer capacidadeMaxima) {
        this.capacidadeMaxima = capacidadeMaxima;
    }

    public Integer getQuantidadeCamasSolteiro() {
        return quantidadeCamasSolteiro;
    }

    public void setQuantidadeCamasSolteiro(Integer quantidadeCamasSolteiro) {
        this.quantidadeCamasSolteiro = quantidadeCamasSolteiro;
    }

    public Integer getQuantidadeCamasCasal() {
        return quantidadeCamasCasal;
    }

    public void setQuantidadeCamasCasal(Integer quantidadeCamasCasal) {
        this.quantidadeCamasCasal = quantidadeCamasCasal;
    }

    public Integer getQuantidadeCamasQueen() {
        return quantidadeCamasQueen;
    }

    public void setQuantidadeCamasQueen(Integer quantidadeCamasQueen) {
        this.quantidadeCamasQueen = quantidadeCamasQueen;
    }

    public Integer getQuantidadeCamasKing() {
        return quantidadeCamasKing;
    }

    public void setQuantidadeCamasKing(Integer quantidadeCamasKing) {
        this.quantidadeCamasKing = quantidadeCamasKing;
    }

    public Integer getQuantidadeAmbientes() {
        return quantidadeAmbientes;
    }

    public void setQuantidadeAmbientes(Integer quantidadeAmbientes) {
        this.quantidadeAmbientes = quantidadeAmbientes;
    }

    public BigDecimal getValorAdicionalPorCamaSolteiro() {
        return valorAdicionalPorCamaSolteiro;
    }

    public void setValorAdicionalPorCamaSolteiro(BigDecimal valorAdicionalPorCamaSolteiro) {
        this.valorAdicionalPorCamaSolteiro = valorAdicionalPorCamaSolteiro;
    }

    public BigDecimal getValorAdicionalCamaCasal() {
        return valorAdicionalCamaCasal;
    }

    public void setValorAdicionalCamaCasal(BigDecimal valorAdicionalCamaCasal) {
        this.valorAdicionalCamaCasal = valorAdicionalCamaCasal;
    }

    public BigDecimal getValorAdicionalCamaQueenKing() {
        return valorAdicionalCamaQueenKing;
    }

    public void setValorAdicionalCamaQueenKing(BigDecimal valorAdicionalCamaQueenKing) {
        this.valorAdicionalCamaQueenKing = valorAdicionalCamaQueenKing;
    }

    public BigDecimal getTaxaBerco() {
        return taxaBerco;
    }

    public void setTaxaBerco(BigDecimal taxaBerco) {
        this.taxaBerco = taxaBerco;
    }

    public BigDecimal getPercentualAdicionalPorHospede() {
        return percentualAdicionalPorHospede;
    }

    public void setPercentualAdicionalPorHospede(BigDecimal percentualAdicionalPorHospede) {
        this.percentualAdicionalPorHospede = percentualAdicionalPorHospede;
    }

    public Boolean getPermiteBerco() {
        return permiteBerco;
    }

    public void setPermiteBerco(Boolean permiteBerco) {
        this.permiteBerco = permiteBerco;
    }

    public TipoCamaCasal getTipoCamaCasal() {
        return tipoCamaCasal;
    }

    public void setTipoCamaCasal(TipoCamaCasal tipoCamaCasal) {
        this.tipoCamaCasal = tipoCamaCasal;
    }

    public Residencia getResidencia() {
        return residencia;
    }

    public void setResidencia(Residencia residencia) {
        this.residencia = residencia;
    }

    public List<Aluguel> getAlugueis() {
        return alugueis;
    }

    public void setAlugueis(List<Aluguel> alugueis) {
        this.alugueis = alugueis;
    }

    public BigDecimal calcularValorDiaria(Integer quantidadeHospedes, Boolean bercoSolicitado) {
        if (TipoQuarto.INDIVIDUAL.equals(tipo)) {
            return calcularDiariaIndividual();
        }

        if (TipoQuarto.DUPLO.equals(tipo) || TipoQuarto.CASAL.equals(tipo)) {
            return calcularDiariaDuplo(bercoSolicitado);
        }

        if (TipoQuarto.FAMILIA.equals(tipo)) {
            return calcularDiariaFamilia(quantidadeHospedes);
        }

        return valorOuZero(valorBase);
    }

    public Integer calcularCapacidadeMaxima() {
        if (TipoQuarto.INDIVIDUAL.equals(tipo)) {
            return inteiroOuZero(quantidadeCamasSolteiro);
        }

        if (TipoQuarto.DUPLO.equals(tipo) || TipoQuarto.CASAL.equals(tipo)) {
            return 2;
        }

        if (TipoQuarto.FAMILIA.equals(tipo)) {
            return inteiroOuZero(quantidadeCamasSolteiro)
                    + (inteiroOuZero(quantidadeCamasCasal) * 2)
                    + (inteiroOuZero(quantidadeCamasQueen) * 2)
                    + (inteiroOuZero(quantidadeCamasKing) * 2);
        }

        return capacidadeMaxima;
    }

    private BigDecimal calcularDiariaIndividual() {
        int camas = inteiroOuZero(quantidadeCamasSolteiro);
        int camasAdicionais = Math.max(0, camas - 1);
        return valorOuZero(valorBase).add(
                valorOuZero(valorAdicionalPorCamaSolteiro).multiply(BigDecimal.valueOf(camasAdicionais)));
    }

    private BigDecimal calcularDiariaDuplo(Boolean bercoSolicitado) {
        BigDecimal total = valorOuZero(valorBase);

        if (TipoCamaCasal.CASAL_PADRAO.equals(tipoCamaCasal)) {
            total = total.add(valorOuZero(valorAdicionalCamaCasal));
        } else if (TipoCamaCasal.QUEEN.equals(tipoCamaCasal) || TipoCamaCasal.KING.equals(tipoCamaCasal)) {
            total = total.add(valorOuZero(valorAdicionalCamaQueenKing));
        }

        if (Boolean.TRUE.equals(bercoSolicitado)) {
            total = total.add(valorOuZero(taxaBerco));
        }

        return total;
    }

    private BigDecimal calcularDiariaFamilia(Integer quantidadeHospedes) {
        BigDecimal hospedes = BigDecimal.valueOf(Math.max(1, inteiroOuZero(quantidadeHospedes)));
        BigDecimal percentual = valorOuZero(percentualAdicionalPorHospede);
        BigDecimal adicional = valorOuZero(valorBase)
                .multiply(percentual)
                .multiply(hospedes)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        return valorOuZero(valorBase)
                .add(adicional)
                .multiply(BigDecimal.ONE.subtract(percentualDescontoGrupo(quantidadeHospedes)))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal percentualDescontoGrupo(Integer quantidadeHospedes) {
        ConfiguracaoReservas config = ConfiguracaoReservas.getInstance();
        int hospedes = inteiroOuZero(quantidadeHospedes);
        if (hospedes >= config.getLimiteDescontoGrande()) {
            return config.getPercentualDescontoGrande();
        }
        if (hospedes >= config.getLimiteDescontoMedio()) {
            return config.getPercentualDescontoMedio();
        }
        if (hospedes >= config.getLimiteDescontoPequeno()) {
            return config.getPercentualDescontoPequeno();
        }
        return BigDecimal.ZERO;
    }

    private int inteiroOuZero(Integer valor) {
        return valor == null ? 0 : valor;
    }

    private BigDecimal valorOuZero(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO : valor;
    }
}
