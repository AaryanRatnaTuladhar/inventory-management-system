const openCollection = require("../database/databaseConnection");
const { Sale } = require("../models/saleModel");
const { ObjectId } = require("mongodb");

// Get all sales
async function getAllSales(req, res) {
  try {
    const salesCollection = await openCollection("sales");
    const sales = await salesCollection.find().sort({ saleDate: -1 }).toArray();
    return res.status(200).json({ sales, message: "Sales fetched successfully" });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get a single sale by ID
async function getSaleById(req, res) {
  try {
    const salesCollection = await openCollection("sales");
    const saleId = req.params.id;
    
    if (!ObjectId.isValid(saleId)) {
      return res.status(400).json({ error: "Invalid sale ID" });
    }
    
    const sale = await salesCollection.findOne({ _id: new ObjectId(saleId) });
    
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    
    return res.status(200).json({ sale, message: "Sale fetched successfully" });
  } catch (error) {
    console.error("Error fetching sale:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Create a new sale
async function createSale(req, res) {
  try {
    const salesCollection = await openCollection("sales");
    const productsCollection = await openCollection("products");
    
    const { 
      productId, 
      quantity,
      customerName,
      customerContact,
      paymentMethod,
      notes,
      saleDate
    } = req.body;
    
    // Validate required fields
    if (!productId || !quantity) {
      return res.status(400).json({ error: "Product ID and quantity are required" });
    }
    
    // Check if product exists
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Check if there's enough stock
    if (product.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }
    
    // Calculate total amount
    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;
    
    // Create new sale
    const sale = new Sale(
      productId,
      product.name,
      quantity,
      unitPrice,
      totalAmount,
      customerName,
      customerContact,
      saleDate ? new Date(saleDate) : new Date(),
      paymentMethod,
      notes
    );
    
    // Update product stock
    const newQuantity = product.quantity - quantity;
    
    // Create stock history entry
    const stockHistoryEntry = {
      date: new Date(),
      quantity: newQuantity,
      previousQuantity: product.quantity,
      action: 'Sale',
      saleId: sale._id.toString()
    };
    
    // Transactions are not fully supported in MongoDB without a replica set
    // But we can do both operations and check if they succeed
    
    // Insert sale record
    const saleResult = await salesCollection.insertOne(sale);
    
    // Update product stock
    const productUpdateResult = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      { 
        $set: { 
          quantity: newQuantity,
          updatedAt: new Date()
        },
        $push: { 
          stockHistory: stockHistoryEntry 
        }
      }
    );
    
    if (saleResult.acknowledged && productUpdateResult.acknowledged) {
      return res.status(201).json({ 
        sale,
        message: "Sale recorded successfully" 
      });
    } else {
      // This is not a true rollback but attempts to undo the operation if one part failed
      if (saleResult.acknowledged) {
        await salesCollection.deleteOne({ _id: sale._id });
      }
      return res.status(500).json({ error: "Failed to process the sale" });
    }
  } catch (error) {
    console.error("Error creating sale:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Cancel a sale (soft delete and restore stock)
async function cancelSale(req, res) {
  try {
    const salesCollection = await openCollection("sales");
    const productsCollection = await openCollection("products");
    const saleId = req.params.id;
    
    if (!ObjectId.isValid(saleId)) {
      return res.status(400).json({ error: "Invalid sale ID" });
    }
    
    // Get the sale record
    const sale = await salesCollection.findOne({ _id: new ObjectId(saleId) });
    
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    
    if (sale.status === 'Cancelled') {
      return res.status(400).json({ error: "Sale is already cancelled" });
    }
    
    // Get the product
    const product = await productsCollection.findOne({ _id: new ObjectId(sale.productId) });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Create stock history entry
    const stockHistoryEntry = {
      date: new Date(),
      quantity: product.quantity + sale.quantity,
      previousQuantity: product.quantity,
      action: 'Sale Cancelled',
      saleId: sale._id.toString()
    };
    
    // Update the sale status
    const saleUpdateResult = await salesCollection.updateOne(
      { _id: new ObjectId(saleId) },
      { 
        $set: { 
          status: 'Cancelled',
          updatedAt: new Date()
        }
      }
    );
    
    // Restore the product stock
    const productUpdateResult = await productsCollection.updateOne(
      { _id: new ObjectId(sale.productId) },
      { 
        $set: { 
          quantity: product.quantity + sale.quantity,
          updatedAt: new Date()
        },
        $push: { 
          stockHistory: stockHistoryEntry 
        }
      }
    );
    
    if (saleUpdateResult.acknowledged && productUpdateResult.acknowledged) {
      return res.status(200).json({ 
        message: "Sale cancelled successfully" 
      });
    } else {
      return res.status(500).json({ error: "Failed to cancel the sale" });
    }
  } catch (error) {
    console.error("Error cancelling sale:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get sales statistics for a time period
async function getSalesStats(req, res) {
  try {
    const salesCollection = await openCollection("sales");
    const productsCollection = await openCollection("products");
    const { startDate, endDate, period = 'monthly' } = req.query;
    
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else if (startDate) {
      dateFilter = {
        saleDate: {
          $gte: new Date(startDate)
        }
      };
    } else if (endDate) {
      dateFilter = {
        saleDate: {
          $lte: new Date(endDate)
        }
      };
    }
    
    // Only include completed sales
    const query = {
      ...dateFilter,
      status: 'Completed'
    };
    
    const sales = await salesCollection.find(query).toArray();
    
    // Calculate basic statistics
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    
    // Get top selling products
    const productSales = sales.reduce((acc, sale) => {
      if (!acc[sale.productId]) {
        acc[sale.productId] = {
          productId: sale.productId,
          productName: sale.productName,
          totalQuantity: 0,
          totalAmount: 0,
          saleCount: 0
        };
      }
      
      acc[sale.productId].totalQuantity += sale.quantity;
      acc[sale.productId].totalAmount += sale.totalAmount;
      acc[sale.productId].saleCount += 1;
      
      return acc;
    }, {});
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);
    
    // Get category-based statistics
    const products = await productsCollection.find({}).toArray();
    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = product;
    });
    
    const categoryData = sales.reduce((acc, sale) => {
      const product = productMap[sale.productId];
      if (!product) return acc;
      
      const category = product.category || 'Uncategorized';
      
      if (!acc[category]) {
        acc[category] = {
          category,
          totalQuantity: 0,
          totalAmount: 0,
          saleCount: 0
        };
      }
      
      acc[category].totalQuantity += sale.quantity;
      acc[category].totalAmount += sale.totalAmount;
      acc[category].saleCount += 1;
      
      return acc;
    }, {});
    
    const categorySales = Object.values(categoryData);
    
    // Time-based analysis
    const timeBasedSales = {};
    
    sales.forEach(sale => {
      let timeKey;
      const saleDate = new Date(sale.saleDate);
      
      if (period === 'hourly') {
        // Format: ISO string for the start of the hour
        saleDate.setMinutes(0, 0, 0);
        timeKey = saleDate.toISOString();
      } else if (period === 'daily') {
        // Format: "YYYY-MM-DD"
        timeKey = saleDate.toISOString().split('T')[0];
      } else if (period === 'weekly') {
        // Get the week start date (Sunday)
        const day = saleDate.getDay();
        const diff = saleDate.getDate() - day;
        const weekStart = new Date(saleDate);
        weekStart.setDate(diff);
        timeKey = weekStart.toISOString().split('T')[0];
      } else {
        // Default: monthly - Format: "YYYY-MM"
        timeKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!timeBasedSales[timeKey]) {
        timeBasedSales[timeKey] = {
          period: timeKey,
          totalRevenue: 0,
          totalQuantity: 0,
          orderCount: 0
        };
      }
      
      timeBasedSales[timeKey].totalRevenue += sale.totalAmount;
      timeBasedSales[timeKey].totalQuantity += sale.quantity;
      timeBasedSales[timeKey].orderCount += 1;
    });
    
    const timeSeriesData = Object.values(timeBasedSales).sort((a, b) => a.period.localeCompare(b.period));
    
    // Payment method distribution
    const paymentMethodData = sales.reduce((acc, sale) => {
      const method = sale.paymentMethod || 'Unknown';
      
      if (!acc[method]) {
        acc[method] = {
          method,
          totalAmount: 0,
          count: 0
        };
      }
      
      acc[method].totalAmount += sale.totalAmount;
      acc[method].count += 1;
      
      return acc;
    }, {});
    
    const paymentMethodStats = Object.values(paymentMethodData);
    
    // Inventory status
    const stockStatus = {
      low: 0,
      optimal: 0,
      excess: 0
    };
    
    products.forEach(product => {
      if (product.quantity <= product.minStockLevel) {
        stockStatus.low += 1;
      } else if (product.quantity > product.minStockLevel * 3) {
        stockStatus.excess += 1;
      } else {
        stockStatus.optimal += 1;
      }
    });
    
    return res.status(200).json({
      stats: {
        totalSales,
        totalRevenue,
        totalQuantity,
        topProducts,
        categorySales,
        timeSeriesData,
        paymentMethodStats,
        stockStatus
      },
      message: "Sales statistics fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching sales statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  cancelSale,
  getSalesStats
}; 