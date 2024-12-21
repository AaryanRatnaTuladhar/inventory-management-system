const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

const createNewProduct = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const validation = ProductValidation.safeParse(req.body);

    if (!validation.success) {
      console.log("\n\n err \n\n");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, error: validation.error.errors });
    }
    const result = await Product.create({
      name,
      category,
      price,
      quantity

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

const getAllProductes = async (req, res) => {
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

const deleteProduct = async (req, res) => {
  console.log(req.body.id);
  try {
    const ProductId = req.body.id;
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
  getAllProductes, 
  deleteProduct, 
  updateProduct
};
