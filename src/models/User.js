const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'admin', 'user'], default: 'user' } // <-- default added
});

module.exports = mongoose.model('User', userSchema);
