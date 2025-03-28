require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connectDB = require('./utils/db.js');
const cookieParser = require("cookie-parser");
const cloudinary = require('./utils/cloudinary');
const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoute');

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",  
  credentials: true,  
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.use('/api/auth/user', userRoute);
app.use('/api/user', blogRoute);

// Serve static files from 'client/dist' folder
app.use(express.static(path.join(__dirname , '/client/dist')));

// Catch-all route to serve index.html for React app
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at port ${PORT}`);
});
