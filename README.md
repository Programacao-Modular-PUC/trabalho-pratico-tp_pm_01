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

## 🧪 Relatório de Testes Realizados

### Visão Geral
Foram identificados e estruturados testes automatizados no módulo backend para validar a inicialização da aplicação, regras de negócio e cálculos de diária.

### Testes Implementados

| Módulo | Arquivo | Cenário validado | Status |
|---|---|---|---|
| Contexto da aplicação | back/src/test/java/com/example/maraureserve/BackApplicationTests.java | Inicialização do contexto Spring Boot | Implementado |
| Serviço de aluguel | back/src/test/java/com/example/maraureserve/services/AluguelServiceTest.java | Capacidade excedida, uso de berço não permitido e quarto indisponível | Implementado |
| Pagamento | back/src/test/java/com/example/maraureserve/services/PagamentoTest.java | Processamento, confirmação e validação de estado do pagamento | Implementado |
| Cálculo de diária | back/src/test/java/com/example/maraureserve/services/QuartoTest.java | Cálculo de diária para quartos individual, duplo e família | Implementado |

### Comandos para Execução

No diretório do backend, execute:

```bash
./mvnw test
```

Ou, no ambiente Windows:

```powershell
mvnw.cmd test
```

### Observações
- O projeto possui testes automatizados no backend, mas ainda não há suíte de testes implementada para o frontend.
- A execução dos testes pode ser feita localmente com o Maven Wrapper, garantindo compatibilidade com o ambiente do projeto.

## 👥 Equipe
- Ítalo Eduardo Carneiro da Silva
- Guilherme Augusto Martins de Carvalho
- Luca Moreira Ribeiro Mazala de Araujo
- João Victor Leite Soares

