const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    number: String,
    email: String,
    password: String,
    bookings: [{
        packageTitle: String,
        tourLocation: String,
        price: String,
        description: String,
        blobUrl: String,
        date: String,
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
