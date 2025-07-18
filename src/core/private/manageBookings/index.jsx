import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUsers, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, FaFilter, FaSearch, FaSync, FaChartLine, FaEye, FaDownload, FaStar } from "react-icons/fa";
import Table from "./Table";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const adminId = localStorage.getItem("adminId");
  const token = localStorage.getItem("token"); 

  const fetchBookings = async () => {
    try {
      console.log("Fetching bookings for admin:", adminId);
      
      const res = await fetch(`http://localhost:3000/api/booking/admin/${adminId}`, {
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Fetch failed:", errorData.message);
        return;
      }

      const data = await res.json();
      console.log("Raw bookings data:", data);
      
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Unexpected bookings response:", data);
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (adminId && token) {
      fetchBookings();
    } else {
      console.log("Missing adminId or token:", { adminId, token: !!token });
      setLoading(false);
    }
  }, [adminId, token]);

  // Admin confirms or cancels a booking
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/booking/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          status,
          payment_status: status === "Confirmed" ? "Paid" : "Cancelled",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Update failed:", errorData.message);
        return;
      }

      fetchBookings(); 
    } catch (err) {
      console.error(`Failed to update booking status to ${status}:`, err);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings();
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch = 
      (booking.name && booking.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.venue_id?.name && booking.venue_id.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.email && booking.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "Pending").length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F87171]/10 to-rose-600/10"></div>
        <div className="relative max-w-7xl mx-auto p-6">
          <div className="text-center py-32">
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[#F87171] to-[#] rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <FaSpinner className="animate-spin text-3xl text-[#F87171]" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-[#F87171] to-[#F87171] bg-clip-text text-transparent">
                Loading Bookings
              </h2>
              <p className="text-gray-600 text-lg">Please wait while we fetch your booking data...</p>
              <div className="flex justify-center mt-8 space-x-2">
                <div className="w-3 h-3 bg-[#F87171] rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-[#F87171] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-[#F87171] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F87171]/5 to-rose-600/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#F87171]/10 to-rose-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-[#F87171] to-[#F87171] rounded-xl shadow-lg">
                  <FaCalendarAlt className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F87171] to-[#F87171] bg-clip-text text-transparent">
                    Manage Bookings
                  </h1>
                  <p className="text-gray-600 text-lg">View and manage all venue bookings with real-time updates</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="group relative px-6 py-3 bg-gradient-to-r from-[#F87171] to-[#F87171] text-white rounded-xl hover:from-[#F87171]/90 hover:to-[#F87171] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-2">
                  <FaSync className={`text-sm ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group">
                <FaDownload className="text-sm group-hover:text-[#F87171] transition-colors duration-300" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F87171]/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-[#F87171] mt-1 flex items-center">
                    <FaStar className="mr-1 text-xs" />
                    +12% from last month
                  </p>
                </div>
                <div className="bg-gradient-to-r from-[#F87171] to-[#F87171] p-4 rounded-xl shadow-lg">
                  <FaCalendarAlt className="text-white text-2xl" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-xs text-yellow-600 mt-1">Awaiting confirmation</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-[#F87171] p-4 rounded-xl shadow-lg">
                  <FaClock className="text-white text-2xl" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                  <p className="text-xs text-green-600 mt-1">Successfully booked</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl shadow-lg">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Cancelled</p>
                  <p className="text-3xl font-bold text-[#F87171]">{stats.cancelled}</p>
                  <p className="text-xs text-[#F87171] mt-1">Cancelled bookings</p>
                </div>
                <div className="bg-gradient-to-r from-[#F87171] to-[#F87171] p-4 rounded-xl shadow-lg">
                  <FaTimesCircle className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative group">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Search by customer name, venue, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F87171]/5 to-rose-600/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
                  <FaFilter className="text-gray-600" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-6 py-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {bookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                There are no bookings for this admin account yet. Bookings will appear here once customers make reservations.
              </p>
              <button
                onClick={handleRefresh}
                className="px-8 py-3 bg-gradient-to-r from-[#F87171] to-[#F87171] text-white rounded-xl hover:from-[#F87171]/90 hover:to-[#F87171] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <FaChartLine className="text-[#F87171]" />
                  <span>Bookings Overview</span>
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                  </span>
                  <div className="w-2 h-2 bg-[#F87171] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <Table bookings={filteredBookings} onUpdateStatus={handleUpdateStatus} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageBookings;
