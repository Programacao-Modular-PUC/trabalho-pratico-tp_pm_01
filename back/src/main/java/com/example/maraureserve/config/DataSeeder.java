package com.example.maraureserve.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import com.example.maraureserve.models.Aluguel;
import com.example.maraureserve.models.Cliente;
import com.example.maraureserve.models.Pagamento;
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.models.StatusAluguel;
import com.example.maraureserve.models.StatusPagamento;
import com.example.maraureserve.models.TipoCamaCasal;
import com.example.maraureserve.models.TipoQuarto;
import com.example.maraureserve.repositories.AluguelRepository;
import com.example.maraureserve.repositories.ClienteRepository;
import com.example.maraureserve.repositories.PagamentoRepository;
import com.example.maraureserve.repositories.QuartoRepository;
import com.example.maraureserve.repositories.ResidenciaRepository;

@Configuration
public class DataSeeder {

    public static final String HOST_EMAIL = "acessohost@gmail.com";

    @Bean
    CommandLineRunner seedDatabase(
            ClienteRepository clienteRepository,
            ResidenciaRepository residenciaRepository,
            QuartoRepository quartoRepository,
            AluguelRepository aluguelRepository,
            PagamentoRepository pagamentoRepository) {
        return args -> popularDadosIniciais(
                clienteRepository,
                residenciaRepository,
                quartoRepository,
                aluguelRepository,
                pagamentoRepository);
    }

    @Transactional
    void popularDadosIniciais(
            ClienteRepository clienteRepository,
            ResidenciaRepository residenciaRepository,
            QuartoRepository quartoRepository,
            AluguelRepository aluguelRepository,
            PagamentoRepository pagamentoRepository) {
        Cliente visitante = garantirCliente(clienteRepository, cliente(
                "Cliente Visitante",
                "00000000001",
                "Rua das Palmeiras, 100 - Barra Grande",
                "(73) 99999-0101",
                "acessoguest@gmail.com"));
        Cliente mariana = garantirCliente(clienteRepository, cliente(
                "Mariana Costa",
                "12345678901",
                "Avenida Beira Mar, 45 - Taipu de Fora",
                "(73) 99988-1122",
                "mariana.costa@email.com"));
        Cliente rafael = garantirCliente(clienteRepository, cliente(
                "Rafael Almeida",
                "98765432100",
                "Rua do Farol, 22 - Ponta do Muta",
                "(73) 98877-3344",
                "rafael.almeida@email.com"));

        Residencia muta = garantirResidencia(residenciaRepository, residencia(
                "Villa Pontal do Muta",
                "12",
                "Ponta do Muta",
                "45520-000",
                "(73) 3258-1001",
                HOST_EMAIL));
        Residencia cassange = garantirResidencia(residenciaRepository, residencia(
                "Refugio Lagoa do Cassange",
                "87",
                "Cassange",
                "45520-000",
                "(73) 3258-1002",
                HOST_EMAIL));
        Residencia taipu = garantirResidencia(residenciaRepository, residencia(
                "Pousada Taipu Roots",
                "304",
                "Taipu de Fora",
                "45520-000",
                "(73) 3258-1003",
                HOST_EMAIL));

        List<Quarto> quartosSeed = List.of(
                garantirQuarto(quartoRepository, quartoIndividual(muta, "101", "280.00", 1, "45.00", true)),
                garantirQuarto(quartoRepository, quartoCasal(muta, "201", "460.00", TipoCamaCasal.QUEEN, true, true, "80.00", "35.00")),
                garantirQuarto(quartoRepository, quartoFamilia(muta, "301", "780.00", 2, 1, 1, 0, 3, "7.50", true)),
                garantirQuarto(quartoRepository, quartoIndividual(cassange, "C01", "240.00", 2, "50.00", false)),
                garantirQuarto(quartoRepository, quartoCasal(cassange, "C10", "520.00", TipoCamaCasal.KING, true, true, "120.00", "40.00")),
                garantirQuarto(quartoRepository, quartoFamilia(cassange, "C20", "920.00", 3, 1, 0, 1, 4, "6.00", true)),
                garantirQuarto(quartoRepository, quartoIndividual(taipu, "R01", "310.00", 1, "40.00", true)),
                garantirQuarto(quartoRepository, quartoCasal(taipu, "R12", "590.00", TipoCamaCasal.CASAL_PADRAO, true, false, "60.00", "30.00")),
                garantirQuarto(quartoRepository, quartoFamilia(taipu, "R30", "1050.00", 4, 1, 1, 0, 4, "5.00", true)));

        atribuirResidenciasAoHost(residenciaRepository);

        if (aluguelRepository.count() == 0) {
            List<Aluguel> alugueisSalvos = aluguelRepository.saveAll(List.of(
                    // Janeiro — finalizados
                    aluguelFinalizado(mariana,   quartosSeed.get(0), "2025-01-05", "2025-01-08", 1, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(1), "2025-01-10", "2025-01-14", 2, true),
                    aluguelFinalizado(visitante, quartosSeed.get(6), "2025-01-20", "2025-01-25", 1, false),
                    // Fevereiro — finalizados
                    aluguelFinalizado(mariana,   quartosSeed.get(3), "2025-02-03", "2025-02-07", 1, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(7), "2025-02-12", "2025-02-16", 2, false),
                    aluguelFinalizado(visitante, quartosSeed.get(2), "2025-02-18", "2025-02-23", 4, false),
                    // Março — finalizados
                    aluguelFinalizado(mariana,   quartosSeed.get(4), "2025-03-01", "2025-03-05", 2, true),
                    aluguelFinalizado(rafael,    quartosSeed.get(8), "2025-03-10", "2025-03-15", 5, false),
                    aluguelFinalizado(visitante, quartosSeed.get(0), "2025-03-20", "2025-03-22", 1, false),
                    // Abril — finalizados
                    aluguelFinalizado(mariana,   quartosSeed.get(5), "2025-04-02", "2025-04-07", 3, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(1), "2025-04-14", "2025-04-18", 2, true),
                    aluguelFinalizado(visitante, quartosSeed.get(6), "2025-04-22", "2025-04-26", 1, false),
                    // Maio — finalizados
                    aluguelFinalizado(mariana,   quartosSeed.get(2), "2025-05-01", "2025-05-06", 5, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(3), "2025-05-10", "2025-05-13", 1, false),
                    aluguelFinalizado(visitante, quartosSeed.get(7), "2025-05-20", "2025-05-25", 2, false),
                    // Junho — finalizados
                    aluguelFinalizado(mariana,   quartosSeed.get(8), "2025-06-03", "2025-06-08", 4, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(0), "2025-06-15", "2025-06-18", 1, false),
                    // Reservas futuras
                    aluguelReservado(visitante,  quartosSeed.get(4), "2025-08-10", "2025-08-14", 2, true),
                    aluguelReservado(mariana,    quartosSeed.get(5), "2025-08-20", "2025-08-25", 3, false),
                    aluguelReservado(rafael,     quartosSeed.get(2), "2025-09-01", "2025-09-07", 6, false)));
            seedPagamentos(pagamentoRepository, alugueisSalvos);
        }

        if (aluguelRepository.countBySaidaAno(2026) == 0) {
            List<Aluguel> alugueisSalvos2026 = aluguelRepository.saveAll(List.of(
                    // ── Janeiro 2026 — alta temporada (verão) ──────────────────────
                    aluguelFinalizado(rafael,    quartosSeed.get(1), "2026-01-02", "2026-01-07", 2, false),
                    aluguelFinalizado(mariana,   quartosSeed.get(4), "2026-01-04", "2026-01-10", 2, true),
                    aluguelFinalizado(visitante, quartosSeed.get(8), "2026-01-07", "2026-01-14", 5, false),
                    aluguelFinalizado(mariana,   quartosSeed.get(2), "2026-01-14", "2026-01-20", 4, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(5), "2026-01-18", "2026-01-24", 3, false),
                    aluguelFinalizado(visitante, quartosSeed.get(6), "2026-01-24", "2026-01-31", 1, false),
                    // ── Fevereiro 2026 — carnaval ───────────────────────────────────
                    aluguelFinalizado(mariana,   quartosSeed.get(3), "2026-02-01", "2026-02-06", 1, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(7), "2026-02-04", "2026-02-10", 2, false),
                    aluguelFinalizado(visitante, quartosSeed.get(0), "2026-02-10", "2026-02-16", 1, false),
                    aluguelFinalizado(mariana,   quartosSeed.get(5), "2026-02-16", "2026-02-21", 3, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(8), "2026-02-22", "2026-02-28", 4, false),
                    // ── Março 2026 ──────────────────────────────────────────────────
                    aluguelFinalizado(visitante, quartosSeed.get(2), "2026-03-02", "2026-03-07", 3, false),
                    aluguelFinalizado(mariana,   quartosSeed.get(6), "2026-03-09", "2026-03-14", 1, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(1), "2026-03-17", "2026-03-22", 2, false),
                    aluguelFinalizado(visitante, quartosSeed.get(4), "2026-03-24", "2026-03-29", 2, true),
                    // ── Abril 2026 ──────────────────────────────────────────────────
                    aluguelFinalizado(mariana,   quartosSeed.get(0), "2026-04-01", "2026-04-06", 1, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(3), "2026-04-07", "2026-04-12", 1, false),
                    aluguelFinalizado(visitante, quartosSeed.get(7), "2026-04-14", "2026-04-19", 2, false),
                    aluguelFinalizado(mariana,   quartosSeed.get(5), "2026-04-22", "2026-04-28", 3, false),
                    // ── Maio 2026 — baixa temporada ─────────────────────────────────
                    aluguelFinalizado(rafael,    quartosSeed.get(8), "2026-05-03", "2026-05-08", 4, false),
                    aluguelFinalizado(visitante, quartosSeed.get(2), "2026-05-12", "2026-05-17", 3, false),
                    aluguelFinalizado(mariana,   quartosSeed.get(6), "2026-05-20", "2026-05-25", 1, false),
                    // ── Junho 2026 ──────────────────────────────────────────────────
                    aluguelFinalizado(rafael,    quartosSeed.get(0), "2026-06-02", "2026-06-07", 1, false),
                    aluguelFinalizado(visitante, quartosSeed.get(4), "2026-06-08", "2026-06-13", 2, true),
                    aluguelFinalizado(mariana,   quartosSeed.get(1), "2026-06-14", "2026-06-20", 2, false),
                    aluguelFinalizado(rafael,    quartosSeed.get(7), "2026-06-22", "2026-06-27", 2, false),
                    // ── Julho 2026 — em andamento (check-in já realizado) ───────────
                    aluguelEmAndamento(mariana,   quartosSeed.get(3), "2026-06-29", "2026-07-04", 1, false),
                    aluguelEmAndamento(visitante, quartosSeed.get(8), "2026-06-30", "2026-07-06", 5, false),
                    // ── Julho 2026 — reservas confirmadas ───────────────────────────
                    aluguelReservado(rafael,     quartosSeed.get(5), "2026-07-05", "2026-07-11", 3, false),
                    aluguelReservado(mariana,    quartosSeed.get(2), "2026-07-10", "2026-07-17", 4, false),
                    aluguelReservado(visitante,  quartosSeed.get(6), "2026-07-18", "2026-07-24", 1, false),
                    aluguelReservado(rafael,     quartosSeed.get(4), "2026-07-24", "2026-07-31", 2, true)));
            seedPagamentos(pagamentoRepository, alugueisSalvos2026);
        }
    }

    private void seedPagamentos(PagamentoRepository pagamentoRepository, List<Aluguel> alugueis) {
        pagamentoRepository.saveAll(alugueis.stream().map(this::criarPagamentoParaAluguel).toList());
    }

    private Pagamento criarPagamentoParaAluguel(Aluguel aluguel) {
        Pagamento pagamento = new Pagamento();
        pagamento.setAluguel(aluguel);
        pagamento.setValorTotal(aluguel.getValorFinal());
        pagamento.setDataRegistro(aluguel.getDataEntrada().minusDays(1));

        if (aluguel.getStatus() == StatusAluguel.RESERVADA) {
            pagamento.setStatus(StatusPagamento.PENDENTE);
        } else {
            pagamento.setStatus(StatusPagamento.CONFIRMADO);
            pagamento.setDataProcessamento(aluguel.getDataEntrada().minusHours(12));
            pagamento.setDataConfirmacao(aluguel.getDataEntrada().minusHours(6));
        }
        return pagamento;
    }

    private Cliente garantirCliente(ClienteRepository repository, Cliente seed) {
        return repository.findByCpf(seed.getCpf())
                .orElseGet(() -> repository.save(seed));
    }

    private Residencia garantirResidencia(ResidenciaRepository repository, Residencia seed) {
        return repository.findAll().stream()
                .filter(residencia -> seed.getEndereco().equalsIgnoreCase(residencia.getEndereco()))
                .filter(residencia -> seed.getNumero().equalsIgnoreCase(residencia.getNumero()))
                .findFirst()
                .map(existing -> {
                    existing.setEmail(HOST_EMAIL);
                    existing.setTelefone(seed.getTelefone());
                    return repository.save(existing);
                })
                .orElseGet(() -> repository.save(seed));
    }

    private void atribuirResidenciasAoHost(ResidenciaRepository repository) {
        repository.findAll().forEach(residencia -> {
            if (!HOST_EMAIL.equalsIgnoreCase(residencia.getEmail())) {
                residencia.setEmail(HOST_EMAIL);
                repository.save(residencia);
            }
        });
    }

    private Quarto garantirQuarto(QuartoRepository repository, Quarto seed) {
        return repository.findAll().stream()
                .filter(quarto -> seed.getCodigo().equalsIgnoreCase(quarto.getCodigo()))
                .filter(quarto -> quarto.getResidencia().getId().equals(seed.getResidencia().getId()))
                .findFirst()
                .orElseGet(() -> repository.save(seed));
    }

    private Cliente cliente(String nome, String cpf, String endereco, String telefone, String email) {
        Cliente cliente = new Cliente();
        cliente.setNome(nome);
        cliente.setCpf(cpf);
        cliente.setEndereco(endereco);
        cliente.setTelefone(telefone);
        cliente.setEmail(email);
        return cliente;
    }

    private Residencia residencia(String endereco, String numero, String bairro, String cep, String telefone, String email) {
        Residencia residencia = new Residencia();
        residencia.setEndereco(endereco);
        residencia.setNumero(numero);
        residencia.setBairro(bairro);
        residencia.setCep(cep);
        residencia.setTelefone(telefone);
        residencia.setEmail(email);
        return residencia;
    }

    private Quarto quartoIndividual(
            Residencia residencia,
            String codigo,
            String valorBase,
            int camasSolteiro,
            String adicionalCama,
            boolean arCondicionado) {
        Quarto quarto = quartoBase(residencia, codigo, TipoQuarto.INDIVIDUAL, valorBase, arCondicionado, false);
        quarto.setQuantidadeCamasSolteiro(camasSolteiro);
        quarto.setCapacidadeMaxima(camasSolteiro);
        quarto.setValorAdicionalPorCamaSolteiro(valor(adicionalCama));
        quarto.setPermiteBerco(false);
        return quarto;
    }

    private Quarto quartoCasal(
            Residencia residencia,
            String codigo,
            String valorBase,
            TipoCamaCasal tipoCama,
            boolean arCondicionado,
            boolean hidromassagem,
            String adicionalCama,
            String taxaBerco) {
        Quarto quarto = quartoBase(residencia, codigo, TipoQuarto.CASAL, valorBase, arCondicionado, hidromassagem);
        quarto.setCapacidadeMaxima(2);
        quarto.setQuantidadeCamasCasal(TipoCamaCasal.CASAL_PADRAO.equals(tipoCama) ? 1 : 0);
        quarto.setQuantidadeCamasQueen(TipoCamaCasal.QUEEN.equals(tipoCama) ? 1 : 0);
        quarto.setQuantidadeCamasKing(TipoCamaCasal.KING.equals(tipoCama) ? 1 : 0);
        quarto.setTipoCamaCasal(tipoCama);
        quarto.setValorAdicionalCamaCasal(valor(adicionalCama));
        quarto.setValorAdicionalCamaQueenKing(valor(adicionalCama));
        quarto.setTaxaBerco(valor(taxaBerco));
        quarto.setPermiteBerco(true);
        return quarto;
    }

    private Quarto quartoFamilia(
            Residencia residencia,
            String codigo,
            String valorBase,
            int camasSolteiro,
            int camasCasal,
            int camasQueen,
            int camasKing,
            int ambientes,
            String percentualHospede,
            boolean arCondicionado) {
        Quarto quarto = quartoBase(residencia, codigo, TipoQuarto.FAMILIA, valorBase, arCondicionado, true);
        quarto.setQuantidadeCamasSolteiro(camasSolteiro);
        quarto.setQuantidadeCamasCasal(camasCasal);
        quarto.setQuantidadeCamasQueen(camasQueen);
        quarto.setQuantidadeCamasKing(camasKing);
        quarto.setQuantidadeAmbientes(ambientes);
        quarto.setCapacidadeMaxima(quarto.calcularCapacidadeMaxima());
        quarto.setPercentualAdicionalPorHospede(valor(percentualHospede));
        quarto.setPermiteBerco(false);
        return quarto;
    }

    private Quarto quartoBase(
            Residencia residencia,
            String codigo,
            TipoQuarto tipo,
            String valorBase,
            boolean arCondicionado,
            boolean hidromassagem) {
        Quarto quarto = new Quarto();
        quarto.setResidencia(residencia);
        quarto.setCodigo(codigo);
        quarto.setTipo(tipo);
        quarto.setValorBase(valor(valorBase));
        quarto.setPossuiArCondicionado(arCondicionado);
        quarto.setPossuiHidromassagem(hidromassagem);
        quarto.setQuantidadeCamasSolteiro(0);
        quarto.setQuantidadeCamasCasal(0);
        quarto.setQuantidadeCamasQueen(0);
        quarto.setQuantidadeCamasKing(0);
        quarto.setQuantidadeAmbientes(1);
        quarto.setValorAdicionalPorCamaSolteiro(BigDecimal.ZERO);
        quarto.setValorAdicionalCamaCasal(BigDecimal.ZERO);
        quarto.setValorAdicionalCamaQueenKing(BigDecimal.ZERO);
        quarto.setTaxaBerco(BigDecimal.ZERO);
        quarto.setPercentualAdicionalPorHospede(BigDecimal.ZERO);
        quarto.setPermiteBerco(false);
        return quarto;
    }

    private Aluguel aluguelFinalizado(Cliente cliente, Quarto quarto, String entrada, String saida, int hospedes, boolean berco) {
        Aluguel a = aluguelBase(cliente, quarto, LocalDate.parse(entrada), LocalDate.parse(saida), hospedes, berco);
        a.setStatus(com.example.maraureserve.models.StatusAluguel.FINALIZADA);
        return a;
    }

    private Aluguel aluguelEmAndamento(Cliente cliente, Quarto quarto, String entrada, String saida, int hospedes, boolean berco) {
        Aluguel a = aluguelBase(cliente, quarto, LocalDate.parse(entrada), LocalDate.parse(saida), hospedes, berco);
        a.setStatus(com.example.maraureserve.models.StatusAluguel.EM_ANDAMENTO);
        return a;
    }

    private Aluguel aluguelReservado(Cliente cliente, Quarto quarto, String entrada, String saida, int hospedes, boolean berco) {
        Aluguel a = aluguelBase(cliente, quarto, LocalDate.parse(entrada), LocalDate.parse(saida), hospedes, berco);
        a.setStatus(com.example.maraureserve.models.StatusAluguel.RESERVADA);
        return a;
    }

    private Aluguel aluguelBase(Cliente cliente, Quarto quarto, LocalDate entrada, LocalDate saida, int hospedes, boolean berco) {
        Aluguel aluguel = new Aluguel();
        aluguel.setCliente(cliente);
        aluguel.setQuarto(quarto);
        aluguel.setResidencia(quarto.getResidencia());
        aluguel.setDataEntrada(LocalDateTime.of(entrada, LocalTime.of(14, 0)));
        aluguel.setDataSaida(LocalDateTime.of(saida, LocalTime.of(12, 0)));
        aluguel.setQuantidadeHospedes(hospedes);
        aluguel.setQuantidadeDiarias(Math.max(1, (int) (saida.toEpochDay() - entrada.toEpochDay())));
        aluguel.setBercoSolicitado(berco && Boolean.TRUE.equals(quarto.getPermiteBerco()));
        aluguel.setValorDiaria(quarto.calcularValorDiaria(hospedes, aluguel.getBercoSolicitado()));
        aluguel.setValorFinal(aluguel.getValorDiaria().multiply(BigDecimal.valueOf(aluguel.getQuantidadeDiarias())));
        return aluguel;
    }

    private BigDecimal valor(String valor) {
        return new BigDecimal(valor);
    }
}
