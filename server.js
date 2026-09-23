const express = require("express");

const app = express();
const PORT = 3000;

// Permite receber JSON
app.use(express.json());

// Importamos as rotas de exames
const examRoutes = require("./routes/examRoutes");

// Registramos as rotas na aplicação
app.use(examRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
