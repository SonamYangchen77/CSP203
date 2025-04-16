const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET: Render the signup form
router.get('/signup', (req, res) => {
    res.render('signup'); 
});

// POST: Handle user registration
router.post('/signup', authController.registerUser);


// GET: Render the login form
router.get('/login', (req, res) => {
    res.render('login');
});

// POST: Handle user login
router.post('/login', authController.loginUser);

// GET: Handle user logout
router.get('/logout', authController.logoutUser);

module.exports = router;
