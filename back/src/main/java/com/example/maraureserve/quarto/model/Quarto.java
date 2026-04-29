package com.example.maraureserve.quarto.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.example.maraureserve.aluguel.model.Aluguel;
import com.example.maraureserve.residencia.model.Residencia;

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
}
