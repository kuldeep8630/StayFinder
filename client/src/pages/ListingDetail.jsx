import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [bookingForm, setBookingForm] = useState({
    checkInDate: '',
    checkOutDate: '',
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const token = localStorage.getItem('token');

  const today = new Date().toISOString().split('T')[0];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://stayfinder-v2y6.onrender.com/api/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listing');
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!token) {
      setBookingError('Please log in to book this listing');
      return;
    }

    try {
      const response = await axios.post(
        `https://stayfinder-v2y6.onrender.com/api/bookings`,
        { listingId: id, ...bookingForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingSuccess(response.data.message);
      setBookingError('');
      setPaymentConfirmed(false);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to create booking');
      setBookingSuccess('');
    }
  };

  const handleMockPayment = () => {
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      setBookingError('Please select check-in and check-out dates.');
      return;
    }
    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * (listing?.price || 0);

    setBookingError('');
    setTimeout(() => {
      setPaymentConfirmed(true);
      setBookingSuccess(`Payment confirmed! Booking complete for $${totalPrice}. View in My Bookings.`);
      setBookingForm({ checkInDate: '', checkOutDate: '' });
    }, 2000);
  };

  const handleViewBookings = () => {
    navigate('/my-bookings');
  };

  if (error) {
    return <div className="p-4"><p className="text-red-500">{error}</p></div>;
  }

  if (!listing) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-blue-500 mb-4">← Back</button>
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      {listing.images && listing.images.length > 0 ? (
        <div className="mb-4">
          <Slider {...sliderSettings}>
            {listing.images.map((image, index) => (
              <div key={index}>
                <img
                  src={`https://stayfinder-v2y6.onrender.com${image}`}
                  alt={`${listing.title} - ${index + 1}`}
                  className="w-full h-96 object-cover rounded"
                  onError={(e) => { e.target.src = '/placeholder.jpg'; console.log('Image failed:', image); }}
                />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded mb-4">
          <span>No Image Available</span>
        </div>
      )}
      <p className="text-black mb-2">{listing.description}</p>
      <p className="mb-2"><strong>Location:</strong> {listing.location.address || listing.location}</p>
      <p className="mb-4"><strong>Price:</strong> ${listing.price}/night</p>

      <h2 className="text-2xl font-semibold mb-2">Book This Stay</h2>
      {bookingError && <p className="text-red-500 mb-2">{bookingError}</p>}
      {bookingSuccess && <p className="text-green-500 mb-2">{bookingSuccess}</p>}
      {!bookingSuccess && (
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block mb-1">Check-In Date:</label>
            <input
              type="date"
              name="checkInDate"
              value={bookingForm.checkInDate}
              onChange={handleChange}
              min={today}
              required
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-[#bcb7b0]"
            />
          </div>
          <div>
            <label className="block mb-1">Check-Out Date:</label>
            <input
              type="date"
              name="checkOutDate"
              value={bookingForm.checkOutDate}
              onChange={handleChange}
              min={bookingForm.checkInDate || today}
              required
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-[#bcb7b0]"
            />
          </div>
          <button type="submit" className="bg-[#071b23] text-white px-4 py-2 rounded hover:bg-[#124E66]">
            Book Now
          </button>
        </form>
      )}
      {bookingSuccess && !paymentConfirmed && (
        <div className="mt-4">
          <p className="mb-2">Please confirm payment to finalize your booking.</p>
          <button
            onClick={handleMockPayment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Confirm Mock Payment
          </button>
        </div>
      )}
      {paymentConfirmed && (
        <div className="mt-4">
          <button
            onClick={handleViewBookings}
            className="bg-[#071b23] text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View My Bookings
          </button>
        </div>
      )}
    </div>
  );
}

export default ListingDetail;