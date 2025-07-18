import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchNotifications,
  fetchUserDetails,
  markNotificationsAsRead,
} from "../services/apiServices";
import socket from "../socket/socket";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const { data: user } = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => fetchUserDetails(userId, token),
    enabled: !!userId && !!token,
  });

  const {
    data: notifications = [],
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId, token),
    enabled: !!userId && !!token,
    onSuccess: (data) => {
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => {
      if (notificationId) {
        // Mark single notification as read
        return markNotificationsAsRead(userId, token, notificationId);
      } else {
        // Mark all notifications as read
        return markNotificationsAsRead(userId, token);
      }
    },
    onSuccess: () => {
      refetchNotifications();
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/register");
  };

  const toggleNotificationDropdown = () => {
    setNotificationOpen((prev) => !prev);
    // Don't auto-mark as read when opening dropdown
  };

  const markAllAsRead = () => {
    if (userId && token) {
      markAsReadMutation.mutate();
    }
  };

  const markSingleAsRead = (notificationId) => {
    if (userId && token && notificationId) {
      markAsReadMutation.mutate(notificationId);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/venues?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchCancel = () => {
    setSearchQuery("");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (userId) {
      socket.emit("joinRoom", userId);
      socket.on("notification", () => {
        refetchNotifications();
      });
      return () => socket.off("notification");
    }
  }, [userId, refetchNotifications]);

  // Update unread count whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      const unread = notifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    }
  }, [notifications]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100/50 text-gray-900 shadow-lg py-2 px-6 z-50 h-20 flex items-center">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-50/30 via-white to-pink-50/30 pointer-events-none"></div>

      <div className="flex items-center justify-between w-full relative z-10">
        {/* Logo Section */}
        <div className="flex items-center">
          <button
            className="lg:hidden text-gray-600 hover:text-[#F87171] focus:outline-none mr-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <Link to="/" className="group">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-20 w-auto max-w-[280px] object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Enhanced Search Bar */}
        <div className="hidden lg:flex flex-grow justify-center px-8">
          <form
            onSubmit={handleSearch}
            className={`relative w-full max-w-2xl transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'
              }`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for venues, events, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-6 py-3 pr-20 border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 shadow-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleSearchCancel}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-[#F87171] hover:bg-[#F87171]/10 rounded-xl transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M16.65 16.65a7 7 0 111.4-1.4L21 21z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Right Section - Notifications & User */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Enhanced Notifications */}
          <div className="relative">
            <button
              className="relative p-3 text-gray-600 hover:text-[#F87171] focus:outline-none rounded-2xl hover:bg-gray-100 transition-all duration-300 group"
              onClick={toggleNotificationDropdown}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F87171] group-hover:scale-110 transition-transform duration-300"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3.001 3.001 0 01-6 0m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-[#F87171] to-pink-500 rounded-full text-white text-xs font-bold shadow-lg animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Enhanced Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden z-20 border border-gray-100/50 animate-slideDown">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-rose-50/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#F87171] to-[#F87171] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3.001 3.001 0 01-6 0m6 0H9" />
                          </svg>
                        </div>
                        {unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F87171] rounded-full border-2 border-white animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">Notifications</h4>
                        <p className="text-sm text-gray-500">
                          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                        </p>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-[#F87171] hover:text-[#f76565] font-semibold px-4 py-2 rounded-xl hover:bg-[#F87171]/10 transition-all duration-300 flex items-center space-x-2"
                        disabled={markAsReadMutation.isLoading}
                      >
                        {markAsReadMutation.isLoading ? (
                          <>
                            <div className="w-4 h-4 border border-[#F87171]/30 border-t-[#F87171] rounded-full animate-spin"></div>
                            <span>Marking...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Mark All Read</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {[...notifications]
                        .sort((a, b) => {
                          if (a.isRead === b.isRead) {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                          }
                          return a.isRead ? 1 : -1; // unread first
                        })
                        .map((notification, index) => (
                          <div
                            key={notification.id || notification._id || `${notification.createdAt}-${notification.message.substring(0, 20)}`}
                            className={`p-4 hover:bg-gray-50/80 transition-all duration-300 relative group ${notification.isRead ? "bg-white" : "bg-gradient-to-r from-rose-50/60 to-pink-50/60"
                              }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Unread indicator */}
                            {!notification.isRead && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#F87171] to-[#F87171]"></div>
                            )}

                            <div className="flex space-x-3 pl-2">
                              {/* Notification Icon */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notification.isRead
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-gradient-to-r from-[#F87171] to-[#F87171] text-white'
                                }`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>

                              {/* Notification Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{
                                      __html: notification.message.replace(
                                        /(http:\/\/[^\s]+)/g,
                                        '<a href="$1" class="text-[#F87171] hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>'
                                      ),
                                    }} />
                                    <div className="flex items-center space-x-2 mt-2">
                                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <p className="text-xs text-gray-400">
                                        {new Date(notification.createdAt).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                      {!notification.isRead && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F87171]/10 text-[#F87171]">
                                          New
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-1 ml-2">
                                    {!notification.isRead && (
                                      <button
                                        onClick={() => markSingleAsRead(notification.id || notification._id)}
                                        className="p-1.5 text-[#F87171] hover:text-[#F87171] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#F87171]/10 rounded-lg"
                                        disabled={markAsReadMutation.isLoading}
                                        title="Mark as read"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </button>
                                    )}
                                    <button
                                      className="p-1.5 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-100 rounded-lg"
                                      title="More options"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    /* Enhanced Empty State */
                    <div className="p-12 text-center">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3.001 3.001 0 01-6 0m6 0H9" />
                          </svg>
                        </div>
                        {/* Floating elements around the icon */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#F87171]/20 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-300/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 -right-4 w-2 h-2 bg-orange-300/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">All caught up!</h3>
                      <p className="text-gray-500 mb-4">You're all up to date with your notifications</p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>We'll notify you when something important happens</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Section */}
                {notifications.length > 0 && (
                  <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                      </p>
                      <button className="text-xs text-[#F87171] hover:text-[#F87171] font-medium hover:underline">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced User Section */}
          {user ? (
            <div className="flex items-center space-x-3 relative">
              <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-2xl hover:bg-gray-100 transition-all duration-300 group"
                onClick={() => setDropdownOpen((prev) => !prev)}>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-[#F87171] transition-colors duration-300">
                    {user.fname}
                  </span>
                  <p className="text-xs text-gray-500">Welcome back!</p>
                </div>
                <div className="relative">
                  <img
                    src={user.image ? `http://localhost:3000${user.image}` : "https://via.placeholder.com/150"}
                    alt={user.fname}
                    className="h-10 w-10 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Enhanced User Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-full mt-3 right-0 w-56 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden z-20 border border-gray-100/50 animate-slideDown">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.image ? `http://localhost:3000${user.image}` : "https://via.placeholder.com/150"}
                        alt={user.fname}
                        className="h-12 w-12 rounded-full border-2 border-white shadow-lg"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{user.fname}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 flex items-center space-x-3 group"
                      onClick={() => navigate("/my-account")}
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Account</span>
                    </button>
                    <button
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 flex items-center space-x-3 group"
                      onClick={handleLogout}
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-6 py-3 text-sm bg-gradient-to-r from-[#F87171] to-[#F87171] text-white rounded-2xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold relative overflow-hidden group"
              onClick={() => navigate("/register")}
            >
              <span className="relative z-10">Login/Signup</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={toggleMobileMenu}>
          <div className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-b-2xl p-6 animate-slideDown" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-16 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-[#F87171]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleSearchCancel}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65a7 7 0 111.4-1.4L21 21z" />
                  </svg>
                </button>
              </form>

              {user ? (
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    👤 {user.fname}
                  </button>
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-xl transition-colors duration-300" onClick={() => navigate("/my-account")}>
                    My Account
                  </button>
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-xl transition-colors duration-300" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#F87171] to-[#F87171] text-white rounded-xl font-semibold" onClick={() => navigate("/register")}>
                  Login/Signup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}

export default Header;