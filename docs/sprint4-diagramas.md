# Sprint 4 — Diagramas UML

Complemento de [sprint4-relatorio.md](sprint4-relatorio.md). Notação UML 2.x em Mermaid.

**Legenda de relações**

| Símbolo | Significado UML |
|---------|-----------------|
| `--\|>` | generalização (herança / realização) |
| `*--` | composição |
| `o--` | agregação |
| `-->` | associação |
| `..>` | dependência |
| `1`, `0..1`, `1..*` | multiplicidade |

---

## 1. Diagrama de pacotes — visão geral

```mermaid
classDiagram
    direction TB

    namespace controllers {
        class AluguelController
        class NotificacaoController
        class RelatorioController
    }

    namespace services {
        class AluguelService
        class NotificacaoService
        class RelatorioService
    }

    namespace notifications {
        class GerenciadorNotificacoes <<Singleton>>
        class ObservadorNotificacao <<Observer>>
        class CanalNotificacao <<Strategy>>
        class FabricaMensagensNotificacao <<Factory>>
    }

    namespace reports {
        class GerenciadorRelatorios <<Singleton>>
        class RelatorioStrategy <<Strategy>>
        class RelatorioFactory <<Factory>>
        class GerarRelatorioCommand <<Command>>
        class RelatorioDecorator <<Decorator>>
    }

    namespace repositories {
        class AluguelRepository <<Repository>>
    }

    namespace models {
        class Aluguel
    }

    AluguelController ..> AluguelService
    NotificacaoController ..> NotificacaoService
    RelatorioController ..> RelatorioService

    AluguelService ..> GerenciadorNotificacoes
    AluguelService ..> Aluguel
    NotificacaoService ..> GerenciadorNotificacoes
    RelatorioService ..> GerenciadorRelatorios

    GerenciadorRelatorios ..> RelatorioFactory
    GerenciadorRelatorios ..> GerarRelatorioCommand
    GerenciadorRelatorios ..> RelatorioDecorator
    RelatorioFactory o-- RelatorioStrategy
    RelatorioStrategy ..> AluguelRepository
```

---

## 2. Opção 3 — Central de Notificações

### 2.1 Estrutural — núcleo e integração

```mermaid
classDiagram
    direction LR

    class AluguelService {
        -gerenciadorNotificacoes : GerenciadorNotificacoes
        +criar() AluguelResponse
        +cancelar() void
        +realizarCheckIn() AluguelResponse
        +realizarCheckOut() AluguelResponse
        +confirmarPagamento() AluguelResponse
        -publicarEvento() void
    }

    class NotificacaoController {
        +listar() List
        +listarPorEvento() List
    }

    class NotificacaoService {
        -gerenciador : GerenciadorNotificacoes
        +listarTodas() List
        +listarPorEvento() List
    }

    class NotificacaoConfig {
        +inicializarCentralNotificacoes() void
    }

    class GerenciadorNotificacoes <<Singleton>> {
        -instancia {static} : GerenciadorNotificacoes
        -observadores : List
        -canais : List
        -historicoInterno : List
        +getInstance() {static} GerenciadorNotificacoes
        +registrarObservador() void
        +registrarCanal() void
        +publicar() void
        +enviarPorCanais() void
        +registrarNotificacaoInterna() void
        +listarHistoricoInterno() List
        +listarPorEvento() List
    }

    class NotificacaoEvento {
        -tipo : TipoEventoNotificacao
        -aluguel : Aluguel
        -ocorridoEm : LocalDateTime
    }

    class TipoEventoNotificacao <<enumeration>> {
        RESERVA_CRIADA
        RESERVA_CANCELADA
        CHECKIN_REALIZADO
        CHECKOUT_REALIZADO
        PAGAMENTO_CONFIRMADO
    }

    AluguelService "1" --> "1" GerenciadorNotificacoes : publicar
    NotificacaoController ..> NotificacaoService
    NotificacaoService "1" --> "1" GerenciadorNotificacoes
    NotificacaoConfig ..> GerenciadorNotificacoes
    AluguelService ..> NotificacaoEvento : cria
    NotificacaoEvento --> TipoEventoNotificacao
    NotificacaoEvento --> Aluguel
    GerenciadorNotificacoes ..> NotificacaoEvento
```

### 2.2 Estrutural — padrão Observer

```mermaid
classDiagram
    direction TB

    class GerenciadorNotificacoes <<Singleton>> {
        +publicar(evento) void
    }

    class ObservadorNotificacao <<interface>> {
        <<Observer>>
        +atualizar(evento) void
    }

    class DespachanteNotificacaoObserver {
        <<Observer>>
        -gerenciador : GerenciadorNotificacoes
        -fabricaMensagens : FabricaMensagensNotificacao
        +atualizar(evento) void
    }

    class NotificacaoEvento

    ObservadorNotificacao <|.. DespachanteNotificacaoObserver
    GerenciadorNotificacoes "1" o-- "0..*" ObservadorNotificacao
    GerenciadorNotificacoes ..> NotificacaoEvento
    DespachanteNotificacaoObserver --> GerenciadorNotificacoes
```

### 2.3 Estrutural — padrão Strategy (canais)

```mermaid
classDiagram
    direction TB

    class GerenciadorNotificacoes <<Singleton>> {
        +enviarPorCanais(mensagem) void
    }

    class CanalNotificacao <<interface>> {
        <<Strategy>>
        +getNome() String
        +enviar(mensagem) void
    }

    class EmailCanalNotificacao
    class SmsCanalNotificacao
    class WhatsAppCanalNotificacao
    class NotificacaoInternaCanal

    class MensagemNotificacao <<DTO>> {
        +tipoEvento
        +destinatario
        +titulo
        +conteudo
        +enviadaEm
    }

    CanalNotificacao <|.. EmailCanalNotificacao
    CanalNotificacao <|.. SmsCanalNotificacao
    CanalNotificacao <|.. WhatsAppCanalNotificacao
    CanalNotificacao <|.. NotificacaoInternaCanal

    GerenciadorNotificacoes "1" o-- "1..*" CanalNotificacao
    CanalNotificacao ..> MensagemNotificacao
    NotificacaoInternaCanal --> GerenciadorNotificacoes
```

### 2.4 Estrutural — padrão Factory e modelo

```mermaid
classDiagram
    direction LR

    class FabricaMensagensNotificacao <<interface>> {
        <<Factory>>
        +criarMensagens(evento) List
    }

    class FabricaMensagensNotificacaoPadrao {
        <<Factory>>
        +criarMensagens(evento) List
    }

    class DespachanteNotificacaoObserver {
        -fabricaMensagens : FabricaMensagensNotificacao
    }

    class NotificacaoEvento
    class MensagemNotificacao <<DTO>>
    class NotificacaoRegistro <<DTO>>
    class NotificacaoResponse <<DTO>>

    class NotificacaoService {
        +listarTodas() List
    }

    FabricaMensagensNotificacao <|.. FabricaMensagensNotificacaoPadrao
    DespachanteNotificacaoObserver --> FabricaMensagensNotificacao
    FabricaMensagensNotificacaoPadrao ..> NotificacaoEvento
    FabricaMensagensNotificacaoPadrao ..> MensagemNotificacao : «create»
    NotificacaoService ..> NotificacaoRegistro
    NotificacaoService ..> NotificacaoResponse : «map»
```

### 2.5 Comportamental — publicar evento

```mermaid
sequenceDiagram
    box rgb(240,240,240) controllers / services
        participant C as :AluguelController
        participant S as :AluguelService
    end
    box rgb(230,245,255) notifications
        participant G as :GerenciadorNotificacoes
        participant O as :DespachanteNotificacaoObserver
        participant F as :FabricaMensagensNotificacaoPadrao
        participant E as :EmailCanalNotificacao
        participant I as :NotificacaoInternaCanal
    end

    C->>S: criar(request)
    activate S
    S->>S: persistir(Aluguel)
    S->>G: publicar(NotificacaoEvento)
    activate G
    G->>O: atualizar(evento)
    activate O
    O->>F: criarMensagens(evento)
    F-->>O: List~MensagemNotificacao~
    loop [para cada mensagem]
        O->>G: enviarPorCanais(mensagem)
        G->>E: enviar(mensagem)
        G->>I: enviar(mensagem)
        I->>G: registrarNotificacaoInterna()
    end
    deactivate O
    deactivate G
    S-->>C: AluguelResponse
    deactivate S
```

### 2.6 Comportamental — consultar histórico

```mermaid
sequenceDiagram
    participant C as :NotificacaoController
    participant S as :NotificacaoService
    participant G as :GerenciadorNotificacoes

    C->>S: listarTodas()
    activate S
    S->>G: listarHistoricoInterno()
    G-->>S: List~NotificacaoRegistro~
    S-->>C: List~NotificacaoResponse~
    deactivate S
```

---

## 3. Opção 5 — Relatórios Gerenciais

### 3.1 Estrutural — núcleo (Command + Singleton + Factory)

```mermaid
classDiagram
    direction TB

    class RelatorioController {
        +tiposDisponiveis() Set
        +faturamentoMensal() Object
        +taxaOcupacao() Object
        +clientesFrequentes() Object
        +quartosMaisAlugados() Object
        +receitaPorTipoQuarto() Object
        +historicoReservas() Object
    }

    class RelatorioService {
        -gerenciador : GerenciadorRelatorios
        +gerar(tipo, parametros) RelatorioResultado
        +tiposDisponiveis() Set
    }

    class GerenciadorRelatorios <<Singleton>> {
        -instancia {static} : GerenciadorRelatorios
        -relatorioFactory : RelatorioFactory
        +getInstance() {static} GerenciadorRelatorios
        +executar(command) RelatorioResultado
        +getTiposDisponiveis() Set
    }

    class GerarRelatorioCommand <<Command>> {
        -tipo : String
        -parametros : Map
        +executar(factory) Object
    }

    class RelatorioFactory <<Factory>> {
        -estrategias : Map
        +criar(tipo) RelatorioStrategy
        +getTiposDisponiveis() Set
    }

    class RelatorioStrategy <<interface>> {
        <<Strategy>>
        +getTipo() String
        +gerar(parametros) Object
    }

    RelatorioController ..> RelatorioService
    RelatorioService "1" --> "1" GerenciadorRelatorios
    RelatorioService ..> GerarRelatorioCommand : «create»
    GerenciadorRelatorios ..> GerarRelatorioCommand
    GerenciadorRelatorios "1" --> "1" RelatorioFactory
    GerarRelatorioCommand ..> RelatorioFactory
    RelatorioFactory "1" o-- "1..*" RelatorioStrategy
```

### 3.2 Estrutural — padrão Strategy (implementações)

```mermaid
classDiagram
    direction TB

    class RelatorioStrategy <<interface>> {
        <<Strategy>>
        +getTipo() String
        +gerar(parametros) Object
    }

    class FaturamentoMensalStrategy
    class TaxaOcupacaoStrategy
    class ClientesFrequentesStrategy
    class QuartosMaisAlugadosStrategy
    class ReceitaPorTipoQuartoStrategy
    class HistoricoReservasStrategy

    class AluguelRepository <<Repository>> {
        +buscarFaturamentoMensal()
        +buscarOcupacaoPorQuarto()
        +buscarClientesFrequentes()
        +buscarQuartosMaisAlugados()
        +buscarReceitaPorTipoQuarto()
        +buscarHistoricoReservas()
    }

    RelatorioStrategy <|-- FaturamentoMensalStrategy
    RelatorioStrategy <|-- TaxaOcupacaoStrategy
    RelatorioStrategy <|-- ClientesFrequentesStrategy
    RelatorioStrategy <|-- QuartosMaisAlugadosStrategy
    RelatorioStrategy <|-- ReceitaPorTipoQuartoStrategy
    RelatorioStrategy <|-- HistoricoReservasStrategy

    FaturamentoMensalStrategy --> AluguelRepository
    TaxaOcupacaoStrategy --> AluguelRepository
    ClientesFrequentesStrategy --> AluguelRepository
    QuartosMaisAlugadosStrategy --> AluguelRepository
    ReceitaPorTipoQuartoStrategy --> AluguelRepository
    HistoricoReservasStrategy --> AluguelRepository
```

### 3.3 Estrutural — padrão Decorator e saída

```mermaid
classDiagram
    direction LR

    class GerenciadorRelatorios <<Singleton>> {
        +executar(command) RelatorioResultado
    }

    class RelatorioDecorator <<abstract>> {
        <<Decorator>>
        #resultado : RelatorioResultado
        +decorar()* RelatorioResultado
    }

    class CabecalhoRelatorioDecorator {
        +decorar() RelatorioResultado
    }

    class RelatorioResultado {
        -tipo : String
        -titulo : String
        -geradoEm : LocalDateTime
        -dados : Object
    }

    class FaturamentoMensalDTO <<DTO>>
    class TaxaOcupacaoDTO <<DTO>>
    class ClienteFrequenteDTO <<DTO>>
    class QuartoMaisAlugadoDTO <<DTO>>
    class ReceitaTipoQuartoDTO <<DTO>>
    class AluguelResponse <<DTO>>

    RelatorioDecorator <|-- CabecalhoRelatorioDecorator
    RelatorioDecorator o-- RelatorioResultado
    GerenciadorRelatorios ..> CabecalhoRelatorioDecorator
    GerenciadorRelatorios ..> RelatorioResultado
    RelatorioResultado o-- FaturamentoMensalDTO
    RelatorioResultado o-- TaxaOcupacaoDTO
    RelatorioResultado o-- ClienteFrequenteDTO
    RelatorioResultado o-- QuartoMaisAlugadoDTO
    RelatorioResultado o-- ReceitaTipoQuartoDTO
    RelatorioResultado o-- AluguelResponse
```

### 3.4 Comportamental — gerar relatório

```mermaid
sequenceDiagram
    participant C as :RelatorioController
    participant S as :RelatorioService
    participant Cmd as :GerarRelatorioCommand
    participant G as :GerenciadorRelatorios
    participant F as :RelatorioFactory
    participant St as :FaturamentoMensalStrategy
    participant R as :AluguelRepository
    participant D as :CabecalhoRelatorioDecorator

    C->>S: gerar(tipo, parametros)
    activate S
    S->>Cmd: «create»
    S->>G: executar(command)
    activate G
    G->>Cmd: executar(factory)
    Cmd->>F: criar(tipo)
    F-->>Cmd: strategy
    Cmd->>St: gerar(parametros)
    St->>R: buscarFaturamentoMensal()
    R-->>St: dados
    St-->>Cmd: List~DTO~
    Cmd-->>G: dados
    G->>D: decorar()
    D-->>G: RelatorioResultado
    G-->>S: RelatorioResultado
    deactivate G
    S-->>C: RelatorioResultado
    deactivate S
```

---

## 4. Singleton — requisito obrigatório

```mermaid
classDiagram
    direction TB

    class ConfiguracaoReservas <<Singleton>> {
        -instancia {static}
        +getInstance() {static}
    }

    class GerenciadorNotificacoes <<Singleton>> {
        -instancia {static}
        +getInstance() {static}
        +publicar() void
    }

    class GerenciadorRelatorios <<Singleton>> {
        -instancia {static}
        +getInstance() {static}
        +executar() RelatorioResultado
    }

    class AluguelService
    class NotificacaoService
    class RelatorioService

    AluguelService --> ConfiguracaoReservas
    AluguelService --> GerenciadorNotificacoes
    NotificacaoService --> GerenciadorNotificacoes
    RelatorioService --> GerenciadorRelatorios
```

---

## 5. Estereótipos UML × padrões GoF

```mermaid
classDiagram
    class Singleton <<Singleton>>
    class Observer <<Observer>>
    class Strategy <<Strategy>>
    class Factory <<Factory>>
    class Command <<Command>>
    class Decorator <<Decorator>>

    note for Singleton "ConfiguracaoReservas\nGerenciadorNotificacoes\nGerenciadorRelatorios"
    note for Observer "ObservadorNotificacao\nDespachanteNotificacaoObserver"
    note for Strategy "CanalNotificacao + 4 canais\nRelatorioStrategy + 6 strategies"
    note for Factory "FabricaMensagensNotificacao\nRelatorioFactory"
    note for Command "GerarRelatorioCommand"
    note for Decorator "RelatorioDecorator\nCabecalhoRelatorioDecorator"
```
