require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary").v2;

// signup
const register = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  try {
    const { email, password } = req.body;

    // check if anything left
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }

    // if(!image) {
    //   return res.status(400).json({
    //     message: 'No files recieved!',
    //     success: false,
    //   });
    // }

    // cloudinary upload
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file received!",
        success: false,
      });
    }
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // find the user if already exists or not
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User is already exists with this email!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user in db
    await User.create({
      email,
      password: hashedPassword,
      image: cloudResponse.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
    });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// login
const login = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  try {
    const { email, password } = req.body;

    // check for all fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // check for the user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password!",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is missing!",
      });
    }

    // compare the password
    let isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password!",
      });
    }

    // token generate
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Prepare user data to send back
    const userData = {
      _id: user._id,
      email: user.email,
      image: user.image,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "None", // Ensure it can be sent across origins
    secure: true,
      })
      .cookie("user", JSON.stringify(userData), { maxAge: 24 * 60 * 60 * 1000 }) 
      .json({
        success: true,
        message: `Welcome back ${user.email}`,
        user,
      });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

//logout
const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { httpOnly: true, maxAge: 0 })
      .json({
        success: true,
        message: "Logged out successfully!",
      });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};


// user profile
const userProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};






module.exports = { register, login, logout, userProfile };

