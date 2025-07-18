import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaDownload, FaFilter, FaSearch } from "react-icons/fa";
import { fetchBookingsByUser } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState({});

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const data = await fetchBookingsByUser(userId, token);
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
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

  // Filter and search bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
      const matchesSearch = booking.venue_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.function_time?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "Confirmed":
        return { icon: FaCheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
      case "Pending":
        return { icon: FaHourglassHalf, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
      case "Cancelled":
        return { icon: FaTimesCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
      default:
        return { icon: FaClock, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };
    }
  };

  // Download receipt functionality
  const downloadReceipt = async (booking) => {
    const bookingId = booking._id;
    setDownloading(prev => ({ ...prev, [bookingId]: true }));

    try {
      // Create receipt content
      const receiptContent = `
        BOOKJOY - BOOKING RECEIPT
        ================================
        
        Booking ID: ${booking._id.slice(-8).toUpperCase()}
        Date: ${new Date().toLocaleDateString()}
        
        VENUE DETAILS:
        --------------
        Venue Name: ${booking.venue_id?.name || "Unnamed Venue"}
        Location: ${booking.venue_id?.location || "Location not specified"}
        
        BOOKING DETAILS:
        ----------------
        Check-in Date: ${new Date(booking.check_in_date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
        Check-out Date: ${new Date(booking.check_out_date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
        Function Time: ${booking.function_time || "Not specified"}
        Status: ${booking.status}
        
        PRICING:
        -------
        Price per Plate: Rs. ${booking.venue_id?.price_per_plate || "Not specified"}
        Full Day Price: Rs. ${booking.venue_id?.full_day_price || "Not specified"}
        
        ================================
        Thank you for choosing BookJoy!
        For support: poojapurbey469@gmail.com
        Phone: +977 9805953190
        ================================
      `;

      // Create blob and download
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `booking-receipt-${booking._id.slice(-8).toUpperCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success toast
      toast.success('Receipt downloaded successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt. Please try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setDownloading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="text-red-500 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Bookings</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-[#F87171] text-white px-6 py-3 rounded-xl hover:bg-[#F87171]/90 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCalendarAlt className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
        <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring venues to make your first booking!</p>
        <button 
          onClick={() => window.location.href = '/venues'} 
          className="bg-[#F87171] text-white px-6 py-3 rounded-xl hover:bg-[#F87171]/90 transition-all duration-300"
        >
          Explore Venues
        </button>
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
              <FaCalendarAlt className="text-[#F87171] mr-3 text-2xl" />
              My Bookings
            </h2>
            <p className="text-gray-600">Manage and track all your venue bookings</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#F87171] to-[#F87171]/80 rounded-full p-3 shadow-lg">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings by venue name or function time..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="all">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <FaFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredBookings.length} of {bookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.map((booking) => {
          const statusInfo = getStatusInfo(booking.status);
          const StatusIcon = statusInfo.icon;
          const isDownloading = downloading[booking._id];
          
          return (
            <div
              key={booking._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#F87171]/20"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#F87171] transition-colors duration-300">
                      {booking.venue_id?.name || "Unnamed Venue"}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-[#F87171] text-sm" />
                      <span className="text-sm">{booking.venue_id?.location || "Location not specified"}</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.border}`}>
                    <StatusIcon className={`text-sm ${statusInfo.color}`} />
                    <span className={statusInfo.color}>{booking.status}</span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCalendarAlt className="text-[#F87171] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Check-in Date</p>
                        <p className="text-sm">{new Date(booking.check_in_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCalendarAlt className="text-[#F87171] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Check-out Date</p>
                        <p className="text-sm">{new Date(booking.check_out_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaClock className="text-[#F87171] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Function Time</p>
                        <p className="text-sm">{booking.function_time || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCalendarAlt className="text-[#F87171] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Booking ID</p>
                        <p className="text-sm font-mono text-gray-500">{booking._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => downloadReceipt(booking)}
                    disabled={isDownloading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isDownloading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#F87171] text-white hover:bg-[#F87171]/90 transform hover:scale-105'
                    }`}
                  >
                    <FaDownload className={`text-sm ${isDownloading ? 'animate-pulse' : ''}`} />
                    {isDownloading ? 'Downloading...' : 'Download Receipt'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Filter Results */}
      {filteredBookings.length === 0 && bookings.length > 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaSearch className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Matching Bookings</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
            }} 
            className="bg-[#F87171] text-white px-6 py-3 rounded-xl hover:bg-[#F87171]/90 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
