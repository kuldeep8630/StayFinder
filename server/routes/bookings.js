const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const authMiddleware = require('../middleware/auth');

// Create a booking (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { listingId, checkInDate, checkOutDate } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check for overlapping bookings
    const existingBookings = await Booking.find({ listing: listingId });
    const hasOverlap = existingBookings.some(booking => {
      const existingCheckIn = new Date(booking.checkInDate);
      const existingCheckOut = new Date(booking.checkOutDate);
      return (
        (checkIn >= existingCheckIn && checkIn < existingCheckOut) || // Check-in falls within an existing booking
        (checkOut > existingCheckIn && checkOut <= existingCheckOut) || // Check-out falls within an existing booking
        (checkIn <= existingCheckIn && checkOut >= existingCheckOut) // New booking completely overlaps an existing booking
      );
    });

    if (hasOverlap) {
      return res.status(400).json({ message: 'Listing is unavailable for the selected dates' });
    }

    const totalPrice = nights * listing.price;

    const booking = new Booking({
      listing: listingId,
      user: req.user,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings for the authenticated user
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user }).populate('listing');
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;