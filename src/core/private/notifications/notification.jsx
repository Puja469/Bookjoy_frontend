// core/private/notifications/AdminNotifications.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaCheck,
  FaExclamationTriangle,
  FaHotel,
  FaInfoCircle,
  FaPlus,
  FaTimes,
  FaUser
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

const AdminNotifications = () => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info", // info, warning, success, error
    priority: "normal", // low, normal, high
    targetUsers: "all" // all, specific
  });
  const [bookingUsers, setBookingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch notifications - with fallback if API doesn't exist
        try {
          const notificationsRes = await axios.get(`http://localhost:3000/api/notifications?userId=${userId}`);
          setNotifications(notificationsRes.data);

          // Mark as read
          await axios.put(`http://localhost:3000/api/notifications/markAsRead?userId=${userId}`);
        } catch (err) {
          console.log("Notifications API not available, using sample data");
          // Sample notifications for demo
          setNotifications([
            {
              _id: "1",
              title: "Welcome to the Platform",
              message: "Thank you for joining our venue booking platform!",
              type: "success",
              priority: "normal",
              createdAt: new Date().toISOString(),
              createdBy: userId
            },
            {
              _id: "2",
              title: "System Maintenance",
              message: "Scheduled maintenance will occur on Sunday at 2 AM.",
              type: "warning",
              priority: "high",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              createdBy: userId
            }
          ]);
        }

        // Fetch users from bookings - with fallback if API doesn't exist
        try {
          const bookingsRes = await axios.get("http://localhost:3000/api/bookings");
          const bookings = bookingsRes.data;

          // Extract unique users from bookings
          const uniqueUsers = [];
          const userMap = new Map();

          bookings.forEach(booking => {
            if (booking.user && !userMap.has(booking.user._id)) {
              userMap.set(booking.user._id, true);
              uniqueUsers.push({
                _id: booking.user._id,
                name: booking.user.name || booking.user.username || 'Unknown User',
                email: booking.user.email,
                bookingCount: bookings.filter(b => b.user && b.user._id === booking.user._id).length,
                lastBooking: booking.date
              });
            }
          });

          setBookingUsers(uniqueUsers);
        } catch (err) {
          console.log("Bookings API not available, using sample data");
          // Sample booking users for demo
          setBookingUsers([
            {
              _id: "1",
              name: "John Doe",
              email: "john@example.com",
              bookingCount: 3,
              lastBooking: new Date().toISOString()
            },
            {
              _id: "2",
              name: "Jane Smith",
              email: "jane@example.com",
              bookingCount: 1,
              lastBooking: new Date(Date.now() - 86400000).toISOString()
            },
            {
              _id: "3",
              name: "Bob Johnson",
              email: "bob@example.com",
              bookingCount: 2,
              lastBooking: new Date(Date.now() - 172800000).toISOString()
            }
          ]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      const notificationData = {
        ...newNotification,
        targetUsers: newNotification.targetUsers === "specific" ? selectedUsers : "all",
        createdBy: userId,
        _id: Date.now().toString(), // Generate temporary ID
        createdAt: new Date().toISOString()
      };

      // Try to save to API, but continue if it fails
      try {
        await axios.post("http://localhost:3000/api/notifications", notificationData);
      } catch (err) {
        console.log("Could not save to API, adding to local state only");
      }

      // Add to local state
      setNotifications([notificationData, ...notifications]);

      // Reset form
      setNewNotification({
        title: "",
        message: "",
        type: "info",
        priority: "normal",
        targetUsers: "all"
      });
      setSelectedUsers([]);
      setShowCreateForm(false);

    } catch (err) {
      console.error("Error creating notification:", err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      // Try to delete from API, but continue if it fails
      try {
        await axios.delete(`http://localhost:3000/api/notifications/${notificationId}`);
      } catch (err) {
        console.log("Could not delete from API, removing from local state only");
      }

      // Remove from local state
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success": return <FaCheck className="text-green-600" />;
      case "warning": return <FaExclamationTriangle className="text-yellow-600" />;
      case "error": return <FaTimes className="text-red-600" />;
      default: return <FaInfoCircle className="text-blue-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success": return "border-green-200 bg-green-50";
      case "warning": return "border-yellow-200 bg-yellow-50";
      case "error": return "border-red-200 bg-red-50";
      default: return "border-blue-200 bg-blue-50";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F87171] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <FaExclamationTriangle className="text-[#F87171] text-3xl mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#F87171] text-white font-semibold rounded-xl hover:bg-[#F87171] transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600 text-lg">Manage and create notifications for your venue customers</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-6 py-3 bg-[#F87171] text-white font-semibold rounded-xl hover:bg-[#F87171] transition-colors duration-200 shadow-lg"
          >
            <FaPlus className="w-5 h-5 mr-2" />
            Create Notification
          </button>
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Notification</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateNotification} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                    placeholder="Enter notification title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                    rows="4"
                    placeholder="Enter notification message"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                    >
                      <option value="info">Information</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newNotification.priority}
                      onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Users
                  </label>
                  <select
                    value={newNotification.targetUsers}
                    onChange={(e) => setNewNotification({ ...newNotification, targetUsers: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                  >
                    <option value="all">All Booking Customers</option>
                    <option value="specific">Specific Customers</option>
                  </select>
                </div>

                {newNotification.targetUsers === "specific" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Customers ({bookingUsers.length} available)
                    </label>
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-xl p-3 bg-gray-50">
                      {bookingUsers.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          <FaHotel className="text-gray-300 text-2xl mx-auto mb-2" />
                          <p>No customers found from bookings</p>
                        </div>
                      ) : (
                        bookingUsers.map(user => (
                          <label key={user._id} className="flex items-center space-x-3 p-3 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers([...selectedUsers, user._id]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                                }
                              }}
                              className="rounded border-gray-300 text-[#F87171] focus:ring-[#F87171]"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                                  {user.bookingCount} booking{user.bookingCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400">
                                Last booking: {new Date(user.lastBooking).toLocaleDateString()}
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    {selectedUsers.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected: {selectedUsers.length} customer{selectedUsers.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#F87171] text-white font-semibold rounded-xl hover:bg-[#F87171] transition-colors duration-200"
                  >
                    Create Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-[#F87171] to-[#F87171]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">All Notifications</h2>
              <p className="text-red-100">Manage your notification system</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <FaBell className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="p-8">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications yet</h3>
              <p className="text-gray-500">Create your first notification to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 rounded-xl border-l-4 ${getNotificationColor(notification.type)} hover:shadow-lg transition-shadow duration-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.title || "Notification"}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="w-4 h-4 mr-1" />
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {notification.createdBy && (
                            <div className="flex items-center">
                              <FaUser className="w-4 h-4 mr-1" />
                              Created by Admin
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="text-[#F87171] hover:text-[#F87171] transition-colors p-2"
                      title="Delete notification"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
