// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    // Validate input
    if ( !password || !username) {
        return res.status(400).json({ msg: 'Username and password are required' });
    }

    try {
        // Determine role
        // Determine role
        let userRole = role || 'user';  // Use provided role or default to 'user'

        const isFirstAccount = (await User.countDocuments({})) === 0;
        if (isFirstAccount && role === 'owner') {
        userRole = 'owner'; // First account can still be owner
    }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({ username, password: hashedPassword, role: userRole });
        await user.save();

        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'JWT_SECRET not set in environment' });
        }

        // Generate JWT token
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) return res.status(500).json({ msg: 'JWT signing error' });
            res.status(200).json({ token, role: userRole });
        });

    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ msg: 'Username and password are required' });
    }

    try {
        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Generate JWT
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'JWT_SECRET not set in environment' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) return res.status(500).json({ msg: 'JWT signing error' });
            res.status(200).json({ token, role: user.role });
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
