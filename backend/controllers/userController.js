const User = require("../model/User");
const Users = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const allRoles = require("../config/roles_list");
const crypto = require("crypto");


const handleNewUser = async (req, res) => {
  const { username, password, email} = req.body;

  if (!username || !password || !email)
    return res
      .status(400)
      .json({ message: "Username | password | email are required" });

  //check for duplicate emails in database;
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) return res.status(409).json({ error: "User Already Exists!" }); //Conflict
  try {
        const hashedPwd = await bcrypt.hash(password, 10);
      const result = await User.create({
        username,
        email,
        password: hashedPwd
      });
      console.log("result", result);
      res
        .status(201)
        .json({ success: true, message: `New user ${username} created ` });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


const handleGetAllUsers = async (req, res) => {
  try {
    // console.log("\nhello");
    const allUsers = await Users.find({}).exec();
    return res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json(allUsers);
  }
};

const deleteUser = async (req, res) => {
  console.log(req.body.id);
  try {
    const UserId = req.body.id;
    const result = await Users.findOneAndDelete({ _id: UserId });
    if (result) {
      return res.status(200).json({
        success: true,
        message: "User succesfully deleted.",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get company ID from request parameters
    const updateData = req.body; // Get update data from request body

    const updateObject = { $set: updateData };

    // Find the company by ID and update
    const updatedUser = await User.findByIdAndUpdate(userId, updateObject, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getUserDetails = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Bearer missing in authorization header." });
  }

  const token = authHeader.split(" ")[1];
  // console.log("TOKEN ",token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error("\n Error:", err);
      return res.sendStatus(403);
    }

    const foundUser = await User.findOne({
      email: decoded.UserInfo.email,
    }).exec();
    // console.log(foundUser);
    if (!foundUser) {
      console.log("401:", email, "User does not exist");
      return res
        .status(401)
        .json({ error: "Unauthorized: User does not exist." });
    }

    res.status(200).json({ success: foundUser }); // Attach result to req object
  });
};

module.exports = {
  handleNewUser,
  handleGetAllUsers,
  deleteUser,
  updateUser,
  getUserDetails
};
