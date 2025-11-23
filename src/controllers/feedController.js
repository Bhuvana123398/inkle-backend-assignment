const Activity = require('../models/Activity');
const User = require('../models/User');

exports.getActivityFeed = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const blockedIds = currentUser.blockedUsers || [];

        
        
        const feed = await Activity.find({
            actor: { $nin: blockedIds }, 
            $or: [
                { targetUser: { $exists: false } }, 
                { targetUser: null },               
                { targetUser: { $nin: blockedIds } } 
            ]
        })
        .sort({ createdAt: -1 }) 
        .limit(20);

        res.json(feed);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};