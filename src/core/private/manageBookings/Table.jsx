import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaEdit, FaEnvelope, FaEye, FaHourglassHalf, FaMapMarkerAlt, FaTimesCircle, FaUser, FaUsers } from "react-icons/fa";

function Table({ bookings, onUpdateStatus }) {
  const [loading, setLoading] = useState(false);

  // Debug function to log booking data
  useEffect(() => {
    if (bookings.length > 0) {
      console.log("Bookings data:", bookings);
      console.log("First booking user_id:", bookings[0]?.user_id);
      console.log("First booking name:", bookings[0]?.name);
      console.log("First booking email:", bookings[0]?.email);
    }
  }, [bookings]);

  // Get user display name - try multiple sources
  const getUserDisplayName = (booking) => {
    // First try to get from user_id if it's populated
    if (booking.user_id && typeof booking.user_id === 'object' && booking.user_id.fname) {
      return booking.user_id.fname;
    }

    // Then try the name field from booking
    if (booking.name) {
      return booking.name;
    }

    // Finally, try user_id as string (if it's just an ID)
    if (booking.user_id && typeof booking.user_id === 'string') {
      return `User ID: ${booking.user_id.slice(-6)}`;
    }

    return "Unknown User";
  };

  // Get user email - try multiple sources
  const getUserEmail = (booking) => {
    // First try to get from user_id if it's populated
    if (booking.user_id && typeof booking.user_id === 'object' && booking.user_id.email) {
      return booking.user_id.email;
    }

    // Then try the email field from booking
    if (booking.email) {
      return booking.email;
    }

    return "N/A";
  };

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          icon: FaCheckCircle,
          color: "text-green-600",
          bg: "bg-gradient-to-r from-green-50 to-emerald-50",
          border: "border-green-200",
          shadow: "shadow-green-100"
        };
      case "Pending":
        return {
          icon: FaHourglassHalf,
          color: "text-yellow-600",
          bg: "bg-gradient-to-r from-yellow-50 to-orange-50",
          border: "border-yellow-200",
          shadow: "shadow-yellow-100"
        };
      case "Cancelled":
        return {
          icon: FaTimesCircle,
          color: "text-[#F87171]",
          bg: "bg-gradient-to-r from-red-50 to-pink-50",
          border: "border-red-200",
          shadow: "shadow-red-100"
        };
      default:
        return {
          icon: FaHourglassHalf,
          color: "text-gray-600",
          bg: "bg-gradient-to-r from-gray-50 to-gray-100",
          border: "border-gray-200",
          shadow: "shadow-gray-100"
        };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <FaUser className="text-blue-600 text-sm" />
                </div>
                <span>Customer</span>
              </div>
            </th>
            <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <FaEnvelope className="text-green-600 text-sm" />
                </div>
                <span>Email</span>
              </div>
            </th>
            <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <FaMapMarkerAlt className="text-purple-600 text-sm" />
                </div>
                <span>Venue</span>
              </div>
            </th>
            <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg">
                  <FaCalendarAlt className="text-indigo-600 text-sm" />
                </div>
                <span>Event</span>
              </div>
            </th>
            <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                  <FaCalendarAlt className="text-[#F87171] text-sm" />
                </div>
                <span>Date</span>
              </div>
            </th>
            <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg">
                  <FaUsers className="text-teal-600 text-sm" />
                </div>
                <span>Guests</span>
              </div>
            </th>
            <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Array.isArray(bookings) && bookings.length > 0 ? (
            bookings.map((booking, index) => {
              const statusInfo = getStatusInfo(booking.status);
              const StatusIcon = statusInfo.icon;

              return (
                <tr
                  key={booking._id}
                  className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 transform hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <FaUser className="text-white text-lg" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {getUserDisplayName(booking)}
                        </div>
                        <div className="text-xs text-gray-500">Customer</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{getUserEmail(booking)}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                      {booking.venue_id?.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {booking.event_id?.eventName || "N/A"}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {new Date(booking.check_in_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border border-teal-200 shadow-sm">
                        <FaUsers className="mr-1.5 h-3 w-3" />
                        {booking.guests}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color} shadow-sm`}>
                      <StatusIcon className="mr-2 h-4 w-4" />
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    {booking.status === "Pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onUpdateStatus(booking._id, "Confirmed")}
                          className="group/btn inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <FaCheckCircle className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                          Confirm
                        </button>
                        <button
                          onClick={() => onUpdateStatus(booking._id, "Cancelled")}
                          className="group/btn inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <FaTimesCircle className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                          Cancel
                        </button>
                      </div>
                    )}
                    {booking.status !== "Pending" && (
                      <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                          <FaEye className="mr-1.5 h-3 w-3" />
                          View
                        </button>
                        <button className="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                          <FaEdit className="mr-1.5 h-3 w-3" />
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="px-8 py-16 text-center text-gray-500" colSpan="8">
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-lg">Loading bookings...</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No bookings found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Try adjusting your search or filter criteria to find the bookings you're looking for.
                    </p>
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
