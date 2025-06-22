import { Link } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Footer() {
  const defaultCenter = [28.6139, 77.2090]; // Delhi, India

  return (
    <footer
      className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-10 mt-6 border-t-2 border-indigo-500/30"
      style={{ boxShadow: '0 -2px 15px rgba(0, 0, 0, 0.3)' }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        {/* About Column */}
        <div className="p-6 bg-gray-900/60 rounded-xl hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-2">
          <h4 className="text-xl font-bold mb-4 text-indigo-300">About StayFinder</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Discover the best stays with StayFinder. Your perfect vacation starts here with seamless booking!
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="p-6 bg-gray-900/60 rounded-xl hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-2">
          <h4 className="text-xl font-bold mb-4 text-indigo-300">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/my-listings" className="text-gray-400 hover:text-indigo-400 transition-colors">
                My Listings
              </Link>
            </li>
            <li>
              <Link to="/my-bookings" className="text-gray-400 hover:text-indigo-400 transition-colors">
                My Bookings
              </Link>
            </li>
            <li>
              <Link to="/create-listing" className="text-gray-400 hover:text-indigo-400 transition-colors">
                List Your Property
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="p-6 bg-gray-900/60 rounded-xl hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-2">
          <h4 className="text-xl font-bold mb-4 text-indigo-300">Contact Us</h4>
          <p className="text-sm text-gray-400 mb-2">
            Email: <a href="mailto:support@stayfinder.com" className="hover:text-indigo-400">support@stayfinder.com</a>
          </p>
          <p className="text-sm text-gray-400">
            Phone: <a href="tel:+919876543210" className="hover:text-indigo-400">+91-98765-43210</a>
          </p>
        </div>

        {/* Map Column */}
        <div className="p-6 bg-gray-900/60 rounded-xl hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-2">
          <h4 className="text-xl font-bold mb-4 text-indigo-300">Our Location</h4>
          <div className="h-36 w-full rounded-xl overflow-hidden border border-indigo-500/20">
            <MapContainer center={defaultCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 mt-8 text-center text-sm border-t border-indigo-500/20 pt-6">
        <p className="text-gray-500">© 2025 StayFinder. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">
            <span className="sr-only">Facebook</span>
            <i className="fab fa-facebook-f"></i> {/* Placeholder, use react-icons */}
          </a>
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">
            <span className="sr-only">Twitter</span>
            <i className="fab fa-twitter"></i> {/* Placeholder */}
          </a>
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">
            <span className="sr-only">Instagram</span>
            <i className="fab fa-instagram"></i> {/* Placeholder */}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;