const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let products = [];

app.post("/products", (req, res) => {
  const { name, code, brand, category, minStock, resalePrice, maxPeriod } = req.body;

  if (!name || !code || !brand || !category || !minStock || !resalePrice || !maxPeriod) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    code,
    brand,
    category,
    minStock: Number(minStock),
    resalePrice: Number(resalePrice),
    maxPeriod: Number(maxPeriod),
  };

  products.push(newProduct);

  return res.status(201).json({
    message: "Produto cadastrado com sucesso.",
    product: newProduct,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

