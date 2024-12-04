const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: "127.0.0.1", 
  user: "root", 
  password: "", 
  database: "invetorize", 
  port: 3307, 
};

console.log("Tentando conectar ao banco de dados com a seguinte configuração:", dbConfig);

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    console.error("Detalhes do erro:", err);
    console.log("Configuração usada para conexão:", dbConfig);
    process.exit(1);
  }
  console.log("Conectado ao banco de dados MySQL.");
});

//cadastrar produtos
app.post("/products", (req, res) => {
  const { name, code, brand, category, minStock, resalePrice, maxPeriod } = req.body;

  // Validação dos dadoD
  const errors = [];
  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("Nome do produto é obrigatório e deve ser uma string válida.");
  }
  if (!code || typeof code !== "string" || code.trim() === "") {
    errors.push("Código do produto é obrigatório e deve ser uma string válida.");
  }
  if (!brand || typeof brand !== "string" || brand.trim() === "") {
    errors.push("Marca é obrigatória e deve ser uma string válida.");
  }
  if (!category || typeof category !== "string" || category.trim() === "") {
    errors.push("Categoria é obrigatória e deve ser uma string válida.");
  }
  if (!minStock || !Number.isInteger(Number(minStock)) || minStock <= 0) {
    errors.push("Quantidade mínima deve ser um número inteiro positivo.");
  }
  if (!resalePrice || isNaN(resalePrice) || resalePrice <= 0) {
    errors.push("Preço de revenda deve ser um número positivo.");
  }
  if (!maxPeriod || !Number.isInteger(Number(maxPeriod)) || maxPeriod <= 0) {
    errors.push("Período máximo deve ser um número inteiro positivo.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Query SQL para inserir o produto
  const sql = `
    INSERT INTO produto (nome, codigo, cod_marca, categoria, qtd_minima, preco_revenda, periodo_maximo) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    name.trim(),
    code.trim(),
    brand.trim(),
    category.trim(),
    parseInt(minStock, 10),
    parseFloat(resalePrice).toFixed(2),
    parseInt(maxPeriod, 10),
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir produto no banco de dados:", err);
      return res.status(500).json({ error: "Erro ao cadastrar produto. Tente novamente mais tarde." });
    }

    return res.status(201).json({
      message: "Produto cadastrado com sucesso.",
      product: { id: result.insertId, ...req.body },
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
