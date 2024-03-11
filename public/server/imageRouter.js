const express = require('express');
const router = express.Router();
const Image = require('../models/image');

router.get('/image', async (req, res) => {
    const { imageId } = req.query;

    try {
        const image = await Image.findById(imageId);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.setHeader('Content-Type', image.contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${image.fileName}`);

        // Send the image data as a buffer directly
        res.send({
            fileName: image.fileName,
            fileData: image.data.toString('base64'),
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching image data', error: error.message });
    }
});

module.exports = router;
