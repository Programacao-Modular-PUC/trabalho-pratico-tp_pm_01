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
import com.example.maraureserve.models.Quarto;
import com.example.maraureserve.models.Residencia;
import com.example.maraureserve.models.TipoCamaCasal;
import com.example.maraureserve.models.TipoQuarto;
import com.example.maraureserve.repositories.AluguelRepository;
import com.example.maraureserve.repositories.ClienteRepository;
import com.example.maraureserve.repositories.QuartoRepository;
import com.example.maraureserve.repositories.ResidenciaRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(
            ClienteRepository clienteRepository,
            ResidenciaRepository residenciaRepository,
            QuartoRepository quartoRepository,
            AluguelRepository aluguelRepository) {
        return args -> popularDadosIniciais(
                clienteRepository,
                residenciaRepository,
                quartoRepository,
                aluguelRepository);
    }

    @Transactional
    void popularDadosIniciais(
            ClienteRepository clienteRepository,
            ResidenciaRepository residenciaRepository,
            QuartoRepository quartoRepository,
            AluguelRepository aluguelRepository) {
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
                "reservas@villamuta.com"));
        Residencia cassange = garantirResidencia(residenciaRepository, residencia(
                "Refugio Lagoa do Cassange",
                "87",
                "Cassange",
                "45520-000",
                "(73) 3258-1002",
                "contato@refugiocassange.com"));
        Residencia taipu = garantirResidencia(residenciaRepository, residencia(
                "Pousada Taipu Roots",
                "304",
                "Taipu de Fora",
                "45520-000",
                "(73) 3258-1003",
                "ola@taipuroots.com"));

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

        List<Cliente> clientes = List.of(visitante, mariana, rafael);

        if (aluguelRepository.count() == 0) {
            LocalDate hoje = LocalDate.now();
            aluguelRepository.saveAll(List.of(
                    aluguel(clientes.get(1), quartosSeed.get(2), hoje.plusDays(3), hoje.plusDays(7), 5, false),
                    aluguel(clientes.get(2), quartosSeed.get(4), hoje.plusDays(9), hoje.plusDays(12), 2, true),
                    aluguel(clientes.get(0), quartosSeed.get(5), hoje.plusDays(15), hoje.plusDays(20), 6, false)));
        }
    }

    private Cliente garantirCliente(ClienteRepository repository, Cliente seed) {
        return repository.findByCpf(seed.getCpf())
                .orElseGet(() -> repository.save(seed));
    }

    private Residencia garantirResidencia(ResidenciaRepository repository, Residencia seed) {
        return repository.findAll().stream()
                .filter(residencia -> seed.getEmail().equalsIgnoreCase(residencia.getEmail()))
                .findFirst()
                .orElseGet(() -> repository.save(seed));
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

    private Aluguel aluguel(Cliente cliente, Quarto quarto, LocalDate entrada, LocalDate saida, int hospedes, boolean berco) {
        Aluguel aluguel = new Aluguel();
        aluguel.setCliente(cliente);
        aluguel.setQuarto(quarto);
        aluguel.setResidencia(quarto.getResidencia());
        aluguel.setDataEntrada(LocalDateTime.of(entrada, LocalTime.of(14, 0)));
        aluguel.setDataSaida(LocalDateTime.of(saida, LocalTime.of(12, 0)));
        aluguel.setQuantidadeHospedes(hospedes);
        aluguel.setQuantidadeDiarias(Math.max(1, (int) (saida.toEpochDay() - entrada.toEpochDay())));
        aluguel.setBercoSolicitado(Boolean.TRUE.equals(berco) && Boolean.TRUE.equals(quarto.getPermiteBerco()));
        aluguel.setValorDiaria(quarto.calcularValorDiaria(hospedes, aluguel.getBercoSolicitado()));
        aluguel.setValorFinal(aluguel.getValorDiaria().multiply(BigDecimal.valueOf(aluguel.getQuantidadeDiarias())));
        return aluguel;
    }

    private BigDecimal valor(String valor) {
        return new BigDecimal(valor);
    }
}
