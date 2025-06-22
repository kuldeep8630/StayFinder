const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const bookingsRoutes = require('./routes/bookings');
require('dotenv').config();

const app = express();

// Update CORS to allow the deployed frontend URL (update after frontend deployment)
app.use(cors({
  origin: 'https://stayfinder-frontend-bwxhc1xyg-kuldeep-pals-projects-21041dff.vercel.app',
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// use environment variable for MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stayfinder';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const bcrypt = require('bcryptjs');

mongoose.connection.once('open', async () => {
  try {
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('testpass', 10),
      });
      await user.save();
      console.log('Seeded user:', user);
    }

    let listing = await Listing.findOne({ title: 'Test Listing' });
    if (!listing) {
      listing = new Listing({
        title: 'Test Listing',
        description: 'A test property',
        location: { address: 'Test City' }, // Adjusted for your model
        price: 100,
        host: user._id,
        images: ['/uploads/sample.jpg'],
      });
      await listing.save();
      console.log('Seeded listing:', listing);
    }

    let booking = await Booking.findOne({ user: user._id });
    if (!booking) {
      booking = new Booking({
        listing: listing._id,
        user: user._id,
        checkInDate: new Date('2025-07-01'),
        checkOutDate: new Date('2025-07-05'),
        totalPrice: 400,
      });
      await booking.save();
      console.log('Seeded booking:', booking);
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
});

console.log('Registering routes...');
app.use('/api/auth', authRoutes);
console.log('Auth routes registered');
app.use('/api/listings', listingsRoutes);
console.log('Listings routes registered');
app.use('/api/bookings', bookingsRoutes);
console.log('Bookings routes registered');

app.use((req, res) => {
  console.log(`No route matched for: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});