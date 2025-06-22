import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

function MyListings() {
  const { token } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!token) {
        setError('Please log in to view your listings');
        return;
      }

      try {
        console.log('Fetching from /api/listings/user/my-listings');
        const response = await axios.get('http://localhost:5000/api/listings/user/my-listings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your listings');
      }
    };
    fetchMyListings();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(listings.filter(listing => listing._id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  if (!token) {
    return (
      <div className="p-4">
        <p>
          Please <Link to="/login" className="text-blue-500 hover:underline">log in</Link> to view your listings.
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">My Listings</h1>
      {listings.length === 0 ? (
        <p className="text-gray-500">You have not created any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(listing => (
            <div key={listing._id} className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded-lg p-4 shadow hover:shadow-lg transition">
              {listing.images && listing.images.length > 0 ? (
                <div className="flex overflow-x-auto space-x-2 mb-2">
                  {listing.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000${image}`}
                      alt={`${listing.title} - ${index + 1}`}
                      className="w-40 h-40 object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
                  <span>No Image Available</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mt-2">{listing.title}</h3>
              <p className="text-gray-600">{listing.description}</p>
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Price:</strong> ${listing.price}/night</p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => navigate(`/edit-listing/${listing._id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;