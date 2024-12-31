const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema ({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: Date.now
    },
    address: {
        type: String,
        required: true,
    },
    orderHistory: {
        type: String
    }
});

module.exports = mongoose.model('User', User);