import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaHeart, FaMapMarkerAlt, FaSearch, FaSort, FaStar, FaUtensils } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getFavoriteVenues } from "../../../../services/apiServices";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavoriteVenues(userId, token);
        setFavorites(data || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchFavorites();
    }
  }, [userId, token]);

  // Filter and sort favorites
  const filteredAndSortedFavorites = favorites
    .filter(venue =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price_per_plate - b.price_per_plate;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <FaHeart className="text-[#F87171] mr-3 text-2xl" />
              My Favorite Venues
            </h2>
            <p className="text-gray-600">Your saved venues and preferred locations</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#F87171] to-[#F87171]/80 rounded-full p-3 shadow-lg">
              <FaHeart className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        {favorites.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venues by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                </select>
                <FaSort className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewMode === "grid"
                      ? "bg-[#F87171] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewMode === "list"
                      ? "bg-[#F87171] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-[#F87171]/20 to-[#F87171]/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <FaHeart className="text-[#F87171] text-5xl" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#F87171] rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-sm font-bold">0</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Favorite Venues Yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            Start exploring amazing venues and add them to your favorites to see them here.
          </p>
          <Link
            to="/venues"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#F87171] to-[#F87171]/90 text-white font-semibold rounded-xl hover:from-[#F87171]/90 hover:to-[#F87171] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaMapMarkerAlt className="mr-3 text-lg" />
            Explore Venues
          </Link>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredAndSortedFavorites.length} of {favorites.length} favorite venue{filteredAndSortedFavorites.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedFavorites.map((venue, index) => {
                const image = venue.images?.[0];
                return (
                  <div
                    key={venue._id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      <img
                        src={`http://localhost:3000/venue_images/${image}`}
                        alt={venue.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-bold text-gray-800">
                          {venue.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>

                      {/* Favorite Badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-[#F87171] to-[#F87171]/90 rounded-full p-2 shadow-lg">
                        <FaHeart className="text-white text-sm" />
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-sm font-semibold">
                          Rs. {venue.price_per_plate}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#F87171] transition-colors duration-300 line-clamp-1">
                        {venue.name}
                      </h3>

                      <div className="space-y-3 mb-4">
                        {/* Location */}
                        <div className="flex items-center gap-3 text-gray-600">
                          <FaMapMarkerAlt className="text-[#F87171] flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{venue.location}</span>
                        </div>

                        {/* Price per plate */}
                        <div className="flex items-center gap-3 text-gray-600">
                          <FaUtensils className="text-[#F87171] flex-shrink-0" />
                          <span className="text-sm">
                            <span className="font-semibold">Rs. {venue.price_per_plate}</span> per plate
                          </span>
                        </div>

                        {/* Full day price */}
                        <div className="flex items-center gap-3 text-gray-600">
                          <FaCalendarAlt className="text-[#F87171] flex-shrink-0" />
                          <span className="text-sm">
                            <span className="font-semibold">Rs. {venue.full_day_price}</span> full day
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-6">
                        <Link
                          to={`/venue/${venue._id}`}
                          className="block w-full text-center bg-gradient-to-r from-[#F87171] to-[#F87171]/90 text-white font-semibold py-3 px-4 rounded-xl hover:from-[#F87171]/90 hover:to-[#F87171] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredAndSortedFavorites.map((venue, index) => {
                const image = venue.images?.[0];
                return (
                  <div
                    key={venue._id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative md:w-64 h-48 md:h-auto overflow-hidden">
                        <img
                          src={`http://localhost:3000/venue_images/${image}`}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 bg-[#F87171] rounded-full p-2">
                          <FaHeart className="text-white text-sm" />
                        </div>
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-sm" />
                          <span className="text-sm font-bold">{venue.rating?.toFixed(1) || "0.0"}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#F87171] transition-colors duration-300">
                            {venue.name}
                          </h3>
                          <div className="mt-2 md:mt-0">
                            <span className="bg-[#F87171]/10 text-[#F87171] px-4 py-2 rounded-full text-sm font-semibold">
                              Rs. {venue.price_per_plate} per plate
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaMapMarkerAlt className="text-[#F87171]" />
                            <span>{venue.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaCalendarAlt className="text-[#F87171]" />
                            <span>Rs. {venue.full_day_price} full day</span>
                          </div>
                        </div>

                        <Link
                          to={`/venue/${venue._id}`}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#F87171] to-[#F87171]/90 text-white font-semibold rounded-xl hover:from-[#F87171]/90 hover:to-[#F87171] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          View Details
                          <FaMapMarkerAlt className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Enhanced Stats Section */}
      {favorites.length > 0 && (
        <div className="mt-12 bg-gradient-to-br from-[#F87171]/10 via-[#F87171]/5 to-white rounded-2xl p-8 border border-[#F87171]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F87171] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-white text-2xl" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">{favorites.length}</h4>
              <p className="text-gray-600">Total Favorites</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-white text-2xl" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {favorites.length > 0 ? (favorites.reduce((sum, venue) => sum + (venue.rating || 0), 0) / favorites.length).toFixed(1) : "0.0"}
              </h4>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-white text-2xl" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {new Set(favorites.map(venue => venue.location)).size}
              </h4>
              <p className="text-gray-600">Unique Locations</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
