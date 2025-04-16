const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Signup
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.none('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [
            name,
            email,
            hashedPassword
        ]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error("❌ Error registering user:", err);
        res.status(500).json({ error: 'Error registering user' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
            return res.status(401).render('login', { error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('login', { error: 'Invalid email or password' });
        }

        // Save user session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        // ✅ Redirect to appropriate dashboard
        if (user.email === adminEmail) {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/home');
        }

    } catch (err) {
        console.error("❌ Error logging in:", err);
        res.status(500).render('login', { error: 'Error logging in' });
    }
};


// Logout
exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};
