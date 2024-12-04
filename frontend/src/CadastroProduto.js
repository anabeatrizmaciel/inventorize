import React, { useState } from "react";
import DropdownList from "./DropdownList";
import "./CadastroProduto.css";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    brand: "",
    category: "",
    minStock: "",
    resalePrice: "",
    maxPeriod: "",
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // estado para armazenar o termo de busca
  const [productList, setProductList] = useState([]); // lista de produtos 
  
  const brandOptions = [
    { value: "brand1", label: "Nestlé" },
    { value: "brand2", label: "Coca-cola" },
    { value: "brand3", label: "Unilever" },
    { value: "brand4", label: "Colgate" },
    { value: "brand5", label: "Danone" },
    { value: "brand6", label: "Procter & Gamble" },
    { value: "brand7", label: "Heinz, Kellogg's" },
    { value: "brand8", label: "Nescafé" },
    { value: "brand9", label: "PepsiCo" },
    { value: "brand10", label: "Sadia" },
    { value: "brand11", label: "Perdigão" },
  ];

  const categoryOptions = [
    { value: "category1", label: "Açougue" },
    { value: "category2", label: "Padaria" },
    { value: "category3", label: "Hortifruti (Frutas e Verduras)" },
    { value: "category4", label: "Frios e Laticínios" },
    { value: "category5", label: "Peixaria" },
    { value: "category6", label: "Mercearia" },
    { value: "category7", label: "Congelados" },
    { value: "category8", label: "Bebidas" },
    { value: "category9", label: "Perfumaria" },
    { value: "category10", label: "Higiene e Limpeza" },
    { value: "category11", label: "Utilidades Domésticas" },
  ];

  const handleDropdownChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      try {
        // envia os dados do formulário para o backend
        const response = await fetch("http://localhost:5000/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Erro ao cadastrar produto: ${errorData.error}`);
        } else {
          const responseData = await response.json();
          alert(responseData.message);
          // resetar os campos do formulário
          setFormData({
            name: "",
            code: "",
            brand: "",
            category: "",
            minStock: "",
            resalePrice: "",
            maxPeriod: "",
          });
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  // função para atualizar os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "O nome do produto é obrigatório.";
    if (!formData.code.trim()) newErrors.code = "O código do produto é obrigatório.";
    if (!formData.brand) newErrors.brand = "A marca é obrigatória.";
    if (!formData.category) newErrors.category = "A categoria é obrigatória.";
    if (!formData.minStock.trim()) newErrors.minStock = "A quantidade mínima é obrigatória.";
    if (!formData.resalePrice.trim()) newErrors.resalePrice = "O preço de revenda é obrigatório.";
    if (!formData.maxPeriod.trim()) newErrors.maxPeriod = "O período máximo é obrigatório.";
    return newErrors;
  };

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.includes(searchTerm)
  );

  return (
    <div className="form-container">
      <h2 className="form-title">CADASTRAR PRODUTO</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Pesquisar produto por nome ou código"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="search-results">
          {searchTerm && filteredProducts.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            filteredProducts.map((product, index) => (
              <div key={index} className="search-result">
                <p>{product.name} - {product.code}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="name"
              placeholder="Digite o nome do produto"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Código do Produto</label>
            <input
              type="text"
              name="code"
              placeholder="Digite o código do produto"
              value={formData.code}
              onChange={handleChange}
            />
            {errors.code && <span className="error">{errors.code}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <DropdownList
              options={brandOptions}
              label="Selecionar Marca"
              onChange={(value) => handleDropdownChange("brand", value)}
            />
            <img src={"./botao.png"} className='botaozinho'/>
            {errors.brand && <span className="error">{errors.brand}</span>}
          </div>
          <div className="form-group">
            <DropdownList
              options={categoryOptions}
              label="Selecionar Categoria"
              onChange={(value) => handleDropdownChange("category", value)}
            />
            {errors.category && <span className="error">{errors.category}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Qtde Mínima em Estoque</label>
            <input
              type="number"
              name="minStock"
              placeholder="Digite a quantidade limite"
              value={formData.minStock}
              onChange={handleChange}
            />
            {errors.minStock && <span className="error">{errors.minStock}</span>}
          </div>
          <div className="form-group">
            <label>Preço Revenda</label>
            <input
              type="text"
              name="resalePrice"
              placeholder="Digite o valor de revenda"
              value={formData.resalePrice}
              onChange={handleChange}
            />
            {errors.resalePrice && <span className="error">{errors.resalePrice}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Período Máximo em Estoque</label>
            <input
              type="number"
              name="maxPeriod"
              placeholder="Digite o período em dias"
              value={formData.maxPeriod}
              onChange={handleChange}
            />
            {errors.maxPeriod && <span className="error">{errors.maxPeriod}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-back">
            VOLTAR
          </button>
          <button type="submit" className="btn-submit">
            CADASTRAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
