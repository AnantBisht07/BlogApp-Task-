const express = require('express');
const { register, login, logout, userProfile } = require('../controllers/userController')
const { singleUpload } = require("../middlewares/multer");

const router = express.Router();

router.post('/register', singleUpload, register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', userProfile);



module.exports = router;