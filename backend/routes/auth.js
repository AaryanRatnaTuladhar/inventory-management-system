const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const {
  createNewUser,
  loginUser
} = require("../controllers/userController");



router.route("/signup").post(createNewUser);

router.route("/login").post(loginUser);

router.route("/dashboard")

module.exports = router;

// .post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

//     res.json({ success: true, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });



// .post("/signup", async (req, res) => {
//     const { name, email, password } = req.body;

//     try{
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered." });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({ name, email, password: hashedPassword });
//         await newUser.save();

//         const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

//         res.status(201).json({ message: "User registered successfully.", token });
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// module.exports = router;

