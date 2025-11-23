const User = require('../models/User');
const Post = require('../models/Post');
const logActivity = require('../utils/logger');
const bcrypt = require('bcryptjs');


exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new User({
            username,
            password: hashedPassword,
            role: 'admin'
        });
        await admin.save();
        res.json({ msg: 'Admin created successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};


exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        
        const actor = await User.findById(req.user.id);
        await logActivity(req.user.id, `Post deleted by '${actor.role === 'owner' ? 'Owner' : 'Admin'}'`, 'DELETE_POST');

        res.json({ msg: 'Post removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        if(!userToDelete) return res.status(404).json({msg: 'User not found'});

        
        await Post.deleteMany({ author: userToDelete._id });
        
       
        await User.findByIdAndDelete(req.params.id);

       
        const actor = await User.findById(req.user.id);
        await logActivity(req.user.id, `User deleted by '${actor.role === 'owner' ? 'Owner' : 'Admin'}'`, 'DELETE_USER');

        res.json({ msg: 'User and their data deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};