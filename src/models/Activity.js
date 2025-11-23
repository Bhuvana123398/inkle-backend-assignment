const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    message: { type: String, required: true }, // e.g., "ABC made a post"
    type: { type: String, enum: ['POST', 'LIKE', 'FOLLOW', 'DELETE_USER', 'DELETE_POST'] },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who did it
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who was affected (optional)
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);