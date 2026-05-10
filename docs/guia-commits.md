# Guia de commits da branch `teste-sprint2`

Comparacao feita contra a branch `developer`.

## Resumo

- Branch atual: `teste-sprint2`
- Base de comparacao: `developer`
- Arquivos reais adicionados ou alterados: 35
- Arquivos em `back/.m2repo`: 1193 arquivos adicionados

> Atencao: `back/.m2repo` parece ser cache local do Maven. O ideal e nao incluir essa pasta nos commits, porque ela contem dependencias baixadas automaticamente e aumenta muito o tamanho do repositorio.

## Arquivos adicionados

```text
back/.dockerignore
back/src/main/java/com/example/maraureserve/config/DataSeeder.java
back/src/main/java/com/example/maraureserve/models/TipoCamaCasal.java
front-end/.dockerignore
front-end/src/services/api.js
front-end/src/services/auth.js
```

## Arquivos alterados

```text
back/Dockerfile
back/pom.xml
back/src/main/java/com/example/maraureserve/config/SecurityConfig.java
back/src/main/java/com/example/maraureserve/dtos/AluguelRequest.java
back/src/main/java/com/example/maraureserve/dtos/AluguelResponse.java
back/src/main/java/com/example/maraureserve/dtos/QuartoRequest.java
back/src/main/java/com/example/maraureserve/dtos/QuartoResponse.java
back/src/main/java/com/example/maraureserve/models/Aluguel.java
back/src/main/java/com/example/maraureserve/models/Quarto.java
back/src/main/java/com/example/maraureserve/models/TipoQuarto.java
back/src/main/java/com/example/maraureserve/services/AluguelService.java
back/src/main/java/com/example/maraureserve/services/QuartoService.java
back/src/main/resources/application.properties
docker-compose.yml
docs/readme.md
front-end/Dockerfile
front-end/src/modules/guest/GuestLayout.jsx
front-end/src/modules/guest/pages/Dashboard.jsx
front-end/src/modules/guest/pages/Profile.jsx
front-end/src/modules/guest/pages/Reservations.jsx
front-end/src/modules/host/HostLayout.jsx
front-end/src/modules/host/pages/AddResidence.jsx
front-end/src/modules/host/pages/Bookings.jsx
front-end/src/modules/host/pages/Residences.jsx
front-end/src/pages/acommodations.jsx
front-end/src/pages/home.jsx
front-end/src/pages/login.jsx
front-end/src/pages/register.jsx
front-end/vite.config.js
```

## Commits sugeridos para 4 participantes

### 1. Italo Eduardo Carneiro da Silva

Responsabilidade: infraestrutura Docker e configuracao do ambiente.

Mensagem sugerida:

```bash
git commit -m "chore: configura ambiente docker da aplicacao"
```

Arquivos sugeridos:

```text
docker-compose.yml
back/.dockerignore
back/Dockerfile
front-end/.dockerignore
front-end/Dockerfile
front-end/vite.config.js
back/src/main/resources/application.properties
```

### 2. Guilherme Augusto Martins de Carvalho

Responsabilidade: regras de quartos, tipos de quarto e dados iniciais.

Mensagem sugerida:

```bash
git commit -m "feat: aprimora cadastro e dados de quartos"
```

Arquivos sugeridos:

```text
back/src/main/java/com/example/maraureserve/config/DataSeeder.java
back/src/main/java/com/example/maraureserve/dtos/QuartoRequest.java
back/src/main/java/com/example/maraureserve/dtos/QuartoResponse.java
back/src/main/java/com/example/maraureserve/models/Quarto.java
back/src/main/java/com/example/maraureserve/models/TipoCamaCasal.java
back/src/main/java/com/example/maraureserve/models/TipoQuarto.java
back/src/main/java/com/example/maraureserve/services/QuartoService.java
```

### 3. Luca Moreira Ribeiro Mazala de Araujo

Responsabilidade: reservas/alugueis, autenticacao e integracao com API.

Mensagem sugerida:

```bash
git commit -m "feat: integra reservas e autenticacao com api"
```

Arquivos sugeridos:

```text
back/pom.xml
back/src/main/java/com/example/maraureserve/config/SecurityConfig.java
back/src/main/java/com/example/maraureserve/dtos/AluguelRequest.java
back/src/main/java/com/example/maraureserve/dtos/AluguelResponse.java
back/src/main/java/com/example/maraureserve/models/Aluguel.java
back/src/main/java/com/example/maraureserve/services/AluguelService.java
front-end/src/services/api.js
front-end/src/services/auth.js
front-end/src/pages/login.jsx
front-end/src/pages/register.jsx
```

### 4. Joao Victor Leite Soares

Responsabilidade: telas e fluxos do front-end para hospede e anfitriao.

Mensagem sugerida:

```bash
git commit -m "feat: atualiza telas de hospede e anfitriao"
```

Arquivos sugeridos:

```text
front-end/src/modules/guest/GuestLayout.jsx
front-end/src/modules/guest/pages/Dashboard.jsx
front-end/src/modules/guest/pages/Profile.jsx
front-end/src/modules/guest/pages/Reservations.jsx
front-end/src/modules/host/HostLayout.jsx
front-end/src/modules/host/pages/AddResidence.jsx
front-end/src/modules/host/pages/Bookings.jsx
front-end/src/modules/host/pages/Residences.jsx
front-end/src/pages/acommodations.jsx
front-end/src/pages/home.jsx
docs/readme.md
```

## Antes de commitar

Use estes comandos para conferir a branch:

```bash
git status
git diff --name-status developer...HEAD -- . ':!back/.m2repo/**'
```

Se `back/.m2repo` aparecer no status, remova essa pasta do commit antes de enviar a branch:

```bash
git restore --staged back/.m2repo
```

Se a pasta ja tiver sido commitada na branch, o ideal e remover do versionamento e adicionar regra no `.gitignore`.

