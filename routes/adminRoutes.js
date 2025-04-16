const express = require('express');
const router = express.Router();

// Middleware to check admin session (optional but good for protection)
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.email === process.env.ADMIN_EMAIL) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

// GET Admin Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        // If you fetch books from DB, pass them
        const books = await req.app.locals.db.any('SELECT * FROM books');

        res.render('adminDashboard', {
            user: req.session.user,
            books: books
        });
    } catch (error) {
        console.error("❌ Error loading admin dashboard:", error);
        res.status(500).send('Error loading dashboard');
    }
});

module.exports = router;
