import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
// import Products from "./pages/Products";
// import ProductPage from "./pages/ProductPage";
import ProductList from "./components/ProductList";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Navigate } from "react-router-dom";

const App = () => {

  const [products, setProducts] = useState([]);

  // Fetch all products initially
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct) => {
      setProducts(prevProducts => [...prevProducts, newProduct]);
      fetchProducts();
  };

  const handleEdit = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    fetchProducts();
  };

  const handleDelete = async (id) => {
    try {
      console.log("APP", id);
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      // const response = await fetch(`http://localhost:5000/routes/productRoutes/${id}`, {
        method: "DELETE",
      });
      console.log("Deleted product response:", response);

      if (response.ok) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  
  const handleView = (product) => {
    alert(`Product Details:\n\n${JSON.stringify(product, null, 2)}`);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route element={<ProtectedRoute/>}/>
          <Route element={<Layout/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductList
              products={products}
              onAdd={handleAddProduct}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleView}
            />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route> 
        <Route path="*" element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
};

export default App;
