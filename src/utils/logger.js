const Activity = require('../models/Activity');

const logActivity = async (actorId, message, type, targetUserId = null) => {
    try {
        await Activity.create({
            actor: actorId,
            message,
            type,
            targetUser: targetUserId
        });
    } catch (err) {
        console.error('Failed to log activity:', err);
    }
};

module.exports = logActivity;