import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { FaChevronLeft, FaChevronRight, FaHeart, FaStar } from "react-icons/fa";
import {
  fetchVenuesByEvent,
  toggleFavoriteVenue,
  fetchUserDetails,
} from "../../../services/apiServices";

function FilteredVenues() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [price, setPrice] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchVenuesAndFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const venuesData = await fetchVenuesByEvent(event);
        setVenues(venuesData);
        setFilteredVenues(venuesData);

        if (userId && token) {
          const userData = await fetchUserDetails(userId, token);
          setFavorites(userData.favorites || []);
        }

        const indexes = {};
        venuesData.forEach((venue) => {
          indexes[venue._id] = 0;
        });
        setImageIndexes(indexes);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load venues. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (event) {
      fetchVenuesAndFavorites();
    }
  }, [event, userId, token]);

  const handleNext = (venueId, images) => {
    setImageIndexes((prev) => ({
      ...prev,
      [venueId]: (prev[venueId] + 1) % images.length,
    }));
  };

  const handlePrev = (venueId, images) => {
    setImageIndexes((prev) => ({
      ...prev,
      [venueId]: prev[venueId] === 0 ? images.length - 1 : prev[venueId] - 1,
    }));
  };

  const handleToggleFavorite = async (e, venueId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!userId || !token) return;
      const response = await toggleFavoriteVenue(userId, venueId, token);
      setFavorites(response.favorites || []);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const isFavorite = (venueId) => favorites.includes(venueId);

  const handleSearch = () => {
    let filtered = venues;

    if (price) {
      const parsedPrice = parseInt(price);
      if (!isNaN(parsedPrice)) {
        filtered = filtered.filter((venue) => venue.price_per_plate <= parsedPrice);
      }
    }

    if (checkInDate && checkOutDate) {
      filtered = filtered.filter((venue) => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        return checkIn <= checkOut;
      });
    }

    setFilteredVenues(filtered);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading {event} venues...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* ✅ Background banner with side gaps */}
      <div className="px-5 mt-4">
        <div
          className="relative bg-cover bg-center h-[450px] rounded-xl overflow-hidden"
          style={{ backgroundImage: "url('/assets/images/banner2.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Find Hotel {event} Venues
            </h1>
            <div className="flex flex-wrap gap-4 mt-4">
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="px-4 py-2 rounded-lg text-black"
              />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="px-4 py-2 rounded-lg text-black"
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Max Price per Plate"
                className="px-4 py-2 rounded-lg text-black"
              />
              <button
                className="bg-[#F87171] text-white px-6 py-2 rounded-lg"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Venue Grid */}
      <div className="px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Compare Hotel {event} Venues: rates, reviews, and availability.
        </h2>

        {filteredVenues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No matching {event} venues found.</p>
            <p className="text-sm text-gray-500">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVenues.map((venue) => {
                const images = venue.images || [];
                const index = imageIndexes[venue._id] || 0;
                const halfDayPrice = Math.floor((venue.full_day_price || 0) / 2);

                return (
                  <Link
                    to={`/venue/${venue._id}`}
                    key={venue._id}
                    className="border rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-all"
                  >
                    {token && (
                      <div
                        className="absolute top-3 right-3 z-10 cursor-pointer"
                        onClick={(e) => handleToggleFavorite(e, venue._id)}
                      >
                        <FaHeart
                          className={`text-lg ${isFavorite(venue._id) ? "text-pink-500" : "text-white"}`}
                        />
                      </div>
                    )}

                    <div className="relative w-full h-44 overflow-hidden">
                      {images.length > 0 ? (
                        <img
                          src={`http://localhost:3000/venue_images/${images[index]}`}
                          alt={`${venue.name} - ${event} venue`}
                          className="w-full h-full object-cover transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}

                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-1 rounded-full hover:bg-opacity-90"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handlePrev(venue._id, images);
                            }}
                          >
                            <FaChevronLeft size={14} />
                          </button>
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-1 rounded-full hover:bg-opacity-90"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleNext(venue._id, images);
                            }}
                          >
                            <FaChevronRight size={14} />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{venue.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          {venue.rating?.toFixed(1) || 0} <FaStar />
                        </div>
                      </div>

                      <p className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800 mb-2">
                        View Details
                      </p>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>🍽️ Rs. {venue.price_per_plate} per plate</p>
                        <p>🕒 Rs. {venue.full_day_price} full day</p>
                        <p>⏳ Rs. {halfDayPrice} half day</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <button className="px-6 py-3 bg-[#F87171] hover:bg-[#F87171] text-white rounded-lg shadow">
                View all {event} properties
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default FilteredVenues;
