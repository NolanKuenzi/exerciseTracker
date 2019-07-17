const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
      type: String,
    },
    username: {
        type: String,
    },
    count: {
      type: String,
    },
    log: [
           {
             _id: false,

             logId: {
              type: String,
             },
             description: {
               type: String,
            },
             duration: {
               type: String,
            },
             date: {
               type: String,
            },
        }
    ],
});

module.exports = mongoose.models.users ||  mongoose.model('users', userSchema);