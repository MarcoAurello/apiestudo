# Painel Acadêmico — Alunos, Turmas e Matérias

Aplicação desenvolvida na disciplina **Programação para Frameworks Web**, ministrada pelo professor **Thiago Rodrigues**.

Ela tem duas partes, que rodam ao mesmo tempo:

| Parte | O que é | Tecnologias | Endereço |
|---|---|---|---|
| **Back-end (API)** | Recebe os pedidos e grava/lê os dados no banco | Node.js, Express 5, Prisma 7, MySQL, Zod | http://localhost:3001 |
| **Front-end (telas)** | As páginas que você abre no navegador | React 19, Vite 8, React Router | http://localhost:5174 |

```
Navegador  ──►  Front-end (5174)  ──►  API (3001)  ──►  MySQL (3306)
                 as telas              as regras         os dados
```

O front-end **não fala direto com o banco**: ele sempre pede à API, e a API é quem conversa com o MySQL.

---

## Sumário

1. [O que você precisa ter instalado](#1-o-que-você-precisa-ter-instalado)
2. [Onde fica cada pasta](#2-onde-fica-cada-pasta)
3. [Subindo o back-end (API)](#3-subindo-o-back-end-api)
4. [Subindo o front-end (telas)](#4-subindo-o-front-end-telas)
5. [Resumo rápido (para quem já configurou uma vez)](#5-resumo-rápido-para-quem-já-configurou-uma-vez)
6. [Explicação de cada página](#6-explicação-de-cada-página)
7. [Como os dados se relacionam](#7-como-os-dados-se-relacionam)
8. [Rotas da API](#8-rotas-da-api)
9. [Scripts disponíveis](#9-scripts-disponíveis)
10. [Problemas comuns e como resolver](#10-problemas-comuns-e-como-resolver)
11. [Estrutura do código](#11-estrutura-do-código)

---

## 1. O que você precisa ter instalado

| Programa | Versão | Para que serve | Como conferir |
|---|---|---|---|
| **Node.js** | 22 LTS (mínimo 20.19) | Roda o JavaScript fora do navegador (API e Vite) | `node -v` |
| **npm** | vem junto com o Node | Instala as bibliotecas do projeto | `npm -v` |
| **MySQL Server** | 8.x | O banco de dados | `mysql --version` |
| **Git** (opcional) | qualquer | Baixar o projeto do GitHub | `git --version` |
| **VS Code** (recomendado) | qualquer | Editar o código e abrir terminais | — |

- Node.js: baixe a versão **LTS** em https://nodejs.org
- MySQL: baixe o **MySQL Installer** em https://dev.mysql.com/downloads/installer/ e, durante a instalação, **anote a senha do usuário `root`** — você vai precisar dela.

> 💡 **Terminal** é aquela janela de texto onde se digitam comandos. No VS Code, abra com **Ctrl + '** (aspas simples) ou pelo menu *Terminal > New Terminal*. Todos os comandos deste guia são digitados lá, **um de cada vez**, apertando Enter no final.

Antes de seguir, garanta que o **MySQL está ligado**. No Windows: tecla Windows → digite **Serviços** → procure **MySQL80** → o status deve ser **Em execução** (se não estiver, clique com o botão direito → **Iniciar**).

---

## 2. Onde fica cada pasta

```
prog_frameworks_web_terca_2026.2-main/          ← pasta "de fora"
├── prog_frameworks_web_terca_2026.2-main/      ← BACK-END (API)  — este README está aqui
└── frontend-alunos/                            ← FRONT-END (telas)
```

São **dois projetos separados**, cada um com seu próprio `package.json`. Por isso cada um é instalado e iniciado no **seu próprio terminal**.

> Se você baixou só o back-end pelo GitHub, o front-end não vem junto (ele fica numa pasta irmã). Peça a pasta `frontend-alunos` a quem te passou o projeto.

---

## 3. Subindo o back-end (API)

Abra um terminal **dentro da pasta do back-end** (`prog_frameworks_web_terca_2026.2-main/prog_frameworks_web_terca_2026.2-main`).
No VS Code: *File > Open Folder* e escolha essa pasta; o terminal já abre nela.

### 3.1. Instalar as bibliotecas

```bash
npm install
```

Cria a pasta `node_modules` com tudo o que o projeto usa. Pode demorar um ou dois minutos. Só é preciso rodar **na primeira vez** (ou quando o `package.json` mudar).

### 3.2. Criar o arquivo `.env` (configurações)

Na raiz do back-end (ao lado do `package.json`), crie um arquivo chamado exatamente **`.env`** com este conteúdo, **trocando `SUA_SENHA` pela senha do root do seu MySQL** (nos dois lugares):

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/univ"

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUA_SENHA
DB_NAME=univ

PORT=3001
```

O que cada linha significa:

| Variável | Significado |
|---|---|
| `DATABASE_URL` | Endereço completo do banco, usado pelos **comandos do Prisma** (migrações, seed). Formato: `mysql://USUARIO:SENHA@SERVIDOR:PORTA/NOME_DO_BANCO` |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Os mesmos dados, separados, usados pela **API quando está rodando** |
| `PORT` | Porta da API. **Use 3001** — o front-end está configurado para procurar a API nela |

> ⚠️ A senha precisa estar **igual** em `DATABASE_URL` e em `DB_PASSWORD`. Esquecer de trocar uma delas é o erro mais comum (veja a seção 10).
>
> 🔒 O `.env` contém a sua senha e **não vai para o GitHub** (está no `.gitignore`). Cada pessoa cria o seu.

### 3.3. Criar as tabelas no banco

```bash
npx prisma migrate deploy
```

Executa, em ordem, os arquivos da pasta `prisma/migrations`, criando o banco `univ` e as tabelas `Aluno`, `Turma`, `Materia` e `MateriaTurma`. Se aparecer `All migrations have been successfully applied`, deu certo.

### 3.4. Gerar o Prisma Client

```bash
npx prisma generate
```

Gera o código que a API usa para conversar com o banco (é o que faz `prisma.aluno`, `prisma.turma` etc. existirem). **Rode sempre depois do `npm install` e depois de qualquer mudança no `prisma/schema.prisma`.**

### 3.5. Colocar dados de exemplo (opcional, recomendado)

```bash
npm run seed
```

Cadastra 5 turmas e 5 matérias de exemplo. Pode rodar quantas vezes quiser: ele **só cria o que estiver faltando**, não apaga nem duplica nada.

### 3.6. Ligar a API

```bash
npm run dev
```

Deve aparecer `Server running on port 3001`. **Deixe esse terminal aberto** — fechar o terminal desliga a API.
O `nodemon` reinicia a API sozinho sempre que você salva um arquivo `.js`.

Para conferir, abra no navegador: http://localhost:3001/turmas — deve aparecer um texto com a lista de turmas.

---

## 4. Subindo o front-end (telas)

Abra um **segundo terminal** (no VS Code, o botão **+** do painel de terminal) e entre na pasta do front-end:

```bash
cd ../frontend-alunos
```

> Se o seu terminal abriu em outro lugar, use o caminho completo, por exemplo:
> `cd "C:\Users\SEU_USUARIO\Downloads\prog_frameworks_web_terca_2026.2-main\frontend-alunos"`

### 4.1. Instalar as bibliotecas (só na primeira vez)

```bash
npm install
```

### 4.2. Ligar o front-end

```bash
npm run dev
```

Deve aparecer algo como `Local: http://localhost:5174/`. Abra esse endereço no navegador. **Deixe esse terminal aberto também.**

> O front-end **precisa da API ligada** (seção 3.6). Se a API estiver desligada, as telas mostram o aviso *"Não foi possível conectar à API. Ela está rodando na porta 3001?"*.

#### Como o front encontra a API

No arquivo `frontend-alunos/vite.config.js` há um **proxy**: toda chamada que o front faz para `/api/...` é repassada para `http://localhost:3001/...`. Por exemplo, `/api/turmas` vira `http://localhost:3001/turmas`. Por isso a API não precisa de configuração de CORS, e a porta da API **precisa ser 3001**.

---

## 5. Resumo rápido (para quem já configurou uma vez)

Com o MySQL ligado, são **dois terminais**:

**Terminal 1 — API** (pasta do back-end):
```bash
npm run dev
```

**Terminal 2 — telas** (pasta `frontend-alunos`):
```bash
npm run dev
```

Abra http://localhost:5174 e pronto. Para desligar, aperte **Ctrl + C** em cada terminal.

---

## 6. Explicação de cada página

Todas as listas têm o mesmo jeito de usar:
- **Paginação**: escolha quantos itens por página (5, 10 ou 20) e navegue com *Anterior / Próxima*.
- **Ordenação**: clique no título de uma coluna para ordenar; clique de novo para inverter (▲ crescente, ▼ decrescente).
- **Total**: ao lado do título aparece quantos registros existem no banco (não só na página).
- **Mensagens**: avisos verdes confirmam o que deu certo; avisos vermelhos mostram o erro que a API devolveu (ex.: *"Nome muito curto."*, *"Já existe uma turma com esse número"*).

### 🏠 Início — `/`

Tela de entrada, com três cartões: **Alunos**, **Turmas** e **Matérias**. Clique em um para abrir o cadastro correspondente. Em todas as outras telas há um link **← Início** (ou **← Turmas**/**← Alunos**) no topo para voltar.

### 👤 Alunos — `/alunos`

Cadastro completo de alunos.

| Área | O que faz |
|---|---|
| **Lista** (esquerda) | Mostra Id, Nome, E-mail e data de criação. **Clique na linha** de um aluno para abrir a tela dele. |
| **Editar** (botão na linha) | Carrega o aluno no formulário da direita para alterar nome e/ou e-mail. Só os campos alterados são enviados. |
| **Excluir** (botão na linha) | Pede confirmação e apaga o aluno. |
| **Novo aluno** (direita) | Formulário com Nome e E-mail. Regras: nome com pelo menos 3 letras, e-mail válido e **e-mail único** (não pode repetir). |
| **Buscar por id** (direita) | Digite o número do aluno para ver os dados dele. Se não existir, mostra *"Aluno não encontrado"*. |

### 👤 Tela do aluno — `/alunos/:id`

Aberta ao clicar num aluno da lista.

- **Matérias para estudo**: as matérias da **turma** do aluno. O aluno não escolhe matérias sozinho — ele estuda o que estiver vinculado à turma dele. Se ele não tiver turma, ou a turma não tiver matérias, a tela explica o motivo.
- **Dados do aluno**: id, nome, e-mail, data de cadastro e a **turma** (clicável — leva para a tela da turma).

### 🏫 Turmas — `/turmas`

Cadastro completo de turmas, igual ao de alunos, com os campos **Nome** e **Número**.

- Regras: nome com pelo menos 3 letras; número inteiro, maior que zero e **único** (duas turmas não podem ter o mesmo número).
- **Clique na linha** de uma turma para abrir a tela da turma.

### 🏫 Tela da turma — `/turmas/:id`

Aberta ao clicar numa turma da lista. É onde se organiza **quem está na turma** e **o que a turma estuda**.

| Área | O que faz |
|---|---|
| **Dados da turma** (direita) | Id, nome, número, quantidade de alunos e de matérias. |
| **Alunos da turma** | Lista os alunos da turma. **Remover da turma** tira o aluno da turma (o aluno **não** é apagado, só fica sem turma). |
| **Cadastrar alunos na turma** | Abre a lista de **todos os alunos do banco**, com filtro por nome/e-mail, mostrando a turma atual de cada um: <br>• *Sem turma* → botão **Adicionar** <br>• *Em outra turma* → botão **Transferir para cá** (pede confirmação; o aluno sai da turma antiga) <br>• *Nesta turma* → já adicionado |
| **Matérias da turma** | Lista as matérias vinculadas. **Desvincular** tira a matéria desta turma (a matéria **não** é apagada). |
| **Cadastrar matérias na turma** | Abre a lista de **todas as matérias do banco**, com filtro, para **Vincular** à turma. As já vinculadas aparecem como *Nesta turma*. |

> Tudo o que é vinculado aqui aparece automaticamente na tela de cada aluno da turma, em **Matérias para estudo**.

### 📚 Matérias — `/materias`

Cadastro completo de matérias, igual aos outros, com o campo **Nome** (mínimo 3 letras). Para dizer **quais turmas estudam cada matéria**, use a tela da turma.

---

## 7. Como os dados se relacionam

```
            ┌──────────┐ 1       N ┌──────────┐
            │  Turma   │──────────►│  Aluno   │   cada aluno está em NO MÁXIMO uma turma
            └──────────┘           └──────────┘   (coluna turmaId na tabela Aluno)
                 │ 1
                 │
                 │ N
          ┌──────────────┐ N     1 ┌──────────┐
          │ MateriaTurma │◄────────│ Materia  │   uma turma tem várias matérias e uma
          └──────────────┘         └──────────┘   matéria pode estar em várias turmas
```

| Tabela | Campos | Observações |
|---|---|---|
| `Aluno` | id, nome, email (único), createdAt, updatedAt, turmaId (opcional) | Se a turma for apagada, o aluno fica sem turma (`turmaId` vira vazio) |
| `Turma` | id, nome, numero (único) | |
| `Materia` | id, nome | |
| `MateriaTurma` | id, turmaId, materiaId | Tabela de ligação. O par turma + matéria não se repete. Apagar uma turma ou matéria apaga só os vínculos dela |

- **Aluno ↔ Turma é 1:N** → basta uma coluna (`turmaId`) dentro do aluno.
- **Turma ↔ Matéria é N:N** → precisa de uma tabela no meio (`MateriaTurma`).
- **Matérias do aluno** = matérias da turma dele (não ficam gravadas no aluno).

A definição de tudo isso está em `prisma/schema.prisma`.

---

## 8. Rotas da API

Base: `http://localhost:3001`. Erros sempre voltam como `{ "error": "mensagem" }` ou, em validação, `{ "error": [{ "campo": "...", "message": "..." }] }`.

### Alunos

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | `/alunos?page=1&pageSize=10&orderBy=nome&order=asc` | Lista com paginação, ordenação e `total` | 200 |
| GET | `/alunos/:id` | Um aluno, com `turma` e `materias` | 200, 404 |
| POST | `/alunos` | Cadastra. Corpo: `{ "nome": "...", "email": "..." }` | 201, 400 |
| PATCH | `/alunos/:id` | Altera nome e/ou e-mail | 200, 400, 404, 409 (e-mail repetido) |
| DELETE | `/alunos/:id` | Exclui | 204, 404 |

`orderBy` aceita `id`, `nome`, `email`, `createdAt`, `updatedAt`. Valores inválidos voltam para o padrão (id crescente), sem erro.

### Turmas

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | `/turmas` | Lista (mesmos parâmetros; `orderBy`: `id`, `nome`, `numero`) | 200 |
| GET | `/turmas/:id` | Uma turma, com `alunos` e `materias` | 200, 404 |
| POST | `/turmas` | Cadastra. Corpo: `{ "nome": "...", "numero": 101 }` | 201, 400, 409 (número repetido) |
| PATCH | `/turmas/:id` | Altera nome e/ou número | 200, 400, 404, 409 |
| DELETE | `/turmas/:id` | Exclui | 204, 404 |
| POST | `/turmas/:id/alunos` | Coloca/transfere um aluno. Corpo: `{ "alunoId": 9 }` | 200, 400, 404, 409 (já está) |
| DELETE | `/turmas/:id/alunos/:alunoId` | Tira o aluno da turma | 204, 404 |
| GET | `/turmas/:id/materias` | Matérias da turma | 200, 404 |
| POST | `/turmas/:id/materias` | Vincula uma matéria. Corpo: `{ "materiaId": 1 }` | 201, 400, 404, 409 (já vinculada) |
| DELETE | `/turmas/:id/materias/:materiaId` | Desvincula | 204, 404 |

### Matérias

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | `/materias` | Lista (`orderBy`: `id`, `nome`) | 200 |
| GET | `/materias/:id` | Uma matéria | 200, 404 |
| POST | `/materias` | Cadastra. Corpo: `{ "nome": "..." }` | 201, 400 |
| PATCH | `/materias/:id` | Altera o nome | 200, 400, 404 |
| DELETE | `/materias/:id` | Exclui | 204, 404 |

> Para testar as rotas de aluno no **Postman**, importe `postman/API_Alunos.postman_collection.json` (botão *Import*).

---

## 9. Scripts disponíveis

**Back-end** (rodar na pasta do back-end):

| Comando | O que faz |
|---|---|
| `npm run dev` | Liga a API (porta 3001) e reinicia sozinha ao salvar arquivos |
| `npm run seed` | Cadastra as turmas e matérias de exemplo que estiverem faltando |
| `npm run resetDB` | ⚠️ **APAGA TODOS OS DADOS** do banco, recria as tabelas e roda o seed. Use só em banco de estudo |
| `npx prisma migrate deploy` | Aplica as migrações (cria/atualiza as tabelas) |
| `npx prisma generate` | Gera o Prisma Client (depois do `npm install` ou de mudar o schema) |
| `npx prisma migrate dev --name nome_da_mudanca` | Quem **desenvolve**: depois de alterar o `schema.prisma`, cria uma migração nova e aplica |
| `npx prisma studio` | Abre no navegador uma "planilha" para ver e editar os dados das tabelas |

**Front-end** (rodar na pasta `frontend-alunos`):

| Comando | O que faz |
|---|---|
| `npm run dev` | Liga as telas em http://localhost:5174 |
| `npm run build` | Gera a versão final otimizada na pasta `dist` |

---

## 10. Problemas comuns e como resolver

| Mensagem / sintoma | Causa provável | Solução |
|---|---|---|
| `P1000: Authentication failed ... credentials for root are not valid` | Senha errada no `.env` (geralmente na `DATABASE_URL`) | Confira a senha nas **duas** linhas do `.env`. Teste no terminal: `mysql -u root -p` |
| `Can't reach database server at localhost:3306` | MySQL desligado | Ligue o serviço **MySQL80** (seção 1) |
| `Cannot read properties of undefined (reading 'findMany')` | Prisma Client desatualizado | Pare a API (Ctrl + C), rode `npx prisma generate` e ligue de novo |
| `The table ... does not exist` | Migrações não aplicadas | `npx prisma migrate deploy` |
| `Database 'univ' does not exist` | Banco ainda não criado | No MySQL: `CREATE DATABASE univ;` e rode `npx prisma migrate deploy` de novo |
| `EADDRINUSE` ou a API "liga" mas não responde | Porta 3001 ocupada por outro programa (ou por uma API antiga esquecida aberta) | Feche o outro terminal/programa. No Windows, descubra quem usa a porta: `netstat -ano \| findstr :3001` |
| `Port 5174 is already in use` | Outro front-end já está ligado | Feche o terminal antigo do front |
| Tela mostra *"Não foi possível conectar à API..."* | API desligada ou em outra porta | Ligue a API (seção 3.6) com `PORT=3001` no `.env` |
| Mudei o `.env` e nada mudou | O `nodemon` não percebe mudanças no `.env` | Pare a API (Ctrl + C) e rode `npm run dev` de novo |
| `'npm' não é reconhecido como comando` | Node.js não instalado ou terminal aberto antes da instalação | Instale o Node.js e **abra um terminal novo** |

---

## 11. Estrutura do código

### Back-end

```
prisma/
├── schema.prisma           ← definição das tabelas (models) e relações
├── migrations/             ← histórico de alterações do banco (gerado pelo Prisma)
└── seed.js                 ← dados de exemplo
src/
├── index.js                ← liga o Express e registra as rotas
├── databases/prisma.js     ← conexão com o banco
├── routes/                 ← quais URLs existem e qual controller atende cada uma
├── middlewares/            ← validam o corpo da requisição (com os schemas do Zod) antes do controller
├── schemas/                ← regras de validação (Zod): tamanho mínimo, e-mail válido...
├── controllers/            ← leem a requisição, chamam o service e devolvem a resposta/status
├── services/               ← regras de negócio e acesso ao banco (Prisma)
└── errors/                 ← erros personalizados (ApiError e filhos) com status HTTP
postman/                    ← coleção de testes do Postman
```

Caminho de uma requisição: **rota → middleware (validação) → controller → service → Prisma → MySQL**.
Se o service encontra um problema, ele lança um erro personalizado (ex.: `TurmaNaoEncontradaError`, status 404) e o controller transforma isso na resposta.

### Front-end (`frontend-alunos`)

```
src/
├── App.jsx                 ← mapa de páginas (qual endereço abre qual tela)
├── recursos.js             ← configuração de Alunos/Turmas/Matérias: campos, colunas, textos, rota da API
├── services/api.js         ← todas as chamadas à API e o tratamento das mensagens de erro
├── pages/
│   ├── Home.jsx            ← tela inicial com os cartões
│   ├── CrudPage.jsx        ← tela de cadastro usada por Alunos, Turmas e Matérias
│   ├── TurmaDetalhe.jsx    ← tela da turma (alunos e matérias da turma)
│   └── AlunoDetalhe.jsx    ← tela do aluno (turma e matérias para estudo)
├── components/
│   ├── Tabela.jsx          ← tabela com ordenação e botões Editar/Excluir
│   ├── Formulario.jsx      ← formulário de cadastro/edição
│   ├── BuscaPorId.jsx      ← caixa "Buscar por id"
│   └── MateriasDaTurma.jsx ← seção de matérias da tela da turma
└── index.css               ← aparência (cores, tamanhos, modo escuro)
```

Para criar um **novo cadastro** no front (ex.: Professores), basta acrescentar uma entrada em `recursos.js`, uma rota em `App.jsx` e um cartão em `Home.jsx` — a tela `CrudPage.jsx` é reaproveitada.

---

**Disciplina:** Programação para Frameworks Web
**Professor:** Thiago Rodrigues
