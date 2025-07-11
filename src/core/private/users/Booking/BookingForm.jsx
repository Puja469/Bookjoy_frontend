import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fname, userId } = useAuth();

  const [formData, setFormData] = useState({
    name: fname || "",
    email: "",
    phone: "",
    guests: "",
    eventName: "",
    function_time: "Day",
  });

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [venueId, setVenueId] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  // Fetch events list
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/event")
      .then((res) => {
        setEvents(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            eventName: res.data[0].eventName,
          }));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setError("Failed to load event types");
      });
  }, []);

  // Check venue and date range
  useEffect(() => {
    if (!location.state || !location.state.venueId || !location.state.dateRange) {
      alert("Please go back and select a venue with check-in/check-out dates.");
      navigate("/");
      return;
    }

    setVenueId(location.state.venueId);
    setCheckIn(location.state.dateRange[0]);
    setCheckOut(location.state.dateRange[1]);
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !checkIn ||
      !checkOut ||
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.guests
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Map selected eventName to actual event_id
    const selectedEvent = events.find(
      (event) => event.eventName === formData.eventName
    );

    if (!selectedEvent) {
      alert("Selected event type is invalid.");
      return;
    }

    const booking = {
      user_id: userId,
      venue_id: venueId,
      event_id: selectedEvent._id, 
      name: formData.name,
      email: formData.email,
      guests: parseInt(formData.guests), 
      check_in_date: checkIn,
      check_out_date: checkOut,
      function_type: formData.eventName,
      function_time: formData.function_time,
    };

    localStorage.setItem("bookingForm", JSON.stringify(booking));
    navigate("/booking/menu");
  };

  const handleBack = () => {
    navigate(`/venue/${venueId}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen px-6 pt-28 pb-10 bg-white">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={handleBack} className="text-gray-700 hover:text-red-500 text-xl">
              <FaArrowLeft />
            </button>
            <h2 className="text-3xl font-bold">BOOK NOW</h2>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border border-gray-300 rounded-full px-4 py-2"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-300 rounded-full px-4 py-2"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded-full px-4 py-2"
            />

            {/* Check-in and Check-out */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Check-In Date</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-4 py-2 mb-4"
              />
              <label className="block text-gray-700 font-medium mb-1">Check-Out Date</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-4 py-2"
              />
            </div>

            <input
              name="guests"
              type="number"
              value={formData.guests}
              onChange={handleChange}
              placeholder="Number of Guests"
              className="w-full border border-gray-300 rounded-full px-4 py-2"
            />

            {/* Function Type */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-700 font-medium">Function Type</span>
              {events.map((event) => (
                <label key={event._id} className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="eventName"
                    value={event.eventName}
                    checked={formData.eventName === event.eventName}
                    onChange={handleChange}
                  />
                  {event.eventName}
                </label>
              ))}
            </div>

            {/* Function Time */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">Function Time</span>
              {["Day", "Evening"].map((time) => (
                <label key={time} className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="function_time"
                    value={time}
                    checked={formData.function_time === time}
                    onChange={handleChange}
                  />
                  {time}
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#F87171] text-white rounded-full py-3 text-lg font-semibold mt-6"
            >
              Review Menu Tier
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BookingForm;