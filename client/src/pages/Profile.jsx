import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { token, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('Please log in to view your profile');
        return;
      }

      try {
        console.log('Token being sent for profile:', token); // Add this
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };
    fetchProfile();
  }, [token]);

  if (!token) {
    return (
      <div className="p-4">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4"><p className="text-red-500">{error}</p></div>;
  }

  if (!profile) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="border border-[#124E66] rounded-lg p-4 shadow hover:shadow-lg transition">
        {profile.image ? (
          <img
            src={`http://localhost:5000${profile.image}`}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-32 h-32 bg-[#ffffff20] text-[#bcb7b0] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#124E66]">
            <span>No Image</span>
          </div>
        )}
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
      <button
        onClick={() => navigate('/edit-profile')}
        className="mt-4 bg-[#071b23]  text-white px-4 py-2 rounded hover:bg-[#124E66]"
      >
        Edit Profile
      </button>
    </div>
  );
}

export default Profile;