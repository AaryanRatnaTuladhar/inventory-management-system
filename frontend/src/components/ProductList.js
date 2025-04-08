import React, { useState } from "react";
import "../styles/ProductList.css";
import ProductView from "./ProductView";

const ProductList = ({ products, onView, onEdit, onDelete, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formProduct, setFormProduct] = useState({
    name: "",
    description: "",
    cost_price: "",
    selling_price: "",
    quantity: "",
    category: "",
    supplier: "",
    supplier_contact: "",
    supplier_address: ""
  });
  const [editId, setEditId] = useState(null);
  
  const [viewProduct, setViewProduct] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formProduct),
      });

      const data = await response.json();
      if (response.ok) {
        onAdd(data);
        setFormProduct({
          name: "",
          description: "",
          cost_price: "",
          selling_price: "",
          quantity: "",
          category: "",
          supplier: "",
          supplier_contact: "",
          supplier_address: ""
        });
        setShowForm(false);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formProduct),
      });

      const updated = await res.json();
      if (res.ok) {
        onEdit(updated);
        setEditId(null);
        setFormProduct({
          name: "",
          description: "",
          cost_price: "",
          selling_price: "",
          quantity: "",
          category: "",
          supplier: "",
          supplier_contact: "",
          supplier_address: ""
        });
        setShowForm(false);
      } else {
        console.error("Failed to update");
      }
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const handleEditClick = (product) => {
    setEditId(product._id);
    setFormProduct(product);
    setShowForm(true);
  };

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Product List</h2>
        <button className="add-btn" onClick={() => {
          setEditId(null); // switch to add mode
          setFormProduct({
            name: "",
            description: "",
            cost_price: "",
            selling_price: "",
            quantity: "",
            category: "",
            supplier: "",
            supplier_contact: "",
            supplier_address: ""
          });
          setShowForm(!showForm);
        }}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={editId ? handleEditSubmit : handleAddProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={formProduct.name}
            onChange={(e) =>
              setFormProduct({ ...formProduct, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={formProduct.description}
            onChange={(e) =>
              setFormProduct({ ...formProduct, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Cost Price"
            value={formProduct.cost_price}
            onChange={(e) =>
              setFormProduct({ ...formProduct, cost_price: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Selling Price"
            value={formProduct.selling_price}
            onChange={(e) =>
              setFormProduct({ ...formProduct, selling_price: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formProduct.quantity}
            onChange={(e) =>
              setFormProduct({ ...formProduct, quantity: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formProduct.category}
            onChange={(e) =>
              setFormProduct({ ...formProduct, category: e.target.value })
            }
            required
          />
                    <input
            type="text"
            placeholder="Supplier"
            value={formProduct.supplier}
            onChange={(e) =>
              setFormProduct({ ...formProduct, supplier: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Supplier Contact"
            value={formProduct.supplier_contact}
            onChange={(e) =>
              setFormProduct({ ...formProduct, supplier_contact: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Supplier Address"
            value={formProduct.supplier_address}
            onChange={(e) =>
              setFormProduct({ ...formProduct, supplier_address: e.target.value })
            }
          />
          <button type="submit">{editId ? "Update" : "Submit"}</button>
        </form>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Supplier</th>
            <th>Supplier Contact</th>
            <th>Supplier Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>{product.cost_price}</td>
                <td>{product.selling_price}</td>
                <td>{product.supplier}</td>
                <td>{product.supplier_contact}</td>
                <td>{product.supplier_address}</td>
                <td className="actions">
                  <button className="view-btn" onClick={() => setViewProduct(product)}>
                    View
                  </button>
                  <button className="edit-btn" onClick={() => handleEditClick(product)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this product?")) {
                        onDelete(product._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Conditionally render the ProductView modal */}
      {viewProduct && (
        <ProductView product={viewProduct} onClose={() => setViewProduct(null)} />
      )}
    </div>
  );
};

export default ProductList;
