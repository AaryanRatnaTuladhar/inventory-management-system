import React from "react";
import "../styles/ProductView.css";

const ProductView = ({ product, onClose }) => {
  if (!product) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Product Details</h2>
        <table>
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{product.name}</td>
            </tr>
            <tr>
              <td><strong>Category:</strong></td>
              <td>{product.category}</td>
            </tr>
            <tr>
              <td><strong>Quantity:</strong></td>
              <td>{product.quantity}</td>
            </tr>
            <tr>
              <td><strong>Cost Price:</strong></td>
              <td>{product.cost_price}</td>
            </tr>
            <tr>
              <td><strong>Selling Price:</strong></td>
              <td>{product.selling_price}</td>
            </tr>
            <tr>
              <td><strong>Supplier:</strong></td>
              <td>{product.supplier}</td>
            </tr>
            <tr>
              <td><strong>Contact:</strong></td>
              <td>{product.supplier_contact}</td>
            </tr>
            <tr>
              <td><strong>Address:</strong></td>
              <td>{product.supplier_address}</td>
            </tr>
          </tbody>
        </table>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProductView;
