const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

const createNewProduct = async (req, res) => {
  try {
    const { name, category, cost_price, selling_price, quantity } = req.body;
    const result = await Product.create({
      name,
      category,
      cost_price,
      selling_price,
      quantity,
      supplier,
      supplier_contact,
      supplier_address
    });
    console.log("Result after creating", result);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Product successfully created.",
      });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal Server Error" });
    }
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({ message: "Internal server err" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProductes = await Product.find({}).exec();
    if (allProductes) {
      return res.status(200).json(allProductes);
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  console.log("CONBTORLLER",req.body.id);
  try {
    const ProductId = req.params.id;
    const result = await Product.findOneAndDelete({ _id: ProductId });
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Product succesfully deleted.",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const ProductId = req.params.id; // Get company ID from request parameters
    const updateData = req.body; // Get update data from request body

    const updateObject = { $set: updateData };

    // Find the company by ID and update
    const updatedProduct = await Product.findByIdAndUpdate(ProductId, updateObject, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Product updated successfully",
        Product: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating Product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
module.exports = { 
  createNewProduct, 
  getAllProducts,
  getProductById, 
  deleteProduct, 
  updateProduct
};
