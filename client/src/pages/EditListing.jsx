import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function EditListing() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
  });
  const [images, setImages] = useState([]); // New images to upload
  const [imagePreviews, setImagePreviews] = useState([]); // Previews for new images
  const [existingImages, setExistingImages] = useState([]); // Existing images from the listing
  const [imagesToRemove, setImagesToRemove] = useState([]); // Images to remove
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://stayfinder-v2y6.onrender.com/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { title, description, location, price, images } = response.data;
        setFormData({ title, description, location, price: price.toString() });
        setExistingImages(images || []); // Load existing images
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listing');
      }
    };
    fetchListing();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImages(files);

    // Generate previews for new images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveExistingImage = (imagePath) => {
    setImagesToRemove([...imagesToRemove, imagePath]);
    setExistingImages(existingImages.filter(image => image !== imagePath));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in to edit a listing');
      return;
    }

    try {
      const formDataWithImages = new FormData();
      formDataWithImages.append('title', formData.title);
      formDataWithImages.append('description', formData.description);
      formDataWithImages.append('location', formData.location);
      formDataWithImages.append('price', formData.price);
      // Send images to remove as a JSON string
      formDataWithImages.append('imagesToRemove', JSON.stringify(imagesToRemove));
      // Add new images
      images.forEach(image => {
        formDataWithImages.append('images', image);
      });

      const response = await axios.put(`https://stayfinder-v2y6.onrender.com/api/listings/${id}`, formDataWithImages, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(response.data.message);
      setError('');
      setTimeout(() => navigate('/my-listings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing');
      setSuccess('');
    }
  };

  if (!token) {
    return (
      <div className="p-4">
        <p>Please log in to edit a listing.</p>
      </div>
    );
  }

  if (error && !formData.title) {
    return <div className="p-4"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Listing</h1>
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
          <label className="block mb-1">Existing Images:</label>
          {existingImages.length > 0 ? (
            <div className="flex overflow-x-auto space-x-2 mb-2">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={`https://stayfinder-v2y6.onrender.com${image}`} // Updated URL
                    alt={`Existing ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No existing images.</p>
          )}
        </div>
        <div>
          <label className="block mb-1">
            Add New Images (optional, .jpg/.png):
          </label>
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
        <button type="submit" className="bg-[#071b23]  text-white px-4 py-2 rounded hover:bg-[#124E66]">
          Update Listing
        </button>
      </form>
    </div>
  );
}

export default EditListing;