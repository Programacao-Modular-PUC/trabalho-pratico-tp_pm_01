# Sprint 4 — Relatório Técnico

**Disciplina:** Programação Modular  
**Projeto:** Sistema de Hospedagem MaraúReserve  

**Funcionalidades escolhidas:**
- **Opção 3** — Central de Notificações *(implementada)*
- **Opção 5** — Relatórios Gerenciais *(planejada — implementação pendente)*

---

## Introdução

Nesta sprint, o grupo evoluiu a arquitetura do sistema aplicando padrões de projeto para ampliar as capacidades da aplicação, mantendo extensibilidade e facilidade de manutenção. Foram escolhidas duas funcionalidades do enunciado, descritas nas seções abaixo de forma separada.

---

# Parte I — Opção 3: Central de Notificações

## 1. Problema identificado

Antes da evolução arquitetural, o `AluguelService` concentra apenas regras de negócio de reservas. Se a lógica de notificação fosse adicionada diretamente nesse serviço, ocorreriam os seguintes problemas:

1. **Alto acoplamento** — cada nova operação (criar, cancelar, check-in) precisaria conhecer todos os canais de envio;
2. **Baixa extensibilidade** — incluir um novo canal (ex.: push notification) exigiria alterar múltiplos pontos do código;
3. **Responsabilidade única violada** — o serviço de aluguel passaria a cuidar de persistência, validações e comunicação;
4. **Dificuldade de manutenção** — mudanças em mensagens ou canais impactariam o núcleo do domínio.

## 2. Solução proposta e padrões utilizados

A solução utiliza apenas padrões permitidos na disciplina: **Observer**, **Strategy**, **Factory** e **Singleton**.

### 2.1 Observer (Observador)

**Onde:** pacote `notifications.observer`

**Componentes:**
- `ObservadorNotificacao` — interface do observador
- `DespachanteNotificacaoObserver` — observador concreto que reage aos eventos
- `GerenciadorNotificacoes.publicar()` — notifica todos os observadores registrados

**Como foi usado:**

Quando o `AluguelService` conclui uma operação (ex.: criar reserva), ele publica um `NotificacaoEvento` no gerenciador. Os observadores registrados são notificados automaticamente, sem que o serviço conheça os detalhes do envio.

```java
gerenciadorNotificacoes.publicar(new NotificacaoEvento(TipoEventoNotificacao.RESERVA_CRIADA, salvo));
```

**Justificativa:** o Observer desacopla quem **gera** o evento de quem **reage** a ele. Novos observadores (ex.: auditoria, métricas) podem ser registrados sem alterar o `AluguelService`.

### 2.2 Strategy (Estratégia)

**Onde:** pacote `notifications.strategy`

**Componentes:**
- `CanalNotificacao` — interface comum (`enviar`, `getNome`)
- `EmailCanalNotificacao`, `SmsCanalNotificacao`, `WhatsAppCanalNotificacao`, `NotificacaoInternaCanal` — estratégias concretas

**Como foi usado:**

O `DespachanteNotificacaoObserver` monta as mensagens e delega o envio ao gerenciador, que percorre todos os canais registrados:

```java
for (CanalNotificacao canal : canais) {
    canal.enviar(mensagem);
}
```

**Justificativa:** cada canal possui regras próprias de entrega. O Strategy permite adicionar novos canais implementando a interface, respeitando o princípio Aberto/Fechado (OCP), sem modificar o código existente.

### 2.3 Factory (Fábrica)

**Onde:** pacote `notifications.factory`

**Componentes:**
- `FabricaMensagensNotificacao` — interface da fábrica
- `FabricaMensagensNotificacaoPadrao` — implementação que monta mensagens para cliente e proprietário

**Como foi usado:**

O `DespachanteNotificacaoObserver` delega a criação das mensagens à fábrica, que encapsula títulos, conteúdo e destinatários conforme o tipo de evento:

```java
for (MensagemNotificacao mensagem : fabricaMensagens.criarMensagens(evento)) {
    gerenciador.enviarPorCanais(mensagem);
}
```

**Justificativa:** centraliza a lógica de construção das mensagens e evita que observadores e canais conheçam os detalhes de formatação de cada evento.

### 2.4 Singleton

**Onde:** `GerenciadorNotificacoes`

**Como foi usado:**

Classe com construtor privado, instância única via `getInstance()` e double-checked locking para thread-safety. Centraliza:

- registro de observadores;
- registro de canais;
- publicação de eventos;
- histórico de notificações internas.

**Justificativa da instância única:**

A Central de Notificações é um **recurso global** da aplicação. Manter uma única instância garante que todos os serviços publiquem eventos no mesmo barramento, que os canais sejam registrados uma única vez na inicialização e que o histórico interno seja consistente em toda a aplicação.

## 3. Eventos e canais implementados

### Eventos suportados

| Evento | Gatilho no sistema |
|--------|-------------------|
| `RESERVA_CRIADA` | Criação de um novo aluguel/reserva |
| `RESERVA_CANCELADA` | Cancelamento de reserva |
| `CHECKIN_REALIZADO` | `POST /alugueis/{id}/check-in` |
| `CHECKOUT_REALIZADO` | `POST /alugueis/{id}/check-out` |
| `PAGAMENTO_CONFIRMADO` | `POST /alugueis/{id}/confirmar-pagamento` |

### Canais de comunicação

| Canal | Implementação |
|-------|---------------|
| E-mail | `EmailCanalNotificacao` |
| SMS | `SmsCanalNotificacao` |
| WhatsApp | `WhatsAppCanalNotificacao` |
| Notificação interna | `NotificacaoInternaCanal` (histórico consultável via API) |

### Endpoints relacionados

- `GET /notificacoes` — lista notificações internas registradas
- `GET /notificacoes/evento/{tipo}` — filtra por tipo de evento

## 4. Fluxo de execução

```text
1. Cliente cria reserva via POST /alugueis
2. AluguelService valida, persiste e chama publicarEvento()
3. GerenciadorNotificacoes notifica DespachanteNotificacaoObserver
4. Observer usa FabricaMensagensNotificacao (Factory) para montar mensagens
5. GerenciadorNotificacoes envia por todos os canais (Strategy)
6. NotificacaoInternaCanal registra no histórico
7. GET /notificacoes retorna registros para consulta
```

## 5. Benefícios obtidos

| Benefício | Descrição |
|-----------|-----------|
| **Extensibilidade** | Novos canais = nova classe `CanalNotificacao` |
| **Manutenibilidade** | Mensagens centralizadas na Factory (`FabricaMensagensNotificacaoPadrao`) |
| **Desacoplamento** | `AluguelService` não conhece e-mail, SMS ou WhatsApp |
| **Testabilidade** | Canais e observadores podem ser mockados isoladamente |
| **Consistência** | Singleton garante ponto único de publicação e histórico |

## 6. Como demonstrar

1. Subir a aplicação (`docker-compose up` ou Spring Boot local).
2. Criar uma reserva: `POST /alugueis`.
3. Consultar notificações: `GET /notificacoes`.
4. Executar check-in: `POST /alugueis/{id}/check-in`.
5. Confirmar pagamento: `POST /alugueis/{id}/confirmar-pagamento`.
6. Cancelar reserva: `POST /alugueis/{id}/cancelar`.
7. Verificar logs do backend (canais E-mail, SMS e WhatsApp simulados via SLF4J).
8. Rodar testes: `mvn test` no módulo `back`.

---

# Parte II — Opção 5: Relatórios Gerenciais

> **Status:** funcionalidade escolhida e documentada neste relatório. A implementação ainda **não foi realizada** e será desenvolvida em etapa posterior.

## 1. Problema identificado

Os proprietários precisam acompanhar o desempenho do negócio por meio de relatórios gerenciais (faturamento, ocupação, clientes frequentes, etc.). Sem uma arquitetura adequada, cada novo relatório tenderia a:

1. **Duplicar lógica** — consultas, agregações e formatação repetidas em controllers ou services distintos;
2. **Acoplar relatórios ao restante do sistema** — alterações em um relatório poderiam impactar outros;
3. **Dificultar extensão** — adicionar um novo tipo de relatório exigiria modificar código já existente;
4. **Concentrar responsabilidades** — serviços de domínio (ex.: `AluguelService`) passariam a conhecer detalhes de apresentação e exportação de dados.

## 2. Solução proposta e padrões escolhidos

Para a Opção 5, o grupo definiu a combinação abaixo, utilizando **somente padrões permitidos** *(ainda não implementada)*:

### 2.1 Strategy (Estratégia)

**Papel previsto:** representar cada tipo de relatório como uma estratégia independente.

**Componentes planejados:**
- `RelatorioStrategy` — interface comum (`gerar`, `getTipo`)
- Implementações concretas por relatório

**Exemplos de estratégias planejadas:**

| Relatório | Descrição |
|-----------|-----------|
| Faturamento mensal | Total de receita por período |
| Taxa de ocupação | Percentual de quartos/residências ocupados |
| Clientes mais frequentes | Ranking por quantidade de hospedagens |
| Quartos mais alugados | Ranking de quartos por número de reservas |
| Receita por tipo de quarto | Agregação por `TipoQuarto` |
| Histórico de reservas | Listagem consolidada por filtros |

**Justificativa:** o Strategy permite registrar e executar relatórios de forma plugável. O sistema seleciona a estratégia desejada em tempo de execução, sem alterar o código que consome os relatórios.

### 2.2 Factory (Fábrica)

**Papel previsto:** instanciar a estratégia correta conforme o tipo solicitado.

**Componentes planejados:**
- `RelatorioFactory` — recebe o tipo do relatório (ex.: `FATURAMENTO_MENSAL`) e retorna a `RelatorioStrategy` correspondente

**Justificativa:** encapsula a criação dos relatórios, evitando `if/switch` espalhados em controllers e services. Novos relatórios são registrados na fábrica sem modificar quem consome a funcionalidade.

### 2.3 Command (Comando)

**Papel previsto:** encapsular cada solicitação de geração de relatório como um objeto executável.

**Componentes planejados:**
- `GerarRelatorioCommand` — armazena tipo do relatório e filtros (período, residência, etc.)
- `executar()` — delega à `RelatorioFactory` e retorna o resultado

**Justificativa:** desacopla quem solicita o relatório (controller/API) da lógica de execução, facilitando filas de processamento, histórico de comandos e extensão futura.

### 2.4 Decorator (Decorador)

**Papel previsto:** compor formatações adicionais sobre o resultado base do relatório.

**Componentes planejados:**
- `RelatorioResultado` — estrutura base retornada pela strategy
- `RelatorioDecorator` — classe base que envolve outro resultado
- Decoradores concretos, ex.: `CabecalhoRelatorioDecorator`, `ResumoExecutivoDecorator`

**Justificativa:** permite enriquecer a apresentação (cabeçalho, totais, observações) sem alterar as classes de cálculo de cada relatório.

### 2.5 Singleton

**Papel previsto:** `GerenciadorRelatorios` como ponto central de registro e execução.

**Justificativa da instância única:**

O gerenciador de relatórios será um **recurso global** responsável por:

- registrar as estratégias e comandos disponíveis;
- centralizar a execução via Factory;
- evitar múltiplas instâncias com registros inconsistentes de relatórios.

> O enunciado da sprint cita explicitamente o **Gerenciador de relatórios** como exemplo válido de aplicação do padrão Singleton.

## 3. Benefícios esperados

| Benefício | Descrição |
|-----------|-----------|
| **Extensibilidade** | Novo relatório = nova `Strategy` registrada na Factory |
| **Organização** | Command encapsula solicitações; Singleton centraliza execução |
| **Manutenibilidade** | Cada relatório isolado em sua própria classe |
| **Apresentação flexível** | Decorator adiciona formatações sem mudar o núcleo |
| **Desacoplamento** | Serviços de domínio não precisam conhecer detalhes de cada relatório |



# Requisito obrigatório — Uso de Singleton na Sprint

Conforme exigido pelo enunciado, o padrão Singleton é utilizado em componentes que representam recursos globais do sistema:

| Componente | Funcionalidade | Status |
|------------|----------------|--------|
| `ConfiguracaoReservas` | Configurações globais de reservas (Sprint anterior) | Implementado |
| `GerenciadorNotificacoes` | Central de notificações (Opção 3) | Implementado |
| `GerenciadorRelatorios` | Central de relatórios gerenciais (Opção 5) | Planejado |

O Singleton **não é o único padrão** adotado na sprint: ele complementa Observer, Strategy e Factory na Central de Notificações (Opção 3), e complementará Strategy, Factory, Command e Decorator nos Relatórios Gerenciais (Opção 5, **somente planejado**).

---

## Equipe

- Ítalo Eduardo Carneiro da Silva
- Guilherme Augusto Martins de Carvalho
- Luca Moreira Ribeiro Mazala de Araujo
- João Victor Leite Soares
