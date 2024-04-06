const mongoose = require('mongoose');

const inquireSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

const Inquires = mongoose.model('Inquires', inquireSchema);

module.exports = Inquires;
