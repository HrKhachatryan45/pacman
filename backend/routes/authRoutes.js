const express = require('express');
const {register, login, registerGoogle, loginGoogle, logout} = require("../controllers/authController");
const validateUser = require("../middlewares/validateUser");
const router = express.Router();

router.post('/register',validateUser,register)
router.post('/login',login)
router.post('/register/google',registerGoogle)
router.post('/login/google',loginGoogle)
router.post('/logout',logout)
module.exports = router;
