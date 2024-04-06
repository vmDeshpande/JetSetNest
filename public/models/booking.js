const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    username: String,
    number: String,
    email: String,
    bookings: [{
        packageTitle: String,
        tourLocation: String,
        price: String,
        description: String,
        blobUrl: String,
        date: String,
    }],
});

const Bookings = mongoose.model('Bookings', bookingSchema);

module.exports = Bookings;
