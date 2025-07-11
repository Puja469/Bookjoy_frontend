import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVenueById, incrementViewCount, getViewCount } from "../../../services/apiServices";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FaStar,
  FaUsers,
  FaEye,
  FaHome,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth(); 

  const [venue, setVenue] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [dateError, setDateError] = useState("");

  // Load dates from localStorage on component mount
  useEffect(() => {
    const savedCheckIn = localStorage.getItem(`checkInDate_${id}`);
    const savedCheckOut = localStorage.getItem(`checkOutDate_${id}`);
    
    if (savedCheckIn) {
      setCheckInDate(new Date(savedCheckIn));
    }
    if (savedCheckOut) {
      setCheckOutDate(new Date(savedCheckOut));
    }
  }, [id]);

  // Save dates to localStorage whenever they change
  const saveDatesToStorage = (checkIn, checkOut) => {
    localStorage.setItem(`checkInDate_${id}`, checkIn.toISOString());
    localStorage.setItem(`checkOutDate_${id}`, checkOut.toISOString());
    
    // Also save global dates for booking process
    localStorage.setItem('selectedCheckInDate', checkIn.toISOString());
    localStorage.setItem('selectedCheckOutDate', checkOut.toISOString());
    localStorage.setItem('selectedVenueId', id);
    localStorage.setItem("selectedEventType", venue.eventName); 
  };

  // Format date to dd/mm/yyyy
  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) return "";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get today's date without time
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const fetchBookedDates = async (venueId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:3000/api/booking/?venue_id=${venueId}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        if (!isLoggedIn || response.status === 401) return [];
        return getMockBookedDates();
      }

      const venueBookings = await response.json();
      const booked = [];

      venueBookings.forEach(booking => {
        const checkInDate = booking.check_in_date || booking.checkInDate || booking.startDate;
        const checkOutDate = booking.check_out_date || booking.checkOutDate || booking.endDate;

        if (checkInDate && checkOutDate) {
          const startDate = new Date(checkInDate);
          const endDate = new Date(checkOutDate);

          for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            booked.push(new Date(date.getTime())); 
          }
        }
      });

      return booked;
    } catch (error) {
      console.error("Error fetching booked dates:", error);
      return isLoggedIn ? getMockBookedDates() : [];
    }
  };

  const getMockBookedDates = () => {
    const today = new Date();
    const mockBookedDates = [];

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 2);

    for (let date = new Date(nextWeekStart); date <= nextWeekEnd; date.setDate(date.getDate() + 1)) {
      mockBookedDates.push(new Date(date.getTime())); 
    }

    const twoWeeksStart = new Date(today);
    twoWeeksStart.setDate(today.getDate() + 14);
    const twoWeeksEnd = new Date(twoWeeksStart);
    twoWeeksEnd.setDate(twoWeeksStart.getDate() + 1);

    for (let date = new Date(twoWeeksStart); date <= twoWeeksEnd; date.setDate(date.getDate() + 1)) {
      mockBookedDates.push(new Date(date.getTime())); 
    }

    return mockBookedDates;
  };

  const handleViewCount = async (venueId) => {
    try {
      const userId = user?.id || user?._id || null;
      const incrementResponse = await incrementViewCount(venueId, userId);
      console.log("Increment response:", incrementResponse);
      
      if (incrementResponse && incrementResponse.view_count !== undefined) {
        console.log("Setting view count to:", incrementResponse.view_count);
        setViewCount(incrementResponse.view_count);
      } else {
        const updatedViewData = await getViewCount(venueId);
        const updatedCount = updatedViewData.view_count || 0;
        console.log("Fallback - Updated view count:", updatedCount);
        setViewCount(updatedCount);
      }
    } catch (error) {
      console.error("Error handling view count:", error);
      const fallbackCount = venue?.view_count || 0;
      console.log("Error fallback - setting view count to:", fallbackCount);
      setViewCount(fallbackCount);
    }
  };

  useEffect(() => {
    const loadVenueData = async () => {
      try {
        const venueData = await fetchVenueById(id);
        setVenue(venueData);
        if (venueData && venueData.image_url) setMainImage(venueData.image_url);

        const initialCount = venueData?.view_count || 0;
        console.log("Initial view count from venue data:", initialCount);
        setViewCount(initialCount);

        const booked = await fetchBookedDates(id);
        setBookedDates(booked);
        
        setLoading(false);
        
        if (venueData) {
          setTimeout(() => {
            handleViewCount(id);
          }, 500);
        }
      } catch (err) {
        console.error("Failed to fetch venue:", err);
        setLoading(false);
      }
    };

    loadVenueData();
  }, [id]);

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const isDateBooked = (date) =>
    bookedDates.some(bookedDate => bookedDate.toDateString() === date.toDateString());

  // Validate check-in date
  const validateCheckInDate = (date) => {
    const today = getTodayDate();
    setDateError("");

    if (date < today) {
      setDateError("Check-in date must be today or in the future.");
      return false;
    }

    if (isDateBooked(date)) {
      setDateError("Selected check-in date is already booked.");
      return false;
    }

    return true;
  };

  // Validate check-out date
  const validateCheckOutDate = (date) => {
    const today = getTodayDate();
    setDateError("");

    if (date < today) {
      setDateError("Check-out date must be today or in the future.");
      return false;
    }

    if (date < checkInDate) {
      setDateError("Check-out date must be after check-in date.");
      return false;
    }

    if (isDateBooked(date)) {
      setDateError("Selected check-out date is already booked.");
      return false;
    }

    // Check if date range exceeds 3 days
    const diffTime = date.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 3) {
      setDateError("Maximum booking period is 3 days.");
      return false;
    }

    return true;
  };

  // Check if any date in the range is booked
  const hasBookingConflict = () => {
    for (let date = new Date(checkInDate); date <= checkOutDate; date.setDate(date.getDate() + 1)) {
      if (isDateBooked(date)) return true;
    }
    return false;
  };

  // Handle check-in date change
  const handleCheckInChange = (date) => {
    if (validateCheckInDate(date)) {
      setCheckInDate(date);
      
      // If check-out date is before new check-in date, adjust it
      let newCheckOut = checkOutDate;
      if (checkOutDate < date) {
        newCheckOut = new Date(date);
        newCheckOut.setDate(date.getDate() + 1);
        setCheckOutDate(newCheckOut);
      }
      
      // If check-out date exceeds 3 days from new check-in, adjust it
      const diffTime = checkOutDate.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 3) {
        const maxCheckOut = new Date(date);
        maxCheckOut.setDate(date.getDate() + 3);
        newCheckOut = maxCheckOut;
        setCheckOutDate(maxCheckOut);
      }
      
      // Save to localStorage
      saveDatesToStorage(date, newCheckOut);
    }
  };

  // Handle check-out date change
  const handleCheckOutChange = (date) => {
    if (validateCheckOutDate(date)) {
      setCheckOutDate(date);
      // Save to localStorage
      saveDatesToStorage(checkInDate, date);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && isDateBooked(date)) {
      return <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1"></div>;
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && isDateBooked(date)) {
      return 'booked-date';
    }
    return null;
  };

  // Disable dates for check-in calendar
  const tileDisabledCheckIn = ({ date, view }) => {
    if (view === 'month') {
      const today = getTodayDate();
      return date < today || isDateBooked(date);
    }
    return false;
  };

  // Disable dates for check-out calendar
  const tileDisabledCheckOut = ({ date, view }) => {
    if (view === 'month') {
      const today = getTodayDate();
      
      // Disable dates before today
      if (date < today) return true;
      
      // Disable dates before check-in date
      if (date < checkInDate) return true;
      
      // Disable booked dates
      if (isDateBooked(date)) return true;
      
      // Disable dates beyond 3 days from check-in
      const diffTime = date.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 3) return true;
    }
    return false;
  };

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      alert("Please login to book a venue.");
      return;
    }

    if (!validateCheckInDate(checkInDate) || !validateCheckOutDate(checkOutDate)) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    if (hasBookingConflict()) {
      alert("Selected dates conflict with existing bookings. Please choose different dates.");
      return;
    }

    // Save final dates to localStorage before navigation
    saveDatesToStorage(checkInDate, checkOutDate);

    navigate("/booking-form", {
      state: {
        venueId: venue._id,
        dateRange: [checkInDate, checkOutDate],
      },
    });
  };

  if (loading || !venue) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-20 text-gray-600">Loading venue details...</div>
        <Footer />
      </div>
    );
  }

  const halfDayPrice = Math.floor(venue.full_day_price / 2);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <style>
        {`
          .booked-date {
            background-color: #fee2e2 !important;
            color: #dc2626 !important;
            position: relative;
          }
          .booked-date:hover {
            background-color: #fecaca !important;
          }
          .react-calendar__tile:disabled.booked-date {
            background-color: #fca5a5 !important;
            color: #ffffff !important;
            cursor: not-allowed;
          }
          .react-calendar__tile--active.booked-date {
            background-color: #dc2626 !important;
            color: white !important;
          }
          .gallery-thumbnail {
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }
          .gallery-thumbnail:hover {
            border-color: #F87171;
            transform: scale(1.05);
          }
          .gallery-thumbnail.active {
            border-color: #F87171;
            box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.2);
          }
          
          /* Fixed calendar container styles */
          .calendars-container {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            background-color: #f9fafb;
          }
          
          .calendar-wrapper {
            flex: 1;
            min-width: 0;
          }
          
          .calendar-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            align-items: start;
          }
          
          .react-calendar {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 12px !important;
            background: white !important;
            border: 1px solid #d1d5db !important;
            border-radius: 6px !important;
            padding: 8px !important;
            box-sizing: border-box !important;
          }
          
          .react-calendar__tile {
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 11px !important;
            padding: 2px !important;
            margin: 1px !important;
          }
          
          .react-calendar__navigation {
            margin-bottom: 8px !important;
          }
          
          .react-calendar__navigation button {
            min-width: 32px !important;
            height: 32px !important;
            font-size: 12px !important;
            padding: 4px !important;
          }
          
          .react-calendar__month-view__weekdays {
            font-size: 10px !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
          }
          
          .react-calendar__month-view__weekdays__weekday {
            padding: 4px !important;
            text-align: center !important;
          }
          
          .react-calendar__month-view__days__day {
            font-size: 11px !important;
          }
          
          @media (max-width: 768px) {
            .calendar-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            
            .react-calendar {
              font-size: 14px !important;
            }
            
            .react-calendar__tile {
              height: 36px !important;
              font-size: 13px !important;
            }
            
            .react-calendar__navigation button {
              min-width: 36px !important;
              height: 36px !important;
              font-size: 14px !important;
            }
            
            .react-calendar__month-view__weekdays {
              font-size: 12px !important;
            }
          }
        `}
      </style>

      {/* Gallery */}
      <div className="px-4 pt-28 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <img
            src={`http://localhost:3000/venue_images/${mainImage}`}
            alt="main venue image"
            className="col-span-1 md:col-span-2 h-[400px] w-full object-cover rounded-lg cursor-pointer"
            onClick={() => handleImageClick(mainImage)}
          />
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <img
              src={`http://localhost:3000/venue_images/${venue.image_url}`}
              className={`h-48 object-cover w-full rounded-lg gallery-thumbnail ${
                mainImage === venue.image_url ? 'active' : ''
              }`}
              alt="venue main"
              onClick={() => handleImageClick(venue.image_url)}
            />
            {venue.images && venue.images.slice(1, 4).map((img, i) => (
              <img
                key={i}
                src={`http://localhost:3000/venue_images/${img}`}
                className={`h-48 object-cover w-full rounded-lg gallery-thumbnail ${
                  mainImage === img ? 'active' : ''
                }`}
                alt={`venue-${i + 1}`}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className={`w-2 h-2 rounded-full transition-colors ${
              mainImage === venue.image_url ? 'bg-red-400' : 'bg-gray-300'
            }`}
            onClick={() => handleImageClick(venue.image_url)}
          />
          {venue.images && venue.images.slice(1, 4).map((img, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                mainImage === img ? 'bg-red-400' : 'bg-gray-300'
              }`}
              onClick={() => handleImageClick(img)}
            />
          ))}
        </div>
      </div>

      {/* Info + Booking */}
      <div className="px-4 md:px-20 mt-8 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-semibold text-gray-800">{venue.name}</h2>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600 text-sm">
            <p className="flex items-center gap-1"><FaHome /> {venue.name}</p>
            <p className="flex items-center gap-1"><FaEye /> {viewCount}</p>
            <p className="flex items-center gap-1"><FaUsers /> {venue.capacity} Guests</p>
            <p className="flex items-center gap-1 text-yellow-500">
              {venue.rating?.toFixed(1) || 0} <FaStar />
            </p>
          </div>

          <div className="mt-6 flex gap-4 text-sm">
            {["info", "location", "pricing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full border ${
                  activeTab === tab ? "bg-red-500 text-white" : "text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-4 text-gray-700">
            {activeTab === "info" && (
              <p className="leading-relaxed">{venue.info || "No additional info provided."}</p>
            )}
            {activeTab === "location" && (
              <div>
                <p className="mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <strong>Location:</strong> {venue.location}
                </p>
                <iframe
                  width="100%"
                  height="300"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}&hl=es;z=14&output=embed`}
                  allowFullScreen
                  title="Venue Map"
                />
              </div>
            )}
            {activeTab === "pricing" && (
              <div className="space-y-1">
                <p>🍽️ Rs. {venue.price_per_plate} per plate</p>
                <p>🕒 Rs. {venue.full_day_price} full day</p>
                <p>⏳ Rs. {halfDayPrice} half day</p>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg shadow p-5 h-fit">
          <h3 className="text-lg font-semibold mb-2">
            {nights === 1 ? "1 day" : `${nights} days`}
          </h3>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm mb-2">
              <FaCalendarAlt className="text-red-500" />
              <span className="font-medium">Selected Dates</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Check-in:</span> {formatDate(checkInDate)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Check-out:</span> {formatDate(checkOutDate)}
              </p>
            </div>
          </div>

          <div className="mb-3 text-xs text-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Booked dates (unavailable)</span>
            </div>
            <div className="text-blue-600 font-medium">
              📅 Maximum booking period: 3 days
            </div>
          </div>

          {/* Fixed Calendar Section */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-3 text-gray-700">
              Select Check-in and Check-out Dates
            </h4>
            <div className="calendars-container">
              <div className="calendar-grid">
                {/* Check-in Calendar */}
                <div className="calendar-wrapper">
                  <h5 className="text-xs font-medium mb-2 text-gray-600 text-center">
                    Check-in Date
                  </h5>
                  <Calendar
                    onChange={handleCheckInChange}
                    value={checkInDate}
                    minDate={getTodayDate()}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    tileDisabled={tileDisabledCheckIn}
                  />
                </div>

                {/* Check-out Calendar */}
                <div className="calendar-wrapper">
                  <h5 className="text-xs font-medium mb-2 text-gray-600 text-center">
                    Check-out Date
                  </h5>
                  <Calendar
                    onChange={handleCheckOutChange}
                    value={checkOutDate}
                    minDate={checkInDate}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    tileDisabled={tileDisabledCheckOut}
                  />
                </div>
              </div>
            </div>
          </div>

          {dateError && (
            <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              ⚠️ {dateError}
            </div>
          )}

          {hasBookingConflict() && (
            <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              ⚠️ Selected dates conflict with existing bookings.
            </div>
          )}

          <button
            onClick={handleBookingClick}
            disabled={hasBookingConflict() || dateError}
            className={`mt-4 w-full py-2 rounded-lg text-lg shadow ${
              hasBookingConflict() || dateError
                ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
                : 'bg-red-400 hover:bg-red-300 text-white'
            }`}
          >
            {hasBookingConflict() ? 'Dates Unavailable' : 
             dateError ? 'Invalid Date Selection' : 'Book Now'}
          </button>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default VenueDetails;