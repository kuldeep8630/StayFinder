# StayFinder
A full-stack web app for property listings and bookings, built as part of The Glen Web Development Internship.

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Map: Leaflet

## Setup Instructions
1. Clone the repository: `git clone https://github.com/kuldeep8630/StayFinder.git`
2. Navigate to the project folder: `cd StayFinder`
3. Install backend dependencies: `cd server && npm install`
4. Install frontend dependencies: `cd ../client && npm install`
5. Set up MongoDB (e.g., `mongod --dbpath D:\stayfinder\data\db`)
6. Create a `.env` file in `server` with:PORT=5000 MONGODB_URI=mongodb://localhost:27017/stayfinder
7. Start the backend: `cd server && node server.js`
8. Start the frontend: `cd ../client && npm run dev`
9. Access the app at `http://localhost:5173`

## Features
- Property listings with search filters
- User authentication
- Booking system
- Map integration
