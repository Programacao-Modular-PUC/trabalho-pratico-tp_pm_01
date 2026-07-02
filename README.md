# Sistema de Hospedagem - API REST

## 📖 Sobre o Projeto
Este projeto é um Sistema de Informação Modular desenvolvido como trabalho prático para a disciplina de Programação Modular. O objetivo é fornecer uma solução eficiente e escalável para o gerenciamento de hospedagens em residências locais na região de Maraú - BA.

O sistema permite o gerenciamento de residências, quartos, clientes e aluguéis, além de realizar cálculos automáticos de diárias e emissão de recibos, utilizando conceitos avançados de Programação Orientada a Objetos (POO).

## 🚀 Tecnologias e Arquitetura
O projeto foi estruturado utilizando o padrão de arquitetura em camadas (Controller, Service, Repository, Model) para garantir o desacoplamento e a manutenibilidade do código.

- Linguagem: Java
- Framework: Spring Boot (API REST)
- Banco de Dados: MySQL/H2 para testes
- Boas Práticas: Programação Orientada a Objetos (POO), Padrões de Projeto, Testes Automatizados

## 📋 Sprint 4 — Padrões de Projeto

A Sprint 4 adicionou duas funcionalidades com padrões de projeto documentados:

| Funcionalidade | Padrões aplicados | Documentação |
|---|---|---|
| Central de Notificações | Observer, Strategy, Factory, **Singleton** | [docs/sprint4-relatorio.md](docs/sprint4-relatorio.md) |
| Relatórios Gerenciais | Strategy, Factory, Command, Decorator, **Singleton** | [docs/sprint4-relatorio.md](docs/sprint4-relatorio.md) |

Diagramas UML e detalhes técnicos: [docs/sprint4-diagramas.md](docs/sprint4-diagramas.md)

## 🧪 Relatório de Testes Realizados

### Visão Geral
Foram identificados e estruturados testes automatizados no módulo backend para validar a inicialização da aplicação, regras de negócio, cálculos de diária, notificações e relatórios gerenciais.

Relatório completo de execução: [RELATORIO_DE_TESTES.md](RELATORIO_DE_TESTES.md)

### Testes Implementados

| Módulo | Arquivo | Cenário validado | Status |
|---|---|---|---|
| Contexto da aplicação | `back/src/test/java/com/example/maraureserve/BackApplicationTests.java` | Inicialização do contexto Spring Boot | Implementado |
| Serviço de aluguel | `back/src/test/java/com/example/maraureserve/services/AluguelServiceTest.java` | Capacidade excedida, berço não permitido, quarto indisponível | Implementado |
| Integração aluguel ↔ notificações | `back/src/test/java/com/example/maraureserve/notifications/AluguelServiceNotificacaoIntegrationTest.java` | Publicação de `RESERVA_CRIADA` ao criar reserva | Implementado |
| Cálculo de diária | `back/src/test/java/com/example/maraureserve/services/QuartoTest.java` | Cálculo de diária para quartos individual, duplo e família | Implementado |
| Central de notificações | `back/src/test/java/com/example/maraureserve/notifications/GerenciadorNotificacoesTest.java` | Singleton, Observer, Strategy e fluxo interno | Implementado |
| Relatórios — Factory | `back/src/test/java/com/example/maraureserve/reports/RelatorioFactoryTest.java` | Resolução de estratégias por tipo | Implementado |
| Relatórios — Command | `back/src/test/java/com/example/maraureserve/reports/command/GerarRelatorioCommandTest.java` | Encapsulamento da geração | Implementado |
| Relatórios — Singleton/Decorator | `back/src/test/java/com/example/maraureserve/reports/GerenciadorRelatoriosTest.java` | Instância única e cabeçalho decorado | Implementado |
| Relatórios — Strategy | `back/src/test/java/com/example/maraureserve/reports/impl/FaturamentoMensalStrategyTest.java` | Faturamento mensal com e sem filtro | Implementado |

### Comandos para Execução

No diretório do backend, execute:

```bash
./mvnw test
```

Ou, no ambiente Windows:

```powershell
cd back
.\mvnw.cmd test
```

### Observações
- O projeto possui **26 testes automatizados** no backend (Sprint 3 + Sprint 4)
- A execução dos testes pode ser feita localmente com o Maven Wrapper, garantindo compatibilidade com o ambiente do projeto.

## 👥 Equipe
- Ítalo Eduardo Carneiro da Silva
- Guilherme Augusto Martins de Carvalho
- Luca Moreira Ribeiro Mazala de Araujo
- João Victor Leite Soares
