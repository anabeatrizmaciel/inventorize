const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

//Interligar com o banco de dados
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

app.post("/produto", (req, res) => {
  const {
    codigo_produto, 
    nome_produto,   
    cod_marca,      
    categoria,      
    preco,          
    qtd_minima,     
    periodo_maximo, 
  } = req.body;

  //Validar dados
  const errors = [];
  if (!nome_produto || typeof nome_produto !== "string" || nome_produto.trim() === "") {
    errors.push("Nome do produto é obrigatório e deve ser uma string válida.");
  }
  if (!codigo_produto || typeof codigo_produto !== "string" || codigo_produto.trim() === "") {
    errors.push("Código do produto é obrigatório e deve ser uma string válida.");
  }
  if (!cod_marca || typeof cod_marca !== "number" || cod_marca <= 0) {
    errors.push("Código da marca é obrigatório e deve ser um número positivo.");
  }
  if (!categoria || typeof categoria !== "string" || categoria.trim() === "") {
    errors.push("Categoria é obrigatória e deve ser uma string válida.");
  }
  if (!qtd_minima || !Number.isInteger(Number(qtd_minima)) || qtd_minima <= 0) {
    errors.push("Quantidade mínima deve ser um número inteiro positivo.");
  }
  if (!preco || isNaN(preco) || preco <= 0) {
    errors.push("Preço deve ser um número positivo.");
  }
  if (!periodo_maximo || !Number.isInteger(Number(periodo_maximo)) || periodo_maximo <= 0) {
    errors.push("Período máximo deve ser um número inteiro positivo.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  //inserir o produto
  const sql = `
    INSERT INTO produto (codigo_produto, nome_produto, cod_marca, categoria, qtd_minima, preco, periodo_maximo) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    codigo_produto.trim(),
    nome_produto.trim(),
    parseInt(cod_marca, 10),
    categoria.trim(),
    parseInt(qtd_minima, 10),
    parseFloat(preco).toFixed(2),
    parseInt(periodo_maximo, 10),
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir produto no banco de dados:", err);
      return res.status(500).json({ error: "Erro ao cadastrar produto. Tente novamente" });
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
