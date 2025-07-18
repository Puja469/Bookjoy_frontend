import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaHeart, FaMapMarkerAlt, FaSearch, FaStar, FaUsers } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import {
  fetchAllVenues,
  fetchUserDetails,
  fetchVenuesByEvent,
  toggleFavoriteVenue
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
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const searchQuery = queryParams.get("search");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchVenuesAndFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        let venuesData;

        if (searchQuery) {
          // If there's a search query, fetch all venues and filter them
          venuesData = await fetchAllVenues();

          // Filter venues based on search query
          const filtered = venuesData.filter(venue => {
            const searchTerm = searchQuery.toLowerCase();
            const venueName = venue.name?.toLowerCase() || '';
            const venueLocation = venue.location?.toLowerCase() || '';
            const venueEventName = venue.eventName?.toLowerCase() || '';
            const venueInfo = venue.info?.toLowerCase() || '';

            return venueName.includes(searchTerm) ||
              venueLocation.includes(searchTerm) ||
              venueEventName.includes(searchTerm) ||
              venueInfo.includes(searchTerm);
          });

          setVenues(filtered);
          setFilteredVenues(filtered);
        } else if (event) {
          // If there's an event parameter, fetch venues by event
          venuesData = await fetchVenuesByEvent(event);
          setVenues(venuesData);
          setFilteredVenues(venuesData);
        } else {
          // Default: fetch all venues
          venuesData = await fetchAllVenues();
          setVenues(venuesData);
          setFilteredVenues(venuesData);
        }

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

    fetchVenuesAndFavorites();
  }, [event, searchQuery, userId, token]);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#F87171]/30 border-t-[#F87171] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              {searchQuery ? `Searching for "${searchQuery}"...` : `Loading ${event || 'all'} venues...`}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#F87171]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-lg text-[#F87171]">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
      <Header />

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div
          className="relative h-[500px] bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/banner2.jpeg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

          {/* Floating decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {searchQuery ? `Search Results for "${searchQuery}"` : `Find Perfect ${event || 'All'} Venues`}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {searchQuery
                  ? `Discover venues matching "${searchQuery}". Compare rates, reviews, and availability to find your perfect venue.`
                  : `Discover and compare the best venues for your special ${event || 'celebration'}. From intimate gatherings to grand celebrations, we have the perfect venue for you.`
                }
              </p>

              {/* Enhanced Search Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border-0 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:bg-white transition-all duration-300"
                      placeholder="Check-in Date"
                    />
                  </div>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border-0 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:bg-white transition-all duration-300"
                      placeholder="Check-out Date"
                    />
                  </div>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Max Price per Plate"
                      className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border-0 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:bg-white transition-all duration-300"
                    />
                  </div>
                  <button
                    className="bg-gradient-to-r from-[#F87171] to-[#F87171] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                    onClick={handleSearch}
                  >
                    <FaSearch className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header with stats */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {filteredVenues.length} {searchQuery ? 'Venues' : event ? `${event} Venues` : 'Venues'} Found
            </h2>
            <p className="text-gray-600 text-lg">
              {searchQuery && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[#F87171] font-medium">Search results for "{searchQuery}"</span>
                  <button
                    onClick={() => window.location.href = '/venues'}
                    className="text-sm text-gray-500 hover:text-[#F87171] underline transition-colors duration-300"
                  >
                    Clear search and show all venues
                  </button>
                </div>
              )}
              {!searchQuery && "Compare rates, reviews, and availability to find your perfect venue"}
            </p>
          </div>

          {filteredVenues.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchQuery ? `No venues found for "${searchQuery}"` : 'No matching venues found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try different search terms or browse all venues.'
                  : 'Try adjusting your filters or check back later for new venues.'
                }
              </p>
              <button
                onClick={() => {
                  if (searchQuery) {
                    // If it's a search result, navigate to all venues
                    window.location.href = '/venues';
                  } else {
                    // If it's filtered by event, clear the filters
                    setCheckInDate("");
                    setCheckOutDate("");
                    setPrice("");
                    setFilteredVenues(venues);
                  }
                }}
                className="bg-[#F87171] text-white px-6 py-3 rounded-xl hover:bg-[#F87171] transition-colors duration-300"
              >
                {searchQuery ? 'Browse All Venues' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <>
              {/* Enhanced Venue Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredVenues.map((venue) => {
                  const images = venue.images || [];
                  const index = imageIndexes[venue._id] || 0;
                  const halfDayPrice = Math.floor((venue.full_day_price || 0) / 2);

                  return (
                    <Link
                      to={`/venue/${venue._id}`}
                      key={venue._id}
                      className="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100"
                    >
                      {/* Image Section */}
                      <div className="relative h-40 overflow-hidden">
                        {images.length > 0 ? (
                          <img
                            src={`http://localhost:3000/venue_images/${images[index]}`}
                            alt={`${venue.name} - ${event} venue`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}

                        {/* Favorite Button */}
                        {token && (
                          <button
                            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow"
                            onClick={(e) => handleToggleFavorite(e, venue._id)}
                          >
                            <FaHeart
                              className={`text-base transition-all duration-200 ${isFavorite(venue._id)
                                ? "text-[#F87171]"
                                : "text-gray-300 hover:text-[#F87171]"
                                }`}
                            />
                          </button>
                        )}

                        {/* Image Navigation */}
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePrev(venue._id, images);
                              }}
                            >
                              <FaChevronLeft size={11} className="text-gray-500" />
                            </button>
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleNext(venue._id, images);
                              }}
                            >
                              <FaChevronRight size={11} className="text-gray-500" />
                            </button>
                          </>
                        )}

                        {/* Rating Badge */}
                        <div className="absolute bottom-2 left-2 bg-white rounded px-2 py-0.5 flex items-center space-x-1 shadow text-xs">
                          <FaStar className="text-yellow-400" />
                          <span className="font-semibold text-gray-700">
                            {venue.rating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                        {/* Image counter */}
                        {images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-gray-800 text-white rounded px-2 py-0.5 text-xs font-medium shadow">
                            {index + 1} / {images.length}
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-4">
                        {/* Venue Info */}
                        <div className="mb-2">
                          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-[#F87171] transition-colors duration-200 truncate">
                            {venue.name}
                          </h3>
                          <div className="flex items-center text-gray-400 text-xs mb-1">
                            <FaMapMarkerAlt className="w-3 h-3 mr-1 text-[#F87171]" />
                            <span className="truncate">{venue.location || "Location not specified"}</span>
                          </div>
                          {/* Event type badge */}
                          <span className="inline-flex items-center px-2 py-0.5 bg-[#F87171]/10 rounded text-xs font-medium text-[#F87171] border border-[#F87171]/10">
                            {venue.eventName || event || 'All Events'} Venue
                          </span>
                        </div>

                        {/* Pricing Section */}
                        <div className="flex flex-col gap-1 mb-2">
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Per Plate</span>
                            <span className="font-semibold text-[#F87171]">Rs. {venue.price_per_plate}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Full Day</span>
                            <span className="font-semibold text-gray-700">Rs. {venue.full_day_price}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Half Day</span>
                            <span className="font-semibold text-gray-700">Rs. {halfDayPrice}</span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="text-center mt-2">
                          <span className="inline-flex items-center text-[#F87171] font-semibold text-xs group-hover:scale-105 transition-transform duration-200">
                            View Details
                            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Load More Section */}
              <div className="text-center mt-16">
                <button className="bg-gradient-to-r from-[#F87171] to-[#F87171] text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  View All {searchQuery ? 'Properties' : event ? `${event} Properties` : 'Properties'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FilteredVenues;
