const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Signup
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists with the provided email
        const userExists = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.none('INSERT INTO users (name, email, password) VALUES($1, $2, $3)', [name, email, hashedPassword]);
        
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'Error registering user' });
    }
};

// Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Get the user by email
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Store user session data
        req.session.user = { id: user.id, name: user.name, email: user.email };

        // Redirect properly without passing an object
        return res.redirect(302, '/home');
    } catch (err) {
        console.error('Error logging in:', err);
        return res.status(500).json({ error: 'Error logging in' });
    }
};

// Logout
exports.logoutUser = (req, res) => {
    // Destroy the session and ensure response is sent after completion
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};
