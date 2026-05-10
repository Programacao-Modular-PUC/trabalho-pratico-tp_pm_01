# Sistema de Hospedagem - API REST

## 📖 Sobre o Projeto
Este projeto é um Sistema de Informação Modular desenvolvido como trabalho prático para a disciplina de Programação Modular. O objetivo é fornecer uma solução eficiente e escalável para o gerenciamento de hospedagens em residências locais na região de Maraú - BA. 

O sistema permite o gerenciamento de residências, quartos, clientes e aluguéis, além de realizar cálculos automáticos de diárias e emissão de recibos, utilizando conceitos avançados de Programação Orientada a Objetos (POO).

## 🚀 Tecnologias e Arquitetura
O projeto foi estruturado utilizando o padrão de arquitetura em camadas (Controller, Service, Repository, Model) para garantir o desacoplamento e a manutenibilidade do código.

* **Linguagem:** Java
* **Framework:** Spring Boot (API REST)
* **Banco de Dados:** MySQL
* **Boas Práticas:** Programação Orientada a Objetos (POO), Padrões de Projeto, Testes Automatizados.

## 👥 Equipe
* Ítalo Eduardo Carneiro da Silva
* Guilherme Augusto Martins de Carvalho
* Luca Moreira Ribeiro Mazala de Araujo
* João Victor Leite Soares

---

## 📇 Cartões CRC (Classe - Responsabilidade - Colaboração)

Abaixo estão detalhados os cartões CRC que guiaram a modelagem orientada a objetos do sistema, divididos por casos de uso.

### 1. Caso de Uso: Gerenciar Residências e Quartos

| Classe: Residencia | |
| :--- | :--- |
| **Responsabilidades** | **Colaborações** |
| 1. Conhecer seu endereço, número, bairro, cep, telefone e email | Quarto |
| 2. Conhecer e gerenciar sua lista de quartos que podem ser alugados | Aluguel |
| 3. Guardar e fornecer o histórico de aluguéis realizados na residência | |

<br>

| Classe: Quarto | |
| :--- | :--- |
| **Responsabilidades** | **Colaborações** |
| 1. Conhecer seu tipo, sendo individual ou para casal | |
| 2. Conhecer o seu valor base da diária, que é definido pelo proprietário | |
| 3. Conhecer seus itens adicionais, indicando se possui ar condicionado e/ou banheira de hidromassagem | |
| 4. Informar sua disponibilidade, garantindo que não seja alugado se já estiver ocupado no período solicitado | |

### 2. Caso de Uso: Cadastro e Autenticação de Clientes

| Classe: Cliente | |
| :--- | :--- |
| **Responsabilidades** | **Colaborações** |
| 1. Conhecer o seu nome e CPF | Aluguel |
| 2. Conhecer o seu endereço | |
| 3. Conhecer os seus dados de contato, como telefone e email | |

### 3. Caso de Uso: Realização de Reservas e Aluguéis

| Classe: Aluguel | |
| :--- | :--- |
| **Responsabilidades** | **Colaborações** |
| 1. Conhecer a data e o horário de entrada e de saída | Residência, Quarto, Cliente, Pagamento |
| 2. Conhecer a residência, o quarto e o cliente associados ao aluguel | |
| 3. Calcular a quantidade de diárias, considerando que o início ocorre às 12h, saídas após as 12h adicionam nova diária e entradas após as 12h contam como diária completa | |
| 4. Calcular o valor final da hospedagem somando o valor base do quarto aos valores dos itens adicionais | |
| 5. Imprimir o formulário de aluguel contendo datas, horários, número de diárias e o total a pagar | |

<br>

| Classe: Pagamento | |
| :--- | :--- |
| **Responsabilidades** | **Colaborações** |
| 1. Associar-se a um aluguel para efetivar a cobrança | Aluguel |
| 2. Conhecer o valor total gerado pelo aluguel e registrar a transação | |

### 4. Caso de Uso: Emissão de Recibos

| Classe: Recibo | |
| :--- | :--- |
| **Responsabilidades** | **Colaborações** |
| 1. Coletar e formatar a data e horário de entrada e saída | Aluguel, Pagamento |
| 2. Coletar e formatar o número total de diárias | |
| 3. Obter o valor total a pagar gerado pelo aluguel | |
| 4. Imprimir essas informações na tela seguindo o formato exigido pelo sistema | |

---

## 📊 Diagramas de Classe (UML - Domain Models)

Abaixo estão as representações das entidades principais que compõem a camada `Model` do sistema.
![Diagrama de UML - de classes ](imagens/Diagrama_de_UML_corrigido.png "Diagrama de UML.")


---------------------------------------------------------
|                      Residencia                       |
---------------------------------------------------------
| - id: Long                                            |
| - endereco: String                                    |
| - numero: String                                      |
| - bairro: String                                      |
| - cep: String                                         |
| - telefone: String                                    |
| - email: String                                       |
| - quartos: List<Quarto>                               |
| - historicoAlugueis: List<Aluguel>                    |
---------------------------------------------------------
| + adicionarQuarto(quarto: Quarto): void               |
| + removerQuarto(quarto: Quarto): void                 |
| + listarQuartosDisponiveis(): List<Quarto>            |
| + obterHistoricoAlugueis(): List<Aluguel>             |
---------------------------------------------------------

---------------------------------------------------------
|                        Quarto (ABSTRACT)              |
---------------------------------------------------------
| - id: Long                                            |
| - valorBase: Double                                   |
| - possuiArCondicionado: Boolean                       |
| - possuiHidromassagem: Boolean                        |
| - residencia: Residencia                              |
---------------------------------------------------------
| + calcularValorDiaria(hospedes: Integer): Double      |
| + verificarDisponibilidade(entrada: LocalDateTime,    |
|                            saida: LocalDateTime):     |
|                            Boolean                    |
---------------------------------------------------------

---------------------- HERANÇA --------------------------

---------------------------------------------------------
|                   QuartoIndividual                    |
---------------------------------------------------------
| - quantidadeCamasSolteiro: Integer                    |
| - valorAdicionalPorCama: Double                       |
---------------------------------------------------------
| + calcularValorDiaria(hospedes: Integer): Double      |
| + calcularLimiteHospedes(): Integer                   |
---------------------------------------------------------

REGRAS:
- Não permite berço
- Valor = valorBase + adicional por cama (se >1 cama)
- Limite de hóspedes proporcional às camas

---------------------------------------------------------
|                      QuartoDuplo                      |
---------------------------------------------------------
| - tipoCama: TipoCamaCasal                             |
| - possuiBercoSolicitado: Boolean                      |
| - valorAdicionalConforto: Double                      |
| - taxaBerco: Double                                   |
---------------------------------------------------------
| + calcularValorDiaria(hospedes: Integer): Double      |
| + possuiBerco(): Boolean                              |
---------------------------------------------------------

REGRAS:
- Pode ter cama casal, queen ou king
- Berço é opcional (sob solicitação)
- Taxa extra se solicitar berço
- Adicional por tipo de cama

---------------------------------------------------------
|                     QuartoFamilia                     |
---------------------------------------------------------
| - configuracaoCamas: List<Cama>                       |
| - ambientes: List<TipoAmbiente>                       |
| - percentualPorHospede: Double                        |
| - descontoGrupo: DescontoGrupo                        |
---------------------------------------------------------
| + calcularValorDiaria(hospedes: Integer): Double      |
| + calcularCapacidadeMaxima(): Integer                 |
| + descreverConfiguracao(): String                     |
---------------------------------------------------------

REGRAS:
- Mistura de camas (solteiro, casal, etc)
- Cálculo baseado em número de hóspedes
- Valor = valorBase + (% * número de hóspedes)
- Desconto progressivo para grupos

---------------------- ENUMS ----------------------------

---------------------------------------------------------
|                    <<enum>> TipoQuarto                |
---------------------------------------------------------
| INDIVIDUAL                                           |
| DUPLO                                                |
| FAMILIA                                              |
---------------------------------------------------------

---------------------------------------------------------
|                 <<enum>> TipoCamaCasal                |
---------------------------------------------------------
| CASAL_PADRAO                                         |
| QUEEN                                                |
| KING                                                 |
---------------------------------------------------------

---------------------------------------------------------
|                      <<enum>> Cama                    |
---------------------------------------------------------
| SOLTEIRO                                             |
| CASAL                                                |
| QUEEN                                                |
| KING                                                 |
| BERCO                                                |
---------------------------------------------------------

---------------------------------------------------------
|                 <<enum>> TipoAmbiente                 |
---------------------------------------------------------
| DORMITORIO                                           |
| ESTUDO                                               |
| HOME_OFFICE                                          |
| SALA_ESTAR                                           |
---------------------------------------------------------

---------------------------------------------------------
|                <<enum>> DescontoGrupo                 |
---------------------------------------------------------
| A_PARTIR_3_HOSPEDES_5PORCENTO                        |
| A_PARTIR_5_HOSPEDES_10PORCENTO                       |
| A_PARTIR_8_HOSPEDES_15PORCENTO                       |
---------------------------------------------------------

---------------------------------------------------------
|                       Cliente                         |
---------------------------------------------------------
| - id: Long                                            |
| - nome: String                                        |
| - cpf: String                                         |
| - endereco: String                                    |
| - telefone: String                                    |
| - email: String                                       |
---------------------------------------------------------
| + atualizarDados(novoEndereco: String,                |
|                  novoTelefone: String): void          |
---------------------------------------------------------

---------------------------------------------------------
|                       Aluguel                         |
---------------------------------------------------------
| - id: Long                                            |
| - residencia: Residencia                              |
| - quarto: Quarto                                      |
| - cliente: Cliente                                    |
| - dataEntrada: LocalDateTime                          |
| - dataSaida: LocalDateTime                            |
| - quantidadeHospedes: Integer                         |
| - valorFinal: Double                                  |
| - pagamento: Pagamento                                |
---------------------------------------------------------
| + calcularDiarias(): Integer                          |
| + calcularValorFinal(): Double                        |
| + gerarRecibo(): Recibo                               |
---------------------------------------------------------

---------------------------------------------------------
|                      Pagamento                        |
---------------------------------------------------------
| - id: Long                                            |
| - aluguel: Aluguel                                    |
| - valorTotal: Double                                  |
| - dataRegistro: LocalDateTime                         |
| - status: String                                      |
---------------------------------------------------------
| + processarPagamento(): void                          |
| + confirmarPagamento(): void                          |
---------------------------------------------------------

---------------------------------------------------------
|                        Recibo                         |
---------------------------------------------------------
| - dataEntradaFormatada: String                        |
| - dataSaidaFormatada: String                          |
| - numeroDiarias: Integer                              |
| - totalPagar: Double                                  |
---------------------------------------------------------
| + imprimirFormulario(): void                          |
---------------------------------------------------------

## Diagrama de Classes Atualizado - Sprint 2

```mermaid
classDiagram
    class Residencia {
        Long id
        String endereco
        String numero
        String bairro
        String cep
        String telefone
        String email
        List~Quarto~ quartos
        List~Aluguel~ alugueis
    }

    class Quarto {
        Long id
        String codigo
        TipoQuarto tipo
        BigDecimal valorBase
        Boolean possuiArCondicionado
        Boolean possuiHidromassagem
        Integer capacidadeMaxima
        Integer quantidadeCamasSolteiro
        Integer quantidadeCamasCasal
        Integer quantidadeCamasQueen
        Integer quantidadeCamasKing
        Integer quantidadeAmbientes
        Boolean permiteBerco
        TipoCamaCasal tipoCamaCasal
        BigDecimal valorAdicionalPorCamaSolteiro
        BigDecimal valorAdicionalCamaCasal
        BigDecimal valorAdicionalCamaQueenKing
        BigDecimal taxaBerco
        BigDecimal percentualAdicionalPorHospede
        BigDecimal calcularValorDiaria(Integer hospedes, Boolean bercoSolicitado)
        Integer calcularCapacidadeMaxima()
    }

    class Cliente {
        Long id
        String nome
        String cpf
        String endereco
        String telefone
        String email
        List~Aluguel~ alugueis
    }

    class Aluguel {
        Long id
        LocalDateTime dataEntrada
        LocalDateTime dataSaida
        Integer quantidadeHospedes
        Integer quantidadeDiarias
        Boolean bercoSolicitado
        BigDecimal valorDiaria
        BigDecimal valorFinal
    }

    class TipoQuarto {
        <<enumeration>>
        INDIVIDUAL
        DUPLO
        CASAL
        FAMILIA
    }

    class TipoCamaCasal {
        <<enumeration>>
        CASAL_PADRAO
        QUEEN
        KING
    }

    Residencia "1" --> "*" Quarto
    Residencia "1" --> "*" Aluguel
    Quarto "1" --> "*" Aluguel
    Cliente "1" --> "*" Aluguel
    Quarto --> TipoQuarto
    Quarto --> TipoCamaCasal
```

Regras implementadas:

- Quarto individual: usa uma ou mais camas de solteiro, nao permite berco, calcula diaria como valor base mais adicional por cama extra.
- Quarto duplo/casal: usa cama casal padrao, queen ou king, permite berco opcional quando configurado, soma taxa de berco e adicional de conforto.
- Quarto familia: calcula capacidade pela mistura de camas, exige quantidade de ambientes e calcula diaria por hospedes com desconto progressivo para grupos.
