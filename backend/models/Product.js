const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    quantity: Number,
    reorder_level: Number,
    price: Number,
    last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
