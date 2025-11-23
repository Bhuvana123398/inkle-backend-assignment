
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    
    if ( !password || !username) {
        return res.status(400).json({ msg: 'Username and password are required' });
    }

    try {
        
        let userRole = role || 'user';  

        const isFirstAccount = (await User.countDocuments({})) === 0;
        if (isFirstAccount && role === 'owner') {
        userRole = 'owner'; 
    }

 
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

   
        const user = new User({ username, password: hashedPassword, role: userRole });
        await user.save();

  
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'JWT_SECRET not set in environment' });
        }

    
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

 
    if (!username || !password) {
        return res.status(400).json({ msg: 'Username and password are required' });
    }

    try {
   
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

       
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
