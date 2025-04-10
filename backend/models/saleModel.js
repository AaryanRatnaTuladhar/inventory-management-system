const { ObjectId } = require('mongodb');

class Sale {
  constructor(productId, productName, quantity, unitPrice, totalAmount, customerName, customerContact, saleDate, paymentMethod, notes, supplierName, supplierContact, status) {
    this._id = new ObjectId();
    this.productId = productId;
    this.productName = productName;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.totalAmount = totalAmount;
    this.customerName = customerName || '';
    this.customerContact = customerContact || '';
    this.saleDate = saleDate || new Date();
    this.paymentMethod = paymentMethod || 'Cash';
    this.notes = notes || '';
    this.supplierName = supplierName || '';
    this.supplierContact = supplierContact || '';
    this.createdAt = new Date();
    this.transactionId = `TXN-${Math.floor(Math.random() * 1000000)}`;
    this.status = status || 'Pending';
  }
}

module.exports = {
  Sale
}; 