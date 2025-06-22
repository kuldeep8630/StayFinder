const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'));
  },
});

// Get all listings with search and filter support
router.get('/', async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice } = req.query;
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const listings = await Listing.find(query);
    res.json(listings);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all listings by the authenticated user
router.get('/user/my-listings', authMiddleware, async (req, res) => {
  console.log('Hit GET /api/listings/user/my-listings route');
  try {
    const listings = await Listing.find({ host: req.user });
    res.json(listings);
  } catch (err) {
    console.error('Error fetching user listings:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a single listing by ID
router.get('/:id', async (req, res) => {
  console.log(`Hit GET /api/listings/:id route with id: ${req.params.id}`);
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    console.error('Error fetching listing by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new listing (protected route)
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, location, price } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    const listing = new Listing({
      title,
      description,
      location,
      price,
      images: imagePaths,
      host: req.user,
    });
    await listing.save();
    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a listing (protected route)
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.host.toString() !== req.user) {
      return res.status(403).json({ message: 'You can only edit your own listings' });
    }

    const { title, description, location, price, imagesToRemove } = req.body;

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.location = location || listing.location;
    listing.price = price || listing.price;

    let imagesToRemoveArray = [];
    if (imagesToRemove) {
      imagesToRemoveArray = JSON.parse(imagesToRemove);
    }

    if (imagesToRemoveArray.length > 0) {
      imagesToRemoveArray.forEach(imagePath => {
        const filePath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      listing.images = listing.images.filter(image => !imagesToRemoveArray.includes(image));
    }

    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
      listing.images = [...listing.images, ...newImagePaths];
    }

    await listing.save();
    res.json({ message: 'Listing updated successfully', listing });
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a listing (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.host.toString() !== req.user) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    listing.images.forEach(imagePath => {
      const filePath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Listing.deleteOne({ _id: req.params.id });
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;