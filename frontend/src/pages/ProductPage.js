import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleView = (product) => {
    alert(`Viewing product: ${product.name}`);
  };

  const handleEdit = (product) => {
    alert(`Editing product: ${product.name}`);
    // Navigate to edit form or open modal
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  const handleAdd = () => {
    alert("Redirect to Add Product page");
    // Navigate to add form or open modal
  };

  return (
    <ProductList
      products={products}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
    />
  );
};

export default ProductsPage;
