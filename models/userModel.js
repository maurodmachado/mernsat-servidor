const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, index: true, dropDups: true, trim: true
  },
  password: { type: String, required: true, trim: true},
  copypassword: { type: String, required: true, trim: true},
  isAdmin: { type: Boolean, required: true, default: false },
  registro: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', UsersSchema);