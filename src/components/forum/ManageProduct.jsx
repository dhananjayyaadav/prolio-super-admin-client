// ProductComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductComponent.css"; // For styling

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch products from Fake Store API
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(response.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Handle category selection
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="product-page">
      <div className="filters">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button className="share-button">Share Products</button>
      </div>

      <div className="products">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p>By: {product.category}</p>
              <p>Price: ₹ {product.price}</p>
              <button className="enquiry-button">Send Enquiry</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProduct;
