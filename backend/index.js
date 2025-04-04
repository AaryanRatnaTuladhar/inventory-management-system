require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
const Product = require('./models/Product');
const { verifyJWT } = require('./middleware/verifyJWT.js');

app.use(express.json());
app.use(cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
    //   "http://www.yoursite.com",
    //   "http://127.0.0.1:5500",
    //   "http://127.0.0.1:5502",
    //   "http://127.0.0.1:5501",
    //   "http://localhost:5174",
    ],
    credentials: true,
  }
    
));

try {
    // mongoose.connect('mongodb+srv://aryantuladhar:testing123@cluster0.bop6waa.mongodb.net/inventoryManagementDB?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB connected'));
    mongoose.connect('mongodb://localhost:27017/inventoryDB').then(() => console.log('MongoDB connected'));
} catch (err) {
    console.error(err);
}

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use(require("./routes/auth"));

app.get('/dashboard',verifyJWT, (req, res) => {
    res.status(200).json({
        message: "Welcome to your dashboard!",
        data: {
            user: req.email,
        },
    })
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});


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
