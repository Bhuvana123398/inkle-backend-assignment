const Activity = require('../models/Activity');
const User = require('../models/User');

exports.getActivityFeed = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const blockedIds = currentUser.blockedUsers || [];

        // Logic:
        // 1. Show logs where Actor is NOT blocked
        // 2. Show logs where Target is NOT blocked OR Target is NULL (like delete logs)
        
        const feed = await Activity.find({
            actor: { $nin: blockedIds }, // Filter out blocked actors
            $or: [
                { targetUser: { $exists: false } }, // Show if no target
                { targetUser: null },               // Show if target is null
                { targetUser: { $nin: blockedIds } } // Show if target is not blocked
            ]
        })
        .sort({ createdAt: -1 }) // Newest first
        .limit(20);

        res.json(feed);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};