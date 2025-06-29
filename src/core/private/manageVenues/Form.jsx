import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price_per_plate: "",
    full_day_price: "",
    info: "",
    location: "",
    latitude: "",
    longitude: "",
    capacity: "",
    eventName: "",
  });

  const [images, setImages] = useState([null, null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null, null]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3000/api/event")
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/venue/${id}`)
        .then((res) => {
          const v = res.data;
          setFormData({
            name: v.name,
            price_per_plate: v.price_per_plate,
            full_day_price: v.full_day_price,
            info: v.info,
            location: v.location,
            latitude: v.latitude || "",
            longitude: v.longitude || "",
            capacity: v.capacity,
            eventName: v.event_type_id?.eventName || "",
          });
        })
        .catch(() => setError("Failed to load venue"));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setImageError("");

    const selectedImages = images.filter(Boolean);
    if (selectedImages.length < 5 && !id) {
      setImageError("Minimum 5 images are required to create listing.");
      return;
    }

    const selectedEvent = events.find(ev => ev.eventName === formData.eventName);
    if (!selectedEvent) {
      setError("Please select a valid event type.");
      return;
    }

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name.trim());
    form.append("price_per_plate", Number(formData.price_per_plate));
    form.append("full_day_price", Number(formData.full_day_price));
    form.append("info", formData.info.trim());
    form.append("location", formData.location.trim());
    form.append("latitude", Number(formData.latitude));
    form.append("longitude", Number(formData.longitude));
    form.append("capacity", Number(formData.capacity));
    form.append("event_type_id", selectedEvent._id);

    selectedImages.forEach((img) => {
      form.append("images", img);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/venue/${id}`, form, config);
        toast.success("Venue updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/venue", form, config);
        toast.success("Venue created successfully!");
      }

      navigate("/admin/venues", { state: { refresh: true } });
    } catch (err) {
      console.error("Failed to save venue:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to save venue. Please check all fields.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 underline mb-4"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-4">
        {id ? "Edit Venue" : "Add Venue"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Uploads */}
        {!id && (
          <>
            <div className="flex flex-wrap gap-2">
              {images.map((_, index) => (
                <label
                  key={index}
                  className="w-20 h-20 border border-gray-300 rounded flex items-center justify-center text-sm cursor-pointer overflow-hidden relative"
                >
                  {imagePreviews[index] ? (
                    <img
                      src={imagePreviews[index]}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">+ image</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </label>
              ))}
            </div>
            {imageError && (
              <p className="text-red-500 text-sm">{imageError}</p>
            )}
          </>
        )}

        {/* Form Fields */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Venue/Hotel Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price_per_plate"
          value={formData.price_per_plate}
          onChange={handleChange}
          placeholder="Price Per Plate"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="full_day_price"
          value={formData.full_day_price}
          onChange={handleChange}
          placeholder="Full Day Price"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="info"
          value={formData.info}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Max Occupancy"
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Event Type</option>
          {Array.isArray(events) &&
            events.map((event) => (
              <option key={event._id} value={event.eventName}>
                {event.eventName}
              </option>
            ))}
        </select>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded text-white bg-[#F87171] hover:opacity-90"
        >
          {id ? "Update Venue" : "Add Venue"}
        </button>
      </form>
    </div>
  );
};

export default Form;
