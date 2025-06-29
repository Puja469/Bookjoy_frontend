import React, { useEffect, useState } from "react";
import { fetchBookingsByUser } from "../../../../services/apiServices";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const data = await fetchBookingsByUser(userId, token);
        setBookings(data);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchUserBookings();
    } else {
      setLoading(false);
      setError("User not logged in.");
    }
  }, [userId, token]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading bookings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center text-gray-500">No bookings found.</p>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50"
        >
          <h3 className="text-lg font-semibold">
            {booking.venue_id?.name || "Unnamed Venue"}
          </h3>
          <p>
            Date:{" "}
            {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
            {new Date(booking.check_out_date).toLocaleDateString()}
          </p>
          <p>Function Time: {booking.function_time || "Not provided"}</p>
          <p className="font-medium">
            Status:{" "}
            <span
              className={
                booking.status === "Confirmed"
                  ? "text-green-600"
                  : booking.status === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {booking.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
