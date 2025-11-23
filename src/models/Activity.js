const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    message: { type: String, required: true }, 
    type: { type: String, enum: ['POST', 'LIKE', 'FOLLOW', 'DELETE_USER', 'DELETE_POST'] },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);