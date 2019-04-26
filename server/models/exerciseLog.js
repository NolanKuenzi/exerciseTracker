const mongoose = require('mongoose');

const newExercisesSchema = new mongoose.Schema({
    userId: {
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
    }
});

/*
const newExercisesSchema = new mongoose.Schema({
    userId: {
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
    }
});
*/

module.exports = mongoose.model('exercise', newExercisesSchema);
