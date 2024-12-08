const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
console.log('Product model loaded successfully');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/inventoryManagementSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Database connected')).catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

const Product = require('./models/Product');

// Add product
app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    try {
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        res.status(500).send(err);
    }
});
