import React, { useState, useEffect } from 'react';
import "../styles/Table.css"
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleUpdate = async (id, updatedProduct) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      const data = await response.json();
      setProducts(products.map(p => p._id === id ? data : p));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAdd = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  return (
    <div className="container mt-4">
      <h2>Product Inventory</h2>
      <ProductForm onAdd={handleAdd} />
      <ProductTable 
        products={products} 
        onUpdate={handleUpdate} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default Inventory;