const mongoose = require('mongoose');
const { Schema } = mongoose;

const travelPackageSchema = new Schema({
  packageTitle: {
    type: String,
    required: true,
  },
  tourLocation: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnailImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
});

const TravelPackage = mongoose.model('TravelPackage', travelPackageSchema);

module.exports = TravelPackage;
