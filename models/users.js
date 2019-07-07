const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
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

             logId: {
              type: String,
              unique: true,
             },
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

module.exports = mongoose.model('users', userSchema);