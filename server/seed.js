const mongoose = require('mongoose');
const Listing = require('./models/Listing');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Listing.deleteMany({});

    await Listing.create([
      {
        title: 'Cozy Apartment',
        description: 'A cozy apartment in the city center.',
        location: 'New York, NY',
        price: 100,
        images: ['https://via.placeholder.com/300'],
      },
      {
        title: 'Beach House',
        description: 'A beautiful beach house with ocean views.',
        location: 'Miami, FL',
        price: 200,
        images: ['https://via.placeholder.com/300'],
      },
    ]);

    console.log('Database seeded');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));