import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

function MyBookings() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError('Please log in to view your bookings');
        return;
      }

      try {
        console.log('Fetching bookings from /api/bookings/my-bookings');
        const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
        console.error('Error fetching bookings:', err.response?.data?.message || err.message);
      }
    };
    fetchBookings();
  }, [token]);

  if (!token) {
    return (
      <div className="p-4">
        <p>
          Please <Link to="/login" className="text-blue-500 hover:underline">log in</Link> to view your bookings.
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-black">You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded-lg p-4 shadow">
              <p><strong>Listing:</strong> {booking.listing.title}</p>
              <p><strong>Location:</strong> {booking.listing.location}</p>
              <p><strong>Check-In Date:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p><strong>Check-Out Date:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;