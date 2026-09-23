require("dotenv").config();
// Importamos o mysql2.
//
// Essa biblioteca permite que nosso Node.js
// converse com o banco MySQL.
const mysql = require("mysql2");

// Criamos um "pool" de conexões.
//
// Em vez de abrir uma nova conexão com o banco
// para cada requisição, o pool mantém algumas
// conexões disponíveis para serem reutilizadas.
//
// Isso é mais adequado para uma aplicação real.
const pool = mysql.createPool({
  // Endereço do servidor MySQL.
  // Como estamos usando o XAMPP na mesma máquina,
  // o MySQL está rodando localmente.
  host: process.env.DB_HOST,
  // Usuário padrão do MySQL no XAMPP.
  user: process.env.DB_USER,
  //Senha do XAMPP ou server.
  password: process.env.DB_PASSWORD,
  // Nome do banco que acabamos de criar.
  database: process.env.DB_NAME,
  // Porta padrão do MySQL.
  port: process.env.DB_PORT,
});

// Exportamos o pool.
//
// Assim, outros arquivos do sistema poderão
// importar essa conexão e executar consultas SQL.
module.exports = pool;
