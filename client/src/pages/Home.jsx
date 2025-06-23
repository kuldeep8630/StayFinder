import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchListings = async () => {
    try {
      const API_URL = 'https://stayfinder-backend.onrender.com';
      const response = await axios.get(`${API_URL}/api/listings`, {
        params: filters,
      });
      setListings(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.response?.data?.message || 'Failed to fetch listings');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      minPrice: '',
      maxPrice: '',
    });
    setTimeout(fetchListings, 0);
  };

  if (error) {
    return <div className="p-4"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="p-4 bg-#865D36">
      <h1 className="text-3xl font-bold mb-4">Available Listings</h1>
      {/* Search and Filter Form */}
      <form
        onSubmit={handleFilterSubmit}
        className="mb-6 p-4 rounded-lg shadow"
        style={{
          background: 'linear-gradient(135deg, #124E66 0%, #bcb7b0 100%)',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Search by Title:</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Enter title..."
              className="border border-[#124E66] rounded focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Location:</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter location..."
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Min Price:</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min price"
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Max Price:</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max price"
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            type="submit"
            className="bg-[#071b23] text-white px-4 py-2 rounded hover:bg-[#0e3b4d]"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </form>

      {/* Listings Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No listings found.</p>
        ) : (
          listings.map(listing => (
            <Link to={`/listing/${listing._id}`} key={listing._id} className="no-underline text-black">
              <div className="border border-[#124E66] rounded-lg p-4 shadow hover:shadow-lg transition">
                {listing.images && listing.images.length > 0 ? (
                  <div className="flex overflow-x-auto space-x-2 mb-2">
                    {listing.images.map((image, index) => (
                      <img
                        key={index}
                        src={`https://stayfinder-backend.onrender.com${image}`} // Updated to live backend
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
                <p className="text-black">{listing.description}</p>
                <p><strong>Location:</strong> {listing.location}</p> {/* Fixed to listing.location */}
                <p><strong>Price:</strong> ${listing.price}/night</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;