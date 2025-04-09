const { ObjectId } = require('mongodb');

class Product {
  constructor(name, description, category, price, quantity, minStockLevel, sku, supplierName, supplierContact, supplierAddress) {
    this._id = new ObjectId();
    this.name = name;
    this.description = description;
    this.category = category;
    this.price = price;
    this.quantity = quantity;
    this.minStockLevel = minStockLevel || 10; // Default minimum stock level
    this.sku = sku || `SKU-${Math.floor(Math.random() * 10000)}`;
    this.supplierName = supplierName || '';
    this.supplierContact = supplierContact || '';
    this.supplierAddress = supplierAddress || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.stockHistory = [
      {
        date: new Date(),
        quantity: quantity,
        action: 'Initial stock'
      }
    ];
  }
}

module.exports = {
  Product
}; 