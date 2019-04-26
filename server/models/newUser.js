const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    },
    count: {
      type: String,
      unique: true,
    },
    log: [
           {
             _id: false,

             description: {
               type: String,
               unique: true,
            },
             duration: {
               type: String,
               unique: true,
            },
             date: {
               type: String,
               unique: true,
            },
        }
    ],
});

module.exports = mongoose.model('newUser', userSchema);