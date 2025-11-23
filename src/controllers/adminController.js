const User = require('../models/User');
const Post = require('../models/Post');
const logActivity = require('../utils/logger'); // Make sure this path is correct!

exports.createAdmin = async (req, res) => {
    // ... (keep your createAdmin logic or leave empty if not testing this)
    res.json({msg: "Create admin placeholder"}); 
};

exports.deletePost = async (req, res) => {
    // ...
};

exports.deleteUser = async (req, res) => {
    console.log("--- STARTING DELETE USER ---");
    try {
        console.log("1. Finding user:", req.params.id);
        const userToDelete = await User.findById(req.params.id);
        
        if(!userToDelete) {
            console.log("Error: User to delete not found");
            return res.status(404).json({msg: 'User not found'});
        }

        // Delete user's posts first
        await Post.deleteMany({ author: userToDelete._id });
        console.log("2. Deleted user posts");
        
        // Delete the user
        await User.findByIdAndDelete(req.params.id);
        console.log("3. Deleted user from DB");

        // LOG THE ACTIVITY
        const ownerId = req.user.id;
        console.log("4. Owner ID is:", ownerId);

        console.log("5. Attempting to Log Activity...");
        await logActivity(ownerId, `User deleted by Owner`, 'DELETE_USER');
        console.log("6. Log Activity SUCCESS");

        res.json({ msg: 'User and their data deleted' });
    } catch (err) {
        console.error("🔥🔥 ERROR IN DELETE USER:", err);
        res.status(500).send('Server Error');
    }
};