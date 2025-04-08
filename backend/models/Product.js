const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: String,
    quantity: Number,
    reorder_level: Number,
    cost_price: Number,
    selling_price: Number,
    supplier: String,
    supplier_contact: String,
    supplier_address: String,
    last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
