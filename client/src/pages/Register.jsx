import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function Register() {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting registration form with:', formData);
      await register(formData.username, formData.email, formData.password);
      console.log('Registration successful, redirecting to login');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to register';
      setError(errorMessage);
      console.error('Registration error:', errorMessage);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-black">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-black">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"

          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-black">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"

          />
        </div>
        <button type="submit" className="bg-[#071b23]  text-white px-4 py-2 rounded hover:bg-[#124E66]">
          Register
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
      </p>
    </div>
  );
}

export default Register;