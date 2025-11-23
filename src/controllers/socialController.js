const Post = require('../models/Post');
const User = require('../models/User');
const logActivity = require('../utils/logger');


exports.createPost = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newPost = new Post({
            content: req.body.content,
            author: req.user.id
        });
        await newPost.save();
        
        await logActivity(req.user.id, `${user.username} made a post`, 'POST');
        
        res.json(newPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author');
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.push(req.user.id);
        await post.save();

        const actor = await User.findById(req.user.id);
        await logActivity(req.user.id, `${actor.username} liked ${post.author.username}'s post`, 'LIKE', post.author._id);

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.followUser = async (req, res) => {
    console.log("--- Starting Follow User ---");
    try {
        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!targetUser) return res.status(404).json({ msg: 'User not found' });
        if (!currentUser) return res.status(404).json({ msg: 'Current User not found' });
        if (!currentUser.following) {
            currentUser.following = [];
        }
        if (currentUser.following.includes(req.params.id)) {
            return res.status(400).json({ msg: 'Already following' });
        }

        currentUser.following.push(req.params.id);
        await currentUser.save();

        await logActivity(req.user.id, `${currentUser.username} followed ${targetUser.username}`, 'FOLLOW', targetUser._id);

        res.json(currentUser.following);
    } catch (err) {
        console.error("FOLLOW ERROR:", err.message); // Logs actual error to terminal
        res.status(500).send('Server Error');
    }
};


exports.blockUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const targetId = req.params.id;
        if (!currentUser.blockedUsers) {
            currentUser.blockedUsers = [];
        }
        if (currentUser.blockedUsers.includes(targetId)) {
            return res.status(400).json({ msg: 'User already blocked' });
        }

        currentUser.blockedUsers.push(targetId);
        await currentUser.save();
        
        res.json({ msg: 'User blocked successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};