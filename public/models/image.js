const mongoose = require('mongoose');

const thumbnailImageSchema = new mongoose.Schema({
    fileName: String,
  data: Buffer,
  contentType: String,
 });

const ThumbnailImage = mongoose.model('Image', thumbnailImageSchema);

module.exports = ThumbnailImage;
