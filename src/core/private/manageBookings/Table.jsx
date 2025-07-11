import React from "react";

function Table({ bookings, onUpdateStatus }) {
  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 border">User</th>
          <th className="p-2 border">Venue</th>
          <th className="p-2 border">Event</th>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Guests</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(bookings) && bookings.length > 0 ? (
          bookings.map((booking) => (
            <tr key={booking._id}>
              <td className="p-2 border">{booking.name}</td>
              <td className="p-2 border">{booking.venue_id?.name}</td>
              <td className="p-2 border">{booking.event_id?.eventName || "N/A"}</td>
              <td className="p-2 border">
                {new Date(booking.check_in_date).toLocaleDateString()}
              </td>
              <td className="p-2 border">{booking.guests}</td>
              <td className="p-2 border">{booking.status}</td>
              <td className="p-2 border space-x-2">
                {booking.status === "Pending" && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(booking._id, "Confirmed")}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => onUpdateStatus(booking._id, "Cancelled")}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="text-center p-4" colSpan="7">No bookings found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Table;
