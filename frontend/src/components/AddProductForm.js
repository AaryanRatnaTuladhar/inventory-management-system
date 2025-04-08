// components/AddProductForm.js
import React, { useState } from "react";

const AddProductForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    // description: "",
    cost_price: "",
    selling_price: "",
    quantity: "",
    category: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        onAdd(result); // callback to update UI
        setFormData({
          name: "",
          // description: "",
          cost_price: "",
          selling_price: "",
          quantity: "",
          category: "",
        });
      } else {
        alert(result.message || "Failed to add product");
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      {/* <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} /> */}
      <input name="cost_price" type="number" placeholder="Cost Price" value={formData.cost_price} onChange={handleChange} required />
      <input name="selling_price" type="number" placeholder="Selling Price" value={formData.selling_price} onChange={handleChange} required />
      <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
