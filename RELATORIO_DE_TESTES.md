# Relatório de Testes — Sprint 3

**Disciplina:** Programação Modular  
**Projeto:** Sistema de Hospedagem — Marau Reserve  
**Sprint:** 3 — Tratamento de Exceções e Testes Unitários  
**Data da execução:** 26/06/2026  
**Ferramenta:** JUnit 5 (JUnit Jupiter) + Maven Surefire 3.5.5  
**Comando utilizado:**

```powershell
cd back
.\mvnw.cmd test
```

---

## 1. Resumo da execução

| Métrica | Valor |
|---|---|
| Total de testes | 8 |
| Sucesso | 8 |
| Falhas | 0 |
| Erros | 0 |
| Ignorados | 0 |
| Tempo total | ~51 s |
| Resultado final | **BUILD SUCCESS** |

### Classes de teste executadas

| Classe | Testes | Tempo | Resultado |
|---|---|---|---|
| `BackApplicationTests` | 1 | 29,28 s | Aprovado |
| `AluguelServiceTest` | 3 | 1,83 s | Aprovado |
| `QuartoTest` | 4 | 0,12 s | Aprovado |

---

## 2. Exceções personalizadas cobertas

| Exceção | Descrição | Testada em |
|---|---|---|
| `CapacidadeExcedidaException` | Quantidade de hóspedes acima da capacidade do quarto | `AluguelServiceTest` |
| `RecursoNaoPermitidoException` | Berço solicitado em quarto que não permite | `AluguelServiceTest` |
| `QuartoIndisponivelException` | Quarto já reservado no período informado | `AluguelServiceTest` |
| `DataInvalidaException` | Datas inválidas ou no passado | Tratada em `AluguelService` (validação em tempo de execução) |

---

## 3. Detalhamento dos testes

### 3.1. Carga do contexto da aplicação

**Arquivo:** `back/src/test/java/com/example/maraureserve/BackApplicationTests.java`

| Campo | Valor |
|---|---|
| **Método** | `contextLoads()` |
| **Objetivo** | Verificar se o contexto Spring Boot inicializa corretamente com banco H2 em memória |
| **Entrada** | Configuração de teste com `jdbc:h2:mem:marau_reserve` e `ddl-auto=create-drop` |
| **Saída esperada** | Contexto carregado sem exceções |
| **Resultado** | **Aprovado** |

---

### 3.2. Cálculo de diária por tipo de quarto

**Arquivo:** `back/src/test/java/com/example/maraureserve/services/QuartoTest.java`

#### Teste 1 — Quarto individual com adicional de cama

| Campo | Valor |
|---|---|
| **Método** | `testCalculoDiaria_QuartoIndividual_ComAdicionalDeCama()` |
| **Entrada** | Tipo: `INDIVIDUAL`; valor base: R$ 100,00; camas solteiro: 2; adicional por cama: R$ 30,00; hóspedes: 2; berço: `false` |
| **Regra aplicada** | Valor base + adicional da 2ª cama (100 + 30) |
| **Saída esperada** | R$ 130,00 |
| **Saída obtida** | R$ 130,00 |
| **Resultado** | **Aprovado** |

#### Teste 2 — Quarto duplo sem berço, com adicional de conforto (Queen)

| Campo | Valor |
|---|---|
| **Método** | `testCalculoDiaria_QuartoDuplo_SemBerco_ComAdicionalConforto()` |
| **Entrada** | Tipo: `DUPLO`; valor base: R$ 150,00; cama: `QUEEN`; adicional Queen/King: R$ 50,00; hóspedes: 2; berço: `false` |
| **Regra aplicada** | Valor base + adicional de conforto (150 + 50) |
| **Saída esperada** | R$ 200,00 |
| **Saída obtida** | R$ 200,00 |
| **Resultado** | **Aprovado** |

#### Teste 3 — Quarto duplo com taxa de berço

| Campo | Valor |
|---|---|
| **Método** | `testCalculoDiaria_QuartoDuplo_ComTaxaDeBerco()` |
| **Entrada** | Tipo: `DUPLO`; valor base: R$ 150,00; cama: `CASAL_PADRAO`; taxa berço: R$ 40,00; hóspedes: 2; berço: `true` |
| **Regra aplicada** | Valor base + taxa de berço (150 + 40) |
| **Saída esperada** | R$ 190,00 |
| **Saída obtida** | R$ 190,00 |
| **Resultado** | **Aprovado** |

#### Teste 4 — Quarto família com desconto para grupo

| Campo | Valor |
|---|---|
| **Método** | `testCalculoDiaria_QuartoFamilia_ComDescontoParaGrupo()` |
| **Entrada** | Tipo: `FAMILIA`; valor base: R$ 200,00; percentual por hóspede: 10%; hóspedes: 5; berço: `false` |
| **Regra aplicada** | Base + 50% adicional (200 + 100 = 300); desconto de grupo ≥5 hóspedes: -10% (270) |
| **Saída esperada** | R$ 270,00 |
| **Saída obtida** | R$ 270,00 |
| **Resultado** | **Aprovado** |

---

### 3.3. Regras de negócio do serviço de aluguel

**Arquivo:** `back/src/test/java/com/example/maraureserve/services/AluguelServiceTest.java`

Utiliza **Mockito** para simular repositórios e serviços dependentes, isolando a lógica de validação do `AluguelService`.

#### Teste 5 — Limite de hóspedes (capacidade excedida)

| Campo | Valor |
|---|---|
| **Método** | `testLimitesDeHospedes_CapacidadeExcedida_LancaExcecao()` |
| **Entrada** | Residência ID: 1; Quarto ID: 1; Cliente ID: 1; hóspedes solicitados: **2**; capacidade máxima do quarto: **1**; datas: amanhã → +3 dias |
| **Saída esperada** | Lançamento de `CapacidadeExcedidaException` com mensagem *"A quantidade de hóspedes excede a capacidade máxima do quarto."* |
| **Saída obtida** | Exceção lançada conforme esperado |
| **Resultado** | **Aprovado** |

#### Teste 6 — Regra de berço não permitido

| Campo | Valor |
|---|---|
| **Método** | `testRegrasDeBerco_BercoSolicitadoENaoPermitido_LancaExcecao()` |
| **Entrada** | Berço solicitado: **true**; quarto com `permiteBerco = false`; capacidade: 4; hóspedes: 2 |
| **Saída esperada** | Lançamento de `RecursoNaoPermitidoException` com mensagem *"O quarto informado não permite solicitação de berço."* |
| **Saída obtida** | Exceção lançada conforme esperado |
| **Resultado** | **Aprovado** |

#### Teste 7 — Disponibilidade do quarto

| Campo | Valor |
|---|---|
| **Método** | `testDisponibilidade_QuartoIndisponivel_LancaExcecao()` |
| **Entrada** | Quarto com capacidade 4; berço não solicitado; repositório retorna **1 conflito** de reserva no período |
| **Saída esperada** | Lançamento de `QuartoIndisponivelException` com mensagem *"O quarto ja esta reservado para o periodo informado."* |
| **Saída obtida** | Exceção lançada conforme esperado |
| **Resultado** | **Aprovado** |

---

## 4. Cobertura dos requisitos da Sprint 3

| Requisito | Cobertura nos testes |
|---|---|
| Cálculo de diária por tipo de quarto | 4 testes em `QuartoTest` (Individual, Duplo, Família) |
| Regras de berço | `testRegrasDeBerco_BercoSolicitadoENaoPermitido_LancaExcecao` + cálculo com taxa em `QuartoTest` |
| Limites de hóspedes | `testLimitesDeHospedes_CapacidadeExcedida_LancaExcecao` |
| Disponibilidade | `testDisponibilidade_QuartoIndisponivel_LancaExcecao` |
| Exceções personalizadas | `CapacidadeExcedidaException`, `RecursoNaoPermitidoException`, `QuartoIndisponivelException` |
| Inicialização do sistema | `BackApplicationTests.contextLoads()` |

### Novos requisitos (funcionalidades implementadas no backend)

| Funcionalidade | Endpoint / método | Observação |
|---|---|---|
| Filtro por tipo de quarto | `QuartoService` / repositório | Validado indiretamente via modelo `Quarto` e enum `TipoQuarto` |
| Cancelamento de aluguel | `AluguelService.cancelar()` | Regra: não cancela aluguel já iniciado (`BusinessException`) |
| Histórico por cliente | `AluguelService.listarPorCliente()` | Listagem ordenada por data de entrada |

---

## 5. Saída completa do Maven (resumo)

```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.example.maraureserve.BackApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 29.28 s
[INFO] Running com.example.maraureserve.services.AluguelServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.833 s
[INFO] Running com.example.maraureserve.services.QuartoTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.119 s
[INFO] 
[INFO] Results:
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] BUILD SUCCESS
```

Relatórios detalhados gerados automaticamente pelo Surefire em:

```
back/target/surefire-reports/
```

---

## 6. Como reproduzir

```powershell
# Na raiz do projeto
cd back
.\mvnw.cmd test
```

Para visualizar apenas o resumo após a execução:

```powershell
Get-Content .\target\surefire-reports\*.txt
```

---

## 7. Equipe

- Ítalo Eduardo Carneiro da Silva
- Guilherme Augusto Martins de Carvalho
- Luca Moreira Ribeiro Mazala de Araujo
- João Victor Leite Soares

---

# Relatório de Testes — Sprint 4

**Disciplina:** Programação Modular  
**Projeto:** Sistema de Hospedagem — Marau Reserve  
**Sprint:** 4 — Padrões de Projeto e Evolução Arquitetural  
**Data da execução:** 02/07/2026  
**Ferramenta:** JUnit 5 (JUnit Jupiter) + Maven Surefire 3.5.5  
**Comando utilizado:**

```powershell
cd back
.\mvnw.cmd test
```

---

## S4.1 Resumo da execução

| Métrica | Valor |
|---|---|
| Total de testes | 26 |
| Sucesso | 26 |
| Falhas | 0 |
| Erros | 0 |
| Ignorados | 0 |
| Resultado final | **BUILD SUCCESS** |

### Classes de teste executadas

| Classe | Testes | Escopo |
|---|---|---|
| `BackApplicationTests` | 1 | Contexto Spring Boot |
| `AluguelServiceTest` | 3 | Regras de negócio do serviço de aluguel |
| `AluguelServiceNotificacaoIntegrationTest` | 1 | Integração AluguelService ↔ notificações |
| `QuartoTest` | 4 | Cálculo de diária |
| `GerenciadorNotificacoesTest` | 4 | Singleton, Observer, Strategy |
| `RelatorioFactoryTest` | 3 | Factory de estratégias |
| `GerarRelatorioCommandTest` | 3 | Command |
| `GerenciadorRelatoriosTest` | 4 | Singleton + Decorator |
| `FaturamentoMensalStrategyTest` | 3 | Strategy de faturamento mensal |

---

## S4.2 Novos testes da Sprint 4

### Central de Notificações

**Arquivo:** `back/src/test/java/com/example/maraureserve/notifications/GerenciadorNotificacoesTest.java`

| Método | Objetivo |
|---|---|
| `getInstance_deveRetornarMesmaInstancia` | Valida padrão Singleton |
| `publicar_deveNotificarObservadoresRegistrados` | Valida padrão Observer |
| `enviarPorCanais_deveUsarTodosCanaisRegistrados` | Valida padrão Strategy |
| `fluxoCompleto_deveRegistrarNotificacaoInterna` | Fluxo completo com histórico interno |

**Integração com domínio:** `AluguelServiceNotificacaoIntegrationTest.criarReserva_devePublicarEventoReservaCriada` verifica que `AluguelService.criar()` publica `RESERVA_CRIADA` no `GerenciadorNotificacoes`.

### Relatórios Gerenciais

| Arquivo | Padrão validado | Testes |
|---|---|---|
| `RelatorioFactoryTest` | Factory | 3 |
| `GerarRelatorioCommandTest` | Command | 3 |
| `GerenciadorRelatoriosTest` | Singleton + Decorator | 4 |
| `FaturamentoMensalStrategyTest` | Strategy | 3 |

---

## S4.3 Ajuste técnico — compatibilidade JDK 25

Os testes de `AluguelServiceTest` foram refatorados para usar **stubs com Java Proxy e subclasses**, eliminando dependência de Mockito inline (incompatível com JDK 25 no ambiente de execução). Os demais testes da Sprint 4 já seguiam essa abordagem.

---

## S4.4 Cobertura dos requisitos da Sprint 4

| Requisito | Cobertura nos testes |
|---|---|
| Padrão Singleton (obrigatório) | `GerenciadorNotificacoesTest`, `GerenciadorRelatoriosTest` |
| Central de Notificações (Opção 3) | 4 testes unitários + 1 teste de integração |
| Relatórios Gerenciais (Opção 5) | 13 testes nos módulos `reports/` |
| Integração evento ↔ serviço | `criar_devePublicarEventoReservaCriada` |

---

## S4.5 Como reproduzir

```powershell
cd back
.\mvnw.cmd test
```

Para executar apenas os testes da Sprint 4:

```powershell
.\mvnw.cmd test -Dtest=GerenciadorNotificacoesTest,RelatorioFactoryTest,GerarRelatorioCommandTest,GerenciadorRelatoriosTest,FaturamentoMensalStrategyTest
```
