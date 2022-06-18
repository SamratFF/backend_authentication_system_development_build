const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
     // name: String,
     name: {
          type: String,
          required: true
     },

     // username: String,
     username: {
          type: String,
          unique: true,
          required: true
     },
     // password: String,
     password: {
          type: String,
          required: true
     },

     // email: String,
     email: {
          type: String,
          unique: true,
          required: true
     },
     date: {
          type: Date,
          default: Date.now
     }
});

// const user = mongoose.model('users', UserSchema);

module.exports = mongoose.model('users', UserSchema);