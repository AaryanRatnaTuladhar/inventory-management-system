const openCollection = require("../database/databaseConnection");
const { Product } = require("../models/productModel");
const { ObjectId } = require("mongodb");

// Get all products
async function getAllProducts(req, res) {
  try {
    const productsCollection = await openCollection("products");
    const products = await productsCollection.find().sort({ updatedAt: -1 }).toArray();
    return res.status(200).json({ products, message: "Products fetched successfully" });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get a single product by ID
async function getProductById(req, res) {
  try {
    const productsCollection = await openCollection("products");
    const productId = req.params.id;
    
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    return res.status(200).json({ product, message: "Product fetched successfully" });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Create a new product
async function createProduct(req, res) {
  try {
    const productsCollection = await openCollection("products");
    
    const { 
      name, 
      description, 
      category, 
      price, 
      quantity, 
      minStockLevel, 
      sku,
      supplierName,
      supplierContact,
      supplierAddress
    } = req.body;
    
    // Validate required fields
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: "Required fields are missing" });
    }
    
    // Create a new product
    const product = new Product(
      name, 
      description || "", 
      category, 
      Number(price), 
      Number(quantity), 
      Number(minStockLevel) || 10, 
      sku,
      supplierName || "",
      supplierContact || "",
      supplierAddress || ""
    );
    
    // Insert the product into the database
    const result = await productsCollection.insertOne(product);
    
    if (result.acknowledged && result.insertedId) {
      return res.status(201).json({ 
        product,
        message: "Product created successfully" 
      });
    } else {
      return res.status(500).json({ error: "Failed to create product" });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update a product
async function updateProduct(req, res) {
  try {
    const productsCollection = await openCollection("products");
    const productId = req.params.id;
    
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    // Get the existing product
    const existingProduct = await productsCollection.findOne({ _id: new ObjectId(productId) });
    
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const { 
      name, 
      description, 
      category, 
      price, 
      quantity, 
      minStockLevel, 
      sku,
      supplierName,
      supplierContact,
      supplierAddress
    } = req.body;
    
    // Check if stock quantity has changed
    const stockChanged = existingProduct.quantity !== Number(quantity);
    
    // Update product with new values (if provided) or keep existing values
    const updates = {
      $set: {
        name: name || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        category: category || existingProduct.category,
        price: price !== undefined ? Number(price) : existingProduct.price,
        quantity: quantity !== undefined ? Number(quantity) : existingProduct.quantity,
        minStockLevel: minStockLevel !== undefined ? Number(minStockLevel) : existingProduct.minStockLevel,
        sku: sku || existingProduct.sku,
        supplierName: supplierName !== undefined ? supplierName : existingProduct.supplierName,
        supplierContact: supplierContact !== undefined ? supplierContact : existingProduct.supplierContact,
        supplierAddress: supplierAddress !== undefined ? supplierAddress : existingProduct.supplierAddress,
        updatedAt: new Date()
      }
    };
    
    // If stock quantity changed, add an entry to stockHistory
    if (stockChanged) {
      const stockHistoryEntry = {
        date: new Date(),
        quantity: Number(quantity),
        action: Number(quantity) > existingProduct.quantity ? 'Stock increased' : 'Stock decreased',
        previousQuantity: existingProduct.quantity
      };
      
      updates.$push = {
        stockHistory: stockHistoryEntry
      };
    }
    
    // Update the product in the database
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      updates
    );
    
    if (result.acknowledged && result.matchedCount > 0) {
      // Get the updated product
      const updatedProduct = await productsCollection.findOne({ _id: new ObjectId(productId) });
      
      return res.status(200).json({ 
        product: updatedProduct,
        message: "Product updated successfully" 
      });
    } else {
      return res.status(500).json({ error: "Failed to update product" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a product
async function deleteProduct(req, res) {
  try {
    const productsCollection = await openCollection("products");
    const productId = req.params.id;
    
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    // Check if product exists
    const existingProduct = await productsCollection.findOne({ _id: new ObjectId(productId) });
    
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Delete the product
    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
    
    if (result.acknowledged && result.deletedCount > 0) {
      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      return res.status(500).json({ error: "Failed to delete product" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get product statistics for dashboard
async function getProductStats(req, res) {
  try {
    const productsCollection = await openCollection("products");
    
    // Get total product count
    const totalProducts = await productsCollection.countDocuments();
    
    // Get low stock products
    const lowStockProducts = await productsCollection
      .find({ $expr: { $lt: ["$quantity", "$minStockLevel"] } })
      .toArray();
    
    // Get recently updated products
    const recentActivity = await productsCollection
      .find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray();
    
    return res.status(200).json({
      stats: {
        totalProducts,
        lowStockProducts,
        recentActivity
      },
      message: "Product statistics fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching product statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
}; 