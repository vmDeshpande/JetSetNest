const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const path = require('path');
const User = require('../models/user');
const Booking = require('../models/booking');
const Admin = require('../models/admin');
const Inquire = require('../models/inquires');
const TravelPackage = require('../models/packages');
const ThumbnailImage = require('../models/image'); // Import the ThumbnailImage model
const secretKey = crypto.randomBytes(64).toString('hex');
const router = express.Router();
const imageRouter = require('./imageRouter');
const app = express();
app.use(imageRouter);

console.log(secretKey)

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
}));
const PORT = 3000;

app.use(bodyParser.json());

try {
    mongoose.connect('mongodb+srv://admin:admin123@cluster0.riwsuqy.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database Connected")
    
} catch (error) {
    console.error(error.message);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});


// register api
app.post('/register', async (req, res) => {
    const { username, number, email, password } = req.body;
    try {
        const newUser = new User({
            username,
            number,
            email,
            password,
        });

        await newUser.save();
        res.json({ message: 'User registration successful' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// contact api
app.post('/inquire', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newData = new Inquire({
            name,
            email,
            message,
        });

        await newData.save();
        res.json({ message: 'Inquire Submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Inquire Submission failed', error: error.message });
    }
});

// get all inquiries api
app.get('/get-all-inquiries', async (req, res) => {
    try {
        // Retrieve all inquiries from the database
        const inquiries = await Inquire.find();

        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
    }
});


// login api
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.user = user;
            res.json({ message: 'User login successful' });

        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});
// admin login api
app.post('/adminlogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username, password });
        if (admin) {
            req.session.admin = admin;
            res.json({ message: 'Admin login successful' });

        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});
// check auth statue
app.get('/check-auth-status', (req, res) => {
    const isAuthenticated = req.session.user;

    const isUser = req.session.user !== undefined;
    const isAdmin = req.session.admin !== undefined;

    res.json({ isAuthenticated, isAdmin, isUser });
});

// logout api
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ message: 'Logout failed' });
        } else {
            res.json({ message: 'Logout successful' });
        }
    });
});

// submit packages
app.post('/upload-package', upload.single('thumbnailImage'), async (req, res) => {
    const { packageTitle, tourLocation, price, date, description } = req.body;
    const dateObject = new Date(date);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateObject.getMonth()];
    const dayOfWeek = dateObject.toLocaleDateString('en-US', { weekday: 'short' });
    const year = dateObject.getFullYear();
    const dayOfMonth = dateObject.getDate();
    const formattedDate = `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
    try {
        const image = req.file;
        if(!image) {
            return res.status(400).json({ message: 'Image file is required' });
        }
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }
        const randomNumber = getRandomNumber(1, 101);
        const thumbnailImageExtention = path.extname(image.originalname);
        const newFileName = `Image${randomNumber}${thumbnailImageExtention}`;

        const newImage = new ThumbnailImage({
            fileName: newFileName,
            data: image.buffer,
            contentType: image.mimetype,
        });

        await newImage.save();


        const newPackage = new TravelPackage({
            packageTitle,
            tourLocation,
            price,
            date: formattedDate,
            description,
            thumbnailImage: newImage.id,
        });

        await newPackage.save();
        res.json({ message: 'Package uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Package upload failed', error: error.message });
    }
});

// get packages
app.get('/get-packages-listings', async (req, res) => {
    try {
        const packageListings = await TravelPackage.find();

        res.json(packageListings);
    } catch (error) {
        console.log("package error: " + error)
        res.status(500).json({ message: 'Error fetching job listings', error: error.message });
    }
});

app.get('/get-booked-packages-listings', async (req, res) => {
    const username = req.session.user.username;

    try {
        // Find the user by username
        const bookings = await Booking.find({ username: username });

        if (!bookings) {
            return res.status(404).json({ message: 'bookings not found' });
        }

        res.json(bookings);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Error fetching booked packages listings', error: error.message });
    }
});

app.get('/get-booked-packages-listings-admin', async (req, res) => {

    try {
        const booking = await Booking.find();

        if (!booking) {
            return res.status(404).json({ message: 'bookings not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Error fetching booked packages listings', error: error.message });
    }
});


app.post('/package-booking', async (req, res) => {
    const { date, blobUrl, packageTitle, tourLocation, price, description } = req.body;
    try {
        const username = req.session.user.username;
    const number = req.session.user.number;
    const email = req.session.user.email;
        // Create a new instance of the Bookings model
        const newBooking = new Booking({
            username,
            number,
            email,
            bookings: [{
                packageTitle,
                tourLocation,
                price,
                description,
                blobUrl,
                date
            }]
        });

        // Save the new booking to the database
        await newBooking.save();

        res.json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating application status', error: error.message });
    }
});

app.post('/cancel-package-booking', async (req, res) => {
    const { packageTitle } = req.body;
    try {
        const userName = req.session.user.username;

        // Find and delete the booking entry with the specified packageTitle
        const result = await Booking.findOneAndDelete(
            { username: userName, 'bookings.packageTitle': packageTitle }
        );

        if (!result) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error canceling booking', error: error.message });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
