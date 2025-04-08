import React, { useState } from 'react';
import '../styles/Table.css'; // Assuming you have some CSS for styling
const ProductForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost_price: 0,
    selling_price: 0,
    stock: 0
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', category: '', price: 0, stock: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="form-row">
        <div className="col-md-3">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="form-control"
            min="0"
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;