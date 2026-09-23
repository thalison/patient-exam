# Patient Exam API

API REST para cadastro e gerenciamento de exames, desenvolvida com Node.js, Express e MySQL.

## 🎯 Sobre o projeto

O Patient Exam API é uma aplicação backend criada para simular o sistema de uma clínica médica, permitindo cadastrar e gerenciar exames de pacientes por meio de uma API REST.

O projeto foi desenvolvido com foco em boas práticas de organização, validação de dados e separação de responsabilidades.

## 🛠️ Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript no backend
- **Express** — framework utilizado para construção da API REST
- **MySQL** — banco de dados relacional
- **mysql2** — conexão entre a aplicação Node.js e o MySQL
- **dotenv** — gerenciamento das variáveis de ambiente
- **Postman** — testes dos endpoints da API
- **Git e GitHub** — controle de versão e hospedagem do projeto

## 📁 Estrutura do projeto

```text
patient-exam/
├── controllers/
│   └── examController.js
├── database/
│   └── connection.js
├── routes/
│   └── examRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

### Organização

- **controllers/** — contém as regras e ações executadas pela API.
- **database/** — responsável pela conexão com o banco de dados MySQL.
- **routes/** — define os endpoints disponíveis na API.
- **server.js** — configura o Express, registra as rotas e inicia o servidor.
- **.env.example** — exemplo das variáveis de ambiente necessárias para executar o projeto.

## ⚙️ Instalação e configuração

### 1. Clonar o projeto

```bash
git clone https://github.com/thalison/patient-exam.git
cd patient-exam
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=patient_exam
DB_PORT=3306
```

### 4. Criar o banco de dados

No MySQL, crie o banco de dados:

```sql
CREATE DATABASE patient_exam;
```

Em seguida, crie a tabela `exams`:

```sql
CREATE TABLE exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    exam_name VARCHAR(150) NOT NULL,
    exam_date DATE NOT NULL,
    exam_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ▶️ Executando a API

Após configurar o banco de dados e o arquivo `.env`, execute o servidor com:

```bash
node server.js
```

Se tudo estiver configurado corretamente, será exibida a mensagem:

```text
Servidor iniciado em http://localhost:3000
```

A API estará disponível em:

```text
http://localhost:3000
```

Para interromper o servidor, pressione:

```text
Ctrl + C
```

## 📡 Endpoints

### Criar um exame

**POST** `/exams`

Cadastra um novo exame para um paciente.

#### Corpo da requisição

```json
{
  "patient_name": "João da Silva",
  "phone": "27999999999",
  "exam_name": "Ultrassonografia abdominal",
  "exam_date": "2026-10-15",
  "exam_time": "14:30"
}
```

#### Resposta de sucesso

**HTTP 201 Created**

```json
{
  "message": "Exame criado com sucesso",
  "id": 1
}
```

#### Validações

A API verifica:

- Todos os campos obrigatórios foram preenchidos.
- O telefone possui formato válido.
- A data possui formato válido.
- O horário possui formato válido.
- Não existe outro exame cadastrado para a mesma data e horário.

### Listar todos os exames

**GET** `/exams`

Retorna todos os exames cadastrados no banco de dados.

#### Resposta de sucesso

**HTTP 200 OK**

```json
[
  {
    "id": 1,
    "patient_name": "João da Silva",
    "phone": "27999999999",
    "exam_name": "Ultrassonografia abdominal",
    "exam_date": "2026-10-15",
    "exam_time": "14:30:00",
    "created_at": "2026-09-23T12:00:00.000Z"
  }
]
```

Caso não existam exames cadastrados, a API retorna uma lista vazia:

```json
[]
```

### Buscar um exame pelo ID

**GET** `/exams/:id`

Retorna os dados de um exame específico.

O `:id` representa o identificador do exame no banco de dados.

#### Exemplo

```text
GET /exams/1
```

#### Resposta de sucesso

**HTTP 200 OK**

```json
{
  "id": 1,
  "patient_name": "João da Silva",
  "phone": "27999999999",
  "exam_name": "Ultrassonografia abdominal",
  "exam_date": "2026-10-15",
  "exam_time": "14:30:00",
  "created_at": "2026-09-23T12:00:00.000Z"
}
```

#### Exame não encontrado

**HTTP 404 Not Found**

```json
{
  "message": "Exame não encontrado"
}
```

### Atualizar um exame

**PUT** `/exams/:id`

Atualiza os dados de um exame existente.

O `:id` representa o identificador do exame que será atualizado.

#### Exemplo

```text
PUT /exams/1
```

#### Corpo da requisição

```json
{
  "patient_name": "João da Silva",
  "phone": "27988888888",
  "exam_name": "Ultrassonografia abdominal",
  "exam_date": "2026-10-15",
  "exam_time": "15:00"
}
```

#### Resposta de sucesso

**HTTP 200 OK**

```json
{
  "message": "Exame atualizado com sucesso"
}
```

#### Validações

As mesmas validações utilizadas no cadastro também são aplicadas durante a atualização.

Além disso, a API verifica se o novo horário não está sendo utilizado por outro exame.

#### Exame não encontrado

**HTTP 404 Not Found**

```json
{
  "message": "Exame não encontrado"
}
```

### Excluir um exame

**DELETE** `/exams/:id`

Exclui um exame existente pelo seu ID.

#### Exemplo

```text id="n9x2vd"
DELETE /exams/1
```

#### Resposta de sucesso

**HTTP 200 OK**

```json id="k3v7qa"
{
  "message": "Exame excluído com sucesso"
}
```

#### Exame não encontrado

**HTTP 404 Not Found**

```json id="j6m1rx"
{
  "message": "Exame não encontrado"
}
```

## 🧪 Testes realizados

Os endpoints foram testados utilizando o Postman, incluindo cenários de sucesso e de erro.

### Testes de cadastro

- Cadastro de exame com dados válidos
- Validação de telefone inválido
- Validação de horário inválido
- Validação de data inválida
- Validação de campos obrigatórios
- Impedimento de dois exames no mesmo horário e data
- Permissão de exames diferentes na mesma data, desde que em horários diferentes

### Testes de consulta

- Listagem de todos os exames
- Busca de exame por ID existente
- Busca de exame por ID inexistente

### Testes de atualização

- Atualização com dados válidos
- Validação dos dados durante a atualização
- Impedimento de conflito de horário com outro exame
- Permissão para manter o próprio horário durante a atualização
- Tentativa de atualização de exame inexistente

### Testes de exclusão

- Exclusão de exame existente
- Tentativa de exclusão de exame inexistente
