import { useState, useContext } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { AuthContext } from '../context/AuthContext.jsx';

  function CreateListing() {
    const { token } = useContext(AuthContext);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      location: '',
      price: '',
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
      const files = [...e.target.files];
      setImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!token) {
        setError('Please log in to create a listing');
        return;
      }

      try {
        const formDataWithImages = new FormData();
        formDataWithImages.append('title', formData.title);
        formDataWithImages.append('description', formData.description);
        formDataWithImages.append('location', formData.location);
        formDataWithImages.append('price', formData.price);
        images.forEach(image => formDataWithImages.append('images', image));
        console.log('Submitting formData details:', {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          price: formData.price,
          imagesCount: images.length,
        }); // Detailed debug
        const response = await axios.post('https://stayfinder-v2y6.onrender.com/api/listings', formDataWithImages, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 10000, // Add timeout to catch hanging requests
        });

        setSuccess(response.data.message);
        setError('');
        setFormData({ title: '', description: '', location: '', price: '' });
        setImages([]);
        setImagePreviews([]);
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        console.error('Create Listing Error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        }); // Detailed error logging
        setError(err.response?.data?.message || `Network error: ${err.message}. Check backend status.`);
        setSuccess('');
      }
    };

    if (!token) {
      return (
        <div className="p-4">
          <p>Please log in to create a listing.</p>
        </div>
      );
    }

    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Create a New Listing</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
            />
          </div>
          <div>
            <label className="block mb-1">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
            />
          </div>
          <div>
            <label className="block mb-1">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
            />
          </div>
          <div>
            <label className="block mb-1">Price per Night ($):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border border-[#124E66] focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none rounded p-2 w-full bg-[#ffffff20] text-black placeholder-[#bcb7b0]"
            />
          </div>
          <div>
            <label className="block mb-1">Images (up to 5, .jpg/.png):</label>
            <input
              type="file"
              name="images"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleImageChange}
              className="w-full border border-[#124E66] rounded p-2
               bg-[#ffffff20] text-[#bcb7b0]
               file:bg-[#124E66] file:text-white file:border-none
               file:px-4 file:py-2 file:rounded file:mr-4
               hover:file:bg-[#0f3e52]
               focus:border-[#124E66] focus:ring-1 focus:ring-[#124E66] focus:outline-none"
            />
            {imagePreviews.length > 0 && (
              <div className="flex overflow-x-auto space-x-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="bg-[#071b23] text-white px-4 py-2 rounded hover:bg-[#124E66]">
            Create Listing
          </button>
        </form>
      </div>
    );
  }

  export default CreateListing;