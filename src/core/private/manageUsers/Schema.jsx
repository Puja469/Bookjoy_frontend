import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateVenueForm = () => {
  const [venueData, setVenueData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenue = async () => {
      const response = await fetch(`http://localhost:3000/api/venue/${id}`);
      const data = await response.json();
      setVenueData(data);
    };

    fetchVenue();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenueData({ ...venueData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:3000/api/venue/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venueData),
    });

    if (response.ok) {
      const data = await response.json();
      toast.success('Venue updated successfully!');
      navigate('/admin/dashboard');  // Redirect after updating
    } else {
      const data = await response.json();
      toast.error(data.message || 'Failed to update venue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields for venue details like in CreateVenueForm */}
      <input
        type="text"
        name="name"
        value={venueData.name}
        onChange={handleInputChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {/* Add other input fields */}
      <button type="submit" className="py-2 bg-blue-600 text-white font-semibold rounded-md">
        Update Venue
      </button>
    </form>
  );
};

export default UpdateVenueForm;
