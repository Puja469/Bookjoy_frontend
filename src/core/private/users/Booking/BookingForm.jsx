import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import { useAuth } from "../../../../context/AuthContext";
import { fetchUserDetails } from "../../../../services/apiServices";

function BookingForm() {
  const navigate = useNavigate();
  const { fname, userId } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    eventName: "",
    function_time: "Day",
  });

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [venueId, setVenueId] = useState(null);
  const [venue, setVenue] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [autoFilled, setAutoFilled] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (userId && token) {
          const userData = await fetchUserDetails(userId, token);
          setUserDetails(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUser();
  }, [userId]);

  // Auto-fill user data when user details are loaded
  useEffect(() => {
    if (userDetails) {
      const newFormData = { ...formData };
      const newAutoFilled = { ...autoFilled };

      // Auto-fill full name (combine fname and lname if available)
      if (userDetails.fname && !formData.name) {
        const fullName = userDetails.lname ? `${userDetails.fname} ${userDetails.lname}` : userDetails.fname;
        newFormData.name = fullName;
        newAutoFilled.name = true;
      }

      // Auto-fill email
      if (userDetails.email && !formData.email) {
        newFormData.email = userDetails.email;
        newAutoFilled.email = true;
      }

      // Auto-fill phone
      if (userDetails.phone && !formData.phone) {
        newFormData.phone = userDetails.phone;
        newAutoFilled.phone = true;
      }

      setFormData(newFormData);
      setAutoFilled(newAutoFilled);

      // Show success message if any field was auto-filled
      const filledFields = Object.values(newAutoFilled).filter(Boolean).length;
      if (filledFields > 0) {
        toast.success(`Auto-filled ${filledFields} field(s) with your profile data`);
      }
    }
  }, [userDetails]);

  useEffect(() => {
    const storedCheckIn = localStorage.getItem("selectedCheckInDate");
    const storedCheckOut = localStorage.getItem("selectedCheckOutDate");
    const storedVenueId = localStorage.getItem("selectedVenueId");

    if (!storedVenueId || !storedCheckIn || !storedCheckOut) {
      toast.error("Missing booking details. Please go back and select a venue.");
      navigate("/");
      return;
    }

    setCheckIn(storedCheckIn);
    setCheckOut(storedCheckOut);
    setVenueId(storedVenueId);

    const fetchData = async () => {
      try {
        const [venueRes, eventRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/venue/${storedVenueId}`),
          axios.get("http://localhost:3000/api/event"),
        ]);

        const venueData = venueRes.data;
        const eventList = eventRes.data;

        setVenue(venueData);
        setEvents(eventList);

        // Auto-select function type based on venue's event_type_id
        let selectedEventName = "";

        if (venueData.event_type_id && venueData.event_type_id.eventName) {
          const venueEventName = venueData.event_type_id.eventName;
          const matchedEvent = eventList.find((e) => e.eventName === venueEventName);
          if (matchedEvent) {
            selectedEventName = matchedEvent.eventName;
            console.log("Auto-selected event type:", selectedEventName);
          } else {
            console.log("No matching event found for venue event type:", venueEventName);
            selectedEventName = "";
          }
        } else {
          console.log("Venue has no event_type_id or eventName");
          selectedEventName = "";
        }

        setFormData((prev) => ({
          ...prev,
          eventName: selectedEventName,
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load venue or event data");
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "guests" && venue && value > venue.capacity) {
      toast.warning(`This venue only allows up to ${venue.capacity} guests.`);
      return;
    }

    // Clear auto-filled status when user manually changes a field
    if (autoFilled[name]) {
      setAutoFilled(prev => ({
        ...prev,
        [name]: false
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!checkIn || !checkOut || !formData.name || !formData.email || !formData.phone || !formData.guests) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (venue && parseInt(formData.guests) > venue.capacity) {
      toast.warning(`Maximum allowed guests is ${venue.capacity}`);
      return;
    }

    if (!formData.eventName) {
      toast.error("Please select a function type.");
      return;
    }

    const selectedEvent = events.find((event) => event.eventName === formData.eventName);
    if (!selectedEvent) {
      toast.error("Selected event type is invalid.");
      return;
    }

    const booking = {
      user_id: userId,
      venue_id: venueId,
      event_id: selectedEvent._id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      guests: parseInt(formData.guests),
      check_in_date: checkIn,
      check_out_date: checkOut,
      function_type: formData.eventName,
      function_time: formData.function_time,
    };

    localStorage.setItem("bookingForm", JSON.stringify(booking));
    toast.success("Booking details saved!");
    navigate("/booking/menu");
  };

  const handleBack = () => {
    navigate(`/venue/${venueId}`);
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen px-6 pt-28 pb-10 bg-white">
        <div className="max-w-4xl mx-auto border-2 border-gray-300 rounded-3xl p-8 bg-white shadow-sm">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={handleBack} className="text-gray-700 hover:text-[#F87171] text-xl">
                <FaArrowLeft />
              </button>
              <h2 className="text-3xl font-bold">BOOK NOW</h2>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4">
              {/* Name Field */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-[#F87171]" />
                  <label className="text-gray-700 font-medium">Full Name *</label>
                </div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full border rounded-full px-4 py-2 transition-all duration-200 ${autoFilled.name
                    ? 'border-[#F87171] bg-red-50'
                    : 'border-gray-300 focus:border-[#F87171] focus:outline-none'
                    }`}
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <FaEnvelope className="text-[#F87171]" />
                  <label className="text-gray-700 font-medium">Email Address *</label>
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`w-full border rounded-full px-4 py-2 transition-all duration-200 ${autoFilled.email
                    ? 'border-[#F87171] bg-red-50'
                    : 'border-gray-300 focus:border-[#F87171] focus:outline-none'
                    }`}
                />
              </div>

              {/* Phone Field */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <FaPhone className="text-[#F87171]" />
                  <label className="text-gray-700 font-medium">Phone Number *</label>
                </div>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={`w-full border rounded-full px-4 py-2 transition-all duration-200 ${autoFilled.phone
                    ? 'border-[#F87171] bg-red-50'
                    : 'border-gray-300 focus:border-[#F87171] focus:outline-none'
                    }`}
                />
              </div>

              <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
                <p><strong>Check-in:</strong> {formatDate(checkIn)}</p>
                <p><strong>Check-out:</strong> {formatDate(checkOut)}</p>
              </div>

              <input
                name="guests"
                type="number"
                value={formData.guests}
                onChange={handleChange}
                placeholder="Number of Guests"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:border-[#F87171] focus:outline-none"
              />

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
                      className="text-[#F87171]"
                    />
                    {event.eventName}
                  </label>
                ))}
              </div>

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
                      className="text-[#F87171]"
                    />
                    {time}
                  </label>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#F87171] text-white rounded-full py-3 text-lg font-semibold mt-6 hover:bg-[#ef4444] transition-colors duration-200"
              >
                Review Menu Tier
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BookingForm;
