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
  origin: 'http://localhost:5173', // Replace with your Vercel URL (e.g., https://stayfinder.vercel.app) after deployment
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Use environment variable for MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stayfinder';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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