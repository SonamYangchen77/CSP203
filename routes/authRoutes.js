const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register user
router.post('/signup', authController.registerUser);
router.get('/signup', (req, res) => {
    res.render('signup');  // Render the signup page if needed
});

// Login user
router.post('/login', authController.loginUser);
router.get('/login', (req, res) => {
    res.render('login');  // Render the login page if needed
});

// Logout user
router.get('/logout', authController.logoutUser);

module.exports = router;
