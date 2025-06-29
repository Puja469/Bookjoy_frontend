import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavoriteVenues } from "../../../../services/apiServices";
import { FaStar } from "react-icons/fa";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading favorites...</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">My Favorite Venues</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">You have no favorite venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((venue) => {
            const image = venue.images?.[0];
            return (
              <Link
                to={`/venue/${venue._id}`}
                key={venue._id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all"
              >
                <img
                  src={`http://localhost:3000/venue_images/${image}`}
                  alt={venue.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-md font-bold text-gray-800 truncate">{venue.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>📍 {venue.location}</p>
                    <p>🍽 Rs. {venue.price_per_plate} per plate</p>
                    <p>💰 Rs. {venue.full_day_price} full day</p>
                    <p className="flex items-center gap-1 text-yellow-500">
                      ⭐ {venue.rating?.toFixed(1) || 0} <FaStar />
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
