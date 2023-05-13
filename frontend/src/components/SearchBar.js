import React, { useState, useEffect } from 'react'
import axios from 'axios'

function SearchBar() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await axios.get("http://localhost:3000/Products%22");
      setProducts(result.data)
    };
    fetchProducts();
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} />
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <img src={product.image} alt={product.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBar;